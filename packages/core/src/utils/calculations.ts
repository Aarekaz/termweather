/**
 * Weather Calculation Functions
 * Derived values and computations
 */

import type { PressureTrend, WindDirection } from '../types'

/**
 * Calculate daylight duration from sunrise/sunset times
 * @param sunrise - Time string in HH:mm format
 * @param sunset - Time string in HH:mm format
 * @returns Duration string like "12h 30m"
 */
export function calculateDaylightDuration(sunrise: string, sunset: string): string {
  const [sunriseHour, sunriseMin] = sunrise.split(':').map(Number)
  const [sunsetHour, sunsetMin] = sunset.split(':').map(Number)

  const sunriseMinutes = sunriseHour * 60 + sunriseMin
  const sunsetMinutes = sunsetHour * 60 + sunsetMin

  let durationMinutes = sunsetMinutes - sunriseMinutes
  if (durationMinutes < 0) {
    durationMinutes += 24 * 60 // Handle crossing midnight
  }

  const hours = Math.floor(durationMinutes / 60)
  const minutes = durationMinutes % 60

  return `${hours}h ${minutes}m`
}

/**
 * Calculate pressure trend from historical readings
 * @param pressureHistory - Array of pressure readings (oldest first)
 * @param threshold - Change threshold in mb (default 1.5)
 */
export function calculatePressureTrend(
  pressureHistory: number[],
  threshold: number = 1.5
): PressureTrend {
  if (pressureHistory.length < 2) return 'steady'

  const oldest = pressureHistory[0]
  const newest = pressureHistory[pressureHistory.length - 1]
  const change = newest - oldest

  if (change > threshold) return 'rising'
  if (change < -threshold) return 'falling'
  return 'steady'
}

/**
 * Convert wind direction degrees to compass direction
 * @param degrees - Wind direction in degrees (0-360)
 */
export function degreesToWindDirection(degrees: number): WindDirection {
  // Normalize to 0-360
  const normalized = ((degrees % 360) + 360) % 360

  // Each direction spans 45 degrees, offset by 22.5
  const directions: WindDirection[] = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const index = Math.round(normalized / 45) % 8
  return directions[index]
}

/**
 * Calculate heat index (feels like temperature considering humidity)
 * Uses simplified Rothfusz regression equation
 * @param tempC - Temperature in Celsius
 * @param humidity - Relative humidity percentage
 */
export function calculateHeatIndex(tempC: number, humidity: number): number {
  // Convert to Fahrenheit for the formula
  const T = (tempC * 9) / 5 + 32

  // Heat index is only valid for temps >= 80°F (26.7°C)
  if (T < 80) return tempC

  const HI =
    -42.379 +
    2.04901523 * T +
    10.14333127 * humidity -
    0.22475541 * T * humidity -
    0.00683783 * T * T -
    0.05481717 * humidity * humidity +
    0.00122874 * T * T * humidity +
    0.00085282 * T * humidity * humidity -
    0.00000199 * T * T * humidity * humidity

  // Convert back to Celsius
  return ((HI - 32) * 5) / 9
}

/**
 * Calculate wind chill (feels like temperature considering wind)
 * Uses Environment Canada formula
 * @param tempC - Temperature in Celsius
 * @param windSpeedKmh - Wind speed in km/h
 */
export function calculateWindChill(tempC: number, windSpeedKmh: number): number {
  // Wind chill is only valid for temps <= 10°C and wind >= 4.8 km/h
  if (tempC > 10 || windSpeedKmh < 4.8) return tempC

  return (
    13.12 +
    0.6215 * tempC -
    11.37 * Math.pow(windSpeedKmh, 0.16) +
    0.3965 * tempC * Math.pow(windSpeedKmh, 0.16)
  )
}

/**
 * Calculate apparent temperature (feels like)
 * Combines heat index and wind chill based on conditions
 */
export function calculateFeelsLike(
  tempC: number,
  humidity: number,
  windSpeedKmh: number
): number {
  if (tempC >= 27) {
    return calculateHeatIndex(tempC, humidity)
  } else if (tempC <= 10 && windSpeedKmh >= 4.8) {
    return calculateWindChill(tempC, windSpeedKmh)
  }
  return tempC
}

/**
 * Calculate dew point from temperature and humidity
 * Uses Magnus-Tetens approximation
 */
export function calculateDewPoint(tempC: number, humidity: number): number {
  const a = 17.27
  const b = 237.7
  const gamma = (a * tempC) / (b + tempC) + Math.log(humidity / 100)
  return (b * gamma) / (a - gamma)
}

/**
 * Calculate solar noon time for a given longitude and date
 * Returns time string in HH:mm format
 */
export function calculateSolarNoon(longitude: number, date: Date = new Date()): string {
  // Calculate the day of year
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime()
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24))

  // Equation of time approximation (in minutes)
  const B = ((360 / 365) * (dayOfYear - 81)) * (Math.PI / 180)
  const EoT = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B)

  // Solar noon in UTC
  const solarNoonUTC = 12 - longitude / 15 - EoT / 60

  // Convert to HH:mm
  const hours = Math.floor(solarNoonUTC)
  const minutes = Math.round((solarNoonUTC - hours) * 60)

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

/**
 * Calculate UV index danger level as percentage (for progress bars)
 */
export function uvIndexToPercent(uvIndex: number): number {
  // Max UV index is typically around 11-12, so scale to 15 for safety
  return Math.min(100, (uvIndex / 12) * 100)
}

/**
 * Calculate AQI percentage for display (0-500 scale)
 */
export function aqiToPercent(aqi: number): number {
  return Math.min(100, (aqi / 500) * 100)
}
