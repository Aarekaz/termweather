/**
 * Open-Meteo Weather API Client
 * Free, no API key required
 */

import type {
  WeatherData,
  LocationData,
  CurrentWeather,
  HourlyForecast,
  DailyForecast,
  SunTimes,
  AirQuality,
  WindDirection,
  TemperatureUnit,
  WindSpeedUnit,
} from '../types'
import { getConditionFromCode } from '../types'
import { degreesToWindDirection, calculatePressureTrend } from '../utils'
import type {
  OpenMeteoForecastResponse,
  OpenMeteoAirQualityResponse,
  OpenMeteoGeocodingResponse,
} from './types'
import { WeatherCache } from '../cache'

/**
 * Configuration options for the weather client
 */
export interface WeatherClientConfig {
  temperatureUnit?: TemperatureUnit
  windSpeedUnit?: WindSpeedUnit
  cacheEnabled?: boolean
  cacheTTL?: number // seconds
}

const DEFAULT_CONFIG: Required<WeatherClientConfig> = {
  temperatureUnit: 'celsius',
  windSpeedUnit: 'kmh',
  cacheEnabled: true,
  cacheTTL: 300, // 5 minutes
}

/**
 * Weather API Client using Open-Meteo
 */
export class WeatherClient {
  private config: Required<WeatherClientConfig>
  private cache: WeatherCache

  private readonly FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'
  private readonly AIR_QUALITY_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality'
  private readonly GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'

  constructor(config?: WeatherClientConfig) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.cache = new WeatherCache(this.config.cacheTTL)
  }

  /**
   * Get complete weather data for coordinates
   */
  async getWeather(lat: number, lon: number): Promise<WeatherData> {
    const cacheKey = `weather:${lat.toFixed(4)}:${lon.toFixed(4)}`

    if (this.config.cacheEnabled) {
      const cached = this.cache.get<WeatherData>(cacheKey)
      if (cached) return cached
    }

    // Fetch forecast and air quality in parallel
    const [forecastData, airQualityData] = await Promise.all([
      this.fetchForecast(lat, lon),
      this.fetchAirQuality(lat, lon).catch(() => null), // AQI is optional
    ])

    const weatherData = this.transformForecastResponse(forecastData, airQualityData)

    if (this.config.cacheEnabled) {
      this.cache.set(cacheKey, weatherData)
    }

    return weatherData
  }

  /**
   * Search for locations by name
   */
  async searchLocation(query: string, limit: number = 10): Promise<LocationData[]> {
    const cacheKey = `geo:${query.toLowerCase()}`

    if (this.config.cacheEnabled) {
      const cached = this.cache.get<LocationData[]>(cacheKey)
      if (cached) return cached
    }

    const params = new URLSearchParams({
      name: query,
      count: String(limit),
      language: 'en',
      format: 'json',
    })

    const response = await fetch(`${this.GEOCODING_URL}?${params}`)

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`)
    }

    const data: OpenMeteoGeocodingResponse = await response.json()

    const locations = (data.results || []).map((result) => ({
      id: String(result.id),
      name: result.name,
      country: result.country,
      countryCode: result.country_code,
      admin1: result.admin1,
      admin2: result.admin2,
      latitude: result.latitude,
      longitude: result.longitude,
      timezone: result.timezone,
      elevation: result.elevation,
      population: result.population,
    }))

    if (this.config.cacheEnabled) {
      this.cache.set(cacheKey, locations)
    }

    return locations
  }

  /**
   * Get weather for a location by name (combines search + weather)
   */
  async getWeatherByName(locationName: string): Promise<WeatherData> {
    const locations = await this.searchLocation(locationName, 1)

    if (locations.length === 0) {
      throw new Error(`Location not found: ${locationName}`)
    }

    const location = locations[0]
    const weather = await this.getWeather(location.latitude, location.longitude)

    // Override location data with geocoding result for accurate name
    weather.location = location

    return weather
  }

  /**
   * Fetch forecast data from Open-Meteo
   */
  private async fetchForecast(lat: number, lon: number): Promise<OpenMeteoForecastResponse> {
    const currentParams = [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'rain',
      'weather_code',
      'cloud_cover',
      'pressure_msl',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m',
    ].join(',')

    const hourlyParams = [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'precipitation_probability',
      'precipitation',
      'weather_code',
      'wind_speed_10m',
      'wind_direction_10m',
      'is_day',
    ].join(',')

    const dailyParams = [
      'temperature_2m_max',
      'temperature_2m_min',
      'sunrise',
      'sunset',
      'precipitation_probability_max',
      'precipitation_sum',
      'weather_code',
      'uv_index_max',
      'wind_speed_10m_max',
      'wind_direction_10m_dominant',
    ].join(',')

    const params = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lon),
      current: currentParams,
      hourly: hourlyParams,
      daily: dailyParams,
      timezone: 'auto',
      forecast_days: '7',
    })

    const response = await fetch(`${this.FORECAST_URL}?${params}`)

    if (!response.ok) {
      throw new Error(`Forecast API error: ${response.status}`)
    }

    return response.json()
  }

  /**
   * Fetch air quality data from Open-Meteo
   */
  private async fetchAirQuality(lat: number, lon: number): Promise<OpenMeteoAirQualityResponse> {
    const params = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lon),
      current: 'us_aqi,pm2_5,pm10,ozone,nitrogen_dioxide',
      timezone: 'auto',
    })

    const response = await fetch(`${this.AIR_QUALITY_URL}?${params}`)

    if (!response.ok) {
      throw new Error(`Air Quality API error: ${response.status}`)
    }

    return response.json()
  }

  /**
   * Transform API response to our WeatherData type
   */
  private transformForecastResponse(
    forecast: OpenMeteoForecastResponse,
    airQuality: OpenMeteoAirQualityResponse | null
  ): WeatherData {
    const current = forecast.current!
    const hourly = forecast.hourly!
    const daily = forecast.daily!

    // Get hourly pressures for trend calculation
    const recentPressures = hourly.temperature_2m.slice(0, 6).map((_, i) => {
      // Use temperature as placeholder since we don't have hourly pressure
      return current.surface_pressure
    })

    const currentWeather: CurrentWeather = {
      temperature: current.temperature_2m,
      feelsLike: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      uvIndex: daily.uv_index_max?.[0] ?? 0,
      windSpeed: current.wind_speed_10m,
      windDirection: degreesToWindDirection(current.wind_direction_10m),
      windGusts: current.wind_gusts_10m,
      pressure: current.surface_pressure,
      pressureTrend: calculatePressureTrend(recentPressures),
      visibility: current.visibility ?? 10, // Default to 10km if not available
      cloudCover: current.cloud_cover,
      weatherCode: current.weather_code,
      condition: getConditionFromCode(current.weather_code),
      isDay: current.is_day === 1,
      precipitation: current.precipitation,
    }

    const sunTimes: SunTimes = {
      sunrise: this.extractTime(daily.sunrise[0]),
      sunset: this.extractTime(daily.sunset[0]),
    }

    const airQualityData: AirQuality | undefined = airQuality?.current
      ? {
          aqi: airQuality.current.us_aqi,
          pm25: airQuality.current.pm2_5,
          pm10: airQuality.current.pm10,
          o3: airQuality.current.ozone,
          no2: airQuality.current.nitrogen_dioxide,
        }
      : undefined

    const hourlyForecasts: HourlyForecast[] = hourly.time.slice(0, 48).map((time, i) => ({
      time: new Date(time),
      temperature: hourly.temperature_2m[i],
      feelsLike: hourly.apparent_temperature[i],
      humidity: hourly.relative_humidity_2m[i],
      precipitationProbability: hourly.precipitation_probability[i],
      precipitation: hourly.precipitation[i],
      weatherCode: hourly.weather_code[i],
      condition: getConditionFromCode(hourly.weather_code[i]),
      windSpeed: hourly.wind_speed_10m[i],
      windDirection: degreesToWindDirection(hourly.wind_direction_10m[i]),
      isDay: hourly.is_day[i] === 1,
    }))

    const dailyForecasts: DailyForecast[] = daily.time.map((time, i) => ({
      date: new Date(time),
      temperatureMax: daily.temperature_2m_max[i],
      temperatureMin: daily.temperature_2m_min[i],
      sunrise: this.extractTime(daily.sunrise[i]),
      sunset: this.extractTime(daily.sunset[i]),
      precipitationProbability: daily.precipitation_probability_max[i],
      precipitationSum: daily.precipitation_sum[i],
      weatherCode: daily.weather_code[i],
      condition: getConditionFromCode(daily.weather_code[i]),
      uvIndexMax: daily.uv_index_max[i],
      windSpeedMax: daily.wind_speed_10m_max[i],
      windDirection: degreesToWindDirection(daily.wind_direction_10m_dominant[i]),
    }))

    return {
      location: {
        id: `${forecast.latitude},${forecast.longitude}`,
        name: 'Unknown', // Will be overwritten if using getWeatherByName
        country: '',
        countryCode: '',
        latitude: forecast.latitude,
        longitude: forecast.longitude,
        timezone: forecast.timezone,
        elevation: forecast.elevation,
      },
      current: currentWeather,
      sunTimes,
      airQuality: airQualityData,
      hourly: hourlyForecasts,
      daily: dailyForecasts,
      lastUpdated: new Date(),
      timezone: forecast.timezone,
    }
  }

  /**
   * Extract HH:mm time from ISO date string
   */
  private extractTime(isoString: string): string {
    const date = new Date(isoString)
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  }

  /**
   * Clear the cache
   */
  clearCache(): void {
    this.cache.clear()
  }
}

// Export a default instance for convenience
export const weatherClient = new WeatherClient()
