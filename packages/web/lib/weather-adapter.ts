/**
 * Weather Data Adapter
 * Converts @weather/core types to component-friendly formats
 */

import type {
  WeatherData,
  CurrentWeather,
  HourlyForecast as CoreHourlyForecast,
  DailyForecast as CoreDailyForecast,
  WeatherCondition,
  WindDirection,
  PressureTrend,
} from "@weather/core"
import { formatDayShort } from "@weather/core"

/**
 * Legacy Location type for existing components
 */
export interface LegacyLocation {
  id: string
  name: string
  coords: string
  temp: number
  condition: string
  icon: string
  timezone: string
  isCurrent?: boolean
  summary: string
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
 * Legacy hourly forecast for existing components
 */
export interface LegacyHourlyForecast {
  time: string
  temp: number
  icon: string
  precipChance: number
}

/**
 * Legacy daily forecast for existing components
 */
export interface LegacyDailyForecast {
  day: string
  icon: string
  high: number
  low: number
}

/**
 * Map weather condition to icon name
 */
function conditionToIcon(condition: WeatherCondition): string {
  const iconMap: Record<WeatherCondition, string> = {
    clear: "sun",
    "partly-cloudy": "cloud",
    cloudy: "cloud",
    fog: "cloud",
    drizzle: "rain",
    rain: "rain",
    snow: "snow",
    thunderstorm: "rain",
    unknown: "cloud",
  }
  return iconMap[condition]
}

/**
 * Map weather condition to display text
 */
function conditionToDisplay(condition: WeatherCondition, isDay: boolean): string {
  const displayMap: Record<WeatherCondition, string> = {
    clear: isDay ? "SUNNY" : "CLEAR",
    "partly-cloudy": "PARTLY CLOUDY",
    cloudy: "CLOUDY",
    fog: "FOG",
    drizzle: "DRIZZLE",
    rain: "RAIN",
    snow: "SNOW",
    thunderstorm: "THUNDERSTORM",
    unknown: "UNKNOWN",
  }
  return displayMap[condition]
}

/**
 * Generate a natural language summary from weather data
 */
function generateSummary(current: CurrentWeather, daily: CoreDailyForecast[]): string {
  const condition = conditionToDisplay(current.condition, current.isDay)
  const temp = Math.round(current.temperature)
  const feelsLike = Math.round(current.feelsLike)

  let summary = `Currently ${temp}°C and ${condition.toLowerCase()}.`

  if (Math.abs(current.temperature - current.feelsLike) > 2) {
    summary += ` Feels like ${feelsLike}°C.`
  }

  if (current.precipitation && current.precipitation > 0) {
    summary += ` Precipitation expected.`
  }

  if (daily.length > 0) {
    const tomorrow = daily[1]
    if (tomorrow) {
      const tomorrowCondition = conditionToDisplay(tomorrow.condition, true).toLowerCase()
      summary += ` Tomorrow: ${tomorrowCondition}, high of ${Math.round(tomorrow.temperatureMax)}°C.`
    }
  }

  return summary
}

/**
 * Format coordinates for display
 */
function formatCoords(lat: number, lon: number): string {
  const latDir = lat >= 0 ? "N" : "S"
  const lonDir = lon >= 0 ? "E" : "W"
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lon).toFixed(4)}° ${lonDir}`
}

/**
 * Convert WeatherData to LegacyLocation format
 */
export function toLocation(data: WeatherData, isCurrent: boolean = false): LegacyLocation {
  const { current, location, sunTimes, airQuality, daily } = data

  return {
    id: location.id,
    name: location.name.toUpperCase(),
    coords: formatCoords(location.latitude, location.longitude),
    temp: Math.round(current.temperature),
    condition: conditionToDisplay(current.condition, current.isDay),
    icon: conditionToIcon(current.condition),
    timezone: location.timezone,
    isCurrent,
    summary: generateSummary(current, daily),
    humidity: Math.round(current.humidity),
    uvIndex: Math.round(current.uvIndex),
    windSpeed: Math.round(current.windSpeed),
    windDirection: current.windDirection,
    feelsLike: Math.round(current.feelsLike),
    pressure: Math.round(current.pressure),
    pressureTrend: current.pressureTrend,
    visibility: Math.round(current.visibility / 1000), // Convert m to km if needed
    airQuality: airQuality?.aqi ?? 50,
    sunrise: sunTimes.sunrise,
    sunset: sunTimes.sunset,
  }
}

/**
 * Convert hourly forecasts to legacy format
 */
export function toHourlyForecasts(hourly: CoreHourlyForecast[]): LegacyHourlyForecast[] {
  return hourly.slice(0, 24).map((hour) => ({
    time: hour.time.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    temp: Math.round(hour.temperature),
    icon: conditionToIcon(hour.condition),
    precipChance: Math.round(hour.precipitationProbability),
  }))
}

/**
 * Convert daily forecasts to legacy format
 */
export function toDailyForecasts(daily: CoreDailyForecast[]): LegacyDailyForecast[] {
  return daily.slice(0, 5).map((day) => ({
    day: formatDayShort(day.date),
    icon: conditionToIcon(day.condition),
    high: Math.round(day.temperatureMax),
    low: Math.round(day.temperatureMin),
  }))
}

/**
 * Complete adapter: convert WeatherData to all legacy formats
 */
export function adaptWeatherData(
  data: WeatherData,
  isCurrent: boolean = false
): {
  location: LegacyLocation
  hourly: LegacyHourlyForecast[]
  daily: LegacyDailyForecast[]
} {
  return {
    location: toLocation(data, isCurrent),
    hourly: toHourlyForecasts(data.hourly),
    daily: toDailyForecasts(data.daily),
  }
}
