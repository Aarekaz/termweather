/**
 * Core Weather Types
 * Shared across web, TUI, and CLI interfaces
 */

// Wind direction as compass points
export type WindDirection = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW'

// Pressure trend over time
export type PressureTrend = 'rising' | 'falling' | 'steady'

// UV Index severity levels
export type UVLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'VERY HIGH' | 'EXTREME'

// Air Quality Index ratings
export type AQIRating = 'EXCELLENT' | 'GOOD' | 'MODERATE' | 'UNHEALTHY' | 'VERY UNHEALTHY' | 'HAZARDOUS'

// Weather condition types (derived from WMO codes)
export type WeatherCondition =
  | 'clear'
  | 'partly-cloudy'
  | 'cloudy'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'snow'
  | 'thunderstorm'
  | 'unknown'

// Temperature units
export type TemperatureUnit = 'celsius' | 'fahrenheit'

// Wind speed units
export type WindSpeedUnit = 'kmh' | 'mph' | 'ms' | 'kn'

// Pressure units
export type PressureUnit = 'mb' | 'hPa' | 'inHg'

/**
 * Current weather conditions
 */
export interface CurrentWeather {
  temperature: number
  feelsLike: number
  humidity: number
  uvIndex: number
  windSpeed: number
  windDirection: WindDirection
  windGusts?: number
  pressure: number
  pressureTrend: PressureTrend
  visibility: number
  cloudCover: number
  weatherCode: number
  condition: WeatherCondition
  isDay: boolean
  precipitation?: number
  dewPoint?: number
  snowfall?: number
  precipitationType?: 'rain' | 'snow' | 'mixed' | 'none'
}

/**
 * Sun/Moon times
 */
export interface SunTimes {
  sunrise: string  // HH:mm format
  sunset: string   // HH:mm format
}

/**
 * Air quality data
 */
export interface AirQuality {
  aqi: number  // US AQI scale (0-500)
  pm25?: number
  pm10?: number
  o3?: number
  no2?: number
}

/**
 * Hourly forecast data point
 */
export interface HourlyForecast {
  time: Date
  temperature: number
  feelsLike: number
  humidity: number
  precipitationProbability: number
  precipitation: number
  weatherCode: number
  condition: WeatherCondition
  windSpeed: number
  windDirection: WindDirection
  isDay: boolean
  dewPoint?: number
  windGusts?: number
  snowfall?: number
  rain?: number
  precipitationType?: 'rain' | 'snow' | 'mixed' | 'none'
}

/**
 * Daily forecast data point
 */
export interface DailyForecast {
  date: Date
  temperatureMax: number
  temperatureMin: number
  sunrise: string
  sunset: string
  precipitationProbability: number
  precipitationSum: number
  weatherCode: number
  condition: WeatherCondition
  uvIndexMax: number
  windSpeedMax: number
  windDirection: WindDirection
}

/**
 * Complete weather data for a location
 */
export interface WeatherData {
  location: LocationData
  current: CurrentWeather
  sunTimes: SunTimes
  airQuality?: AirQuality
  hourly: HourlyForecast[]
  daily: DailyForecast[]
  lastUpdated: Date
  timezone: string
}

/**
 * Location data from geocoding
 */
export interface LocationData {
  id: string
  name: string
  country: string
  countryCode: string
  admin1?: string  // State/Province
  admin2?: string  // County/District
  latitude: number
  longitude: number
  timezone: string
  elevation?: number
  population?: number
}

/**
 * Weather metrics for UI display
 * (Compatible with existing widget components)
 */
export interface WeatherMetrics {
  humidity: number
  uvIndex: number
  windSpeed: number
  windDirection: WindDirection
  feelsLike: number
  pressure: number
  pressureTrend: PressureTrend
  visibility: number
  airQuality: number
  sunrise: string
  sunset: string
}

/**
 * WMO Weather Codes to Condition mapping
 * https://open-meteo.com/en/docs
 */
export const WMO_CODE_TO_CONDITION: Record<number, WeatherCondition> = {
  0: 'clear',          // Clear sky
  1: 'clear',          // Mainly clear
  2: 'partly-cloudy',  // Partly cloudy
  3: 'cloudy',         // Overcast
  45: 'fog',           // Fog
  48: 'fog',           // Depositing rime fog
  51: 'drizzle',       // Light drizzle
  53: 'drizzle',       // Moderate drizzle
  55: 'drizzle',       // Dense drizzle
  56: 'drizzle',       // Light freezing drizzle
  57: 'drizzle',       // Dense freezing drizzle
  61: 'rain',          // Slight rain
  63: 'rain',          // Moderate rain
  65: 'rain',          // Heavy rain
  66: 'rain',          // Light freezing rain
  67: 'rain',          // Heavy freezing rain
  71: 'snow',          // Slight snow
  73: 'snow',          // Moderate snow
  75: 'snow',          // Heavy snow
  77: 'snow',          // Snow grains
  80: 'rain',          // Slight rain showers
  81: 'rain',          // Moderate rain showers
  82: 'rain',          // Violent rain showers
  85: 'snow',          // Slight snow showers
  86: 'snow',          // Heavy snow showers
  95: 'thunderstorm',  // Thunderstorm
  96: 'thunderstorm',  // Thunderstorm with slight hail
  99: 'thunderstorm',  // Thunderstorm with heavy hail
}

/**
 * Get weather condition from WMO code
 */
export function getConditionFromCode(code: number): WeatherCondition {
  return WMO_CODE_TO_CONDITION[code] ?? 'unknown'
}

/**
 * Get display-friendly condition name
 */
export function getConditionDisplay(condition: WeatherCondition): string {
  const displays: Record<WeatherCondition, string> = {
    'clear': 'Clear',
    'partly-cloudy': 'Partly Cloudy',
    'cloudy': 'Cloudy',
    'fog': 'Fog',
    'drizzle': 'Drizzle',
    'rain': 'Rain',
    'snow': 'Snow',
    'thunderstorm': 'Thunderstorm',
    'unknown': 'Unknown',
  }
  return displays[condition]
}
