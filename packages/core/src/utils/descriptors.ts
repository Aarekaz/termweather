/**
 * Weather Descriptor Functions
 * Human-readable descriptions for weather metrics
 */

import type { PressureTrend, UVLevel, AQIRating, WindDirection } from '../types'

/**
 * Get humidity comfort level description
 */
export function getHumidityDescription(humidity: number): string {
  if (humidity < 30) return 'Dry'
  if (humidity < 60) return 'Comfortable'
  if (humidity < 80) return 'Humid'
  return 'Very humid'
}

/**
 * Get UV index level
 */
export function getUVLevel(uvIndex: number): UVLevel {
  if (uvIndex < 3) return 'LOW'
  if (uvIndex < 6) return 'MODERATE'
  if (uvIndex < 8) return 'HIGH'
  if (uvIndex < 11) return 'VERY HIGH'
  return 'EXTREME'
}

/**
 * Get UV protection advice
 */
export function getUVAdvice(uvIndex: number): string {
  if (uvIndex < 3) return 'Low risk'
  if (uvIndex < 6) return 'Moderate risk'
  if (uvIndex < 8) return 'Wear sunscreen'
  if (uvIndex < 11) return 'Seek shade, wear sunscreen'
  return 'Avoid sun exposure'
}

/**
 * Get wind description using Beaufort scale
 */
export function getWindBeaufort(speed: number): string {
  if (speed < 1) return 'Calm'
  if (speed < 4) return 'Light air'
  if (speed < 8) return 'Light breeze'
  if (speed < 13) return 'Gentle breeze'
  if (speed < 19) return 'Moderate breeze'
  if (speed < 25) return 'Fresh breeze'
  if (speed < 32) return 'Strong breeze'
  if (speed < 39) return 'Near gale'
  if (speed < 47) return 'Gale'
  if (speed < 55) return 'Strong gale'
  if (speed < 64) return 'Storm'
  return 'Violent storm'
}

/**
 * Get AQI health description
 */
export function getAQIDescription(aqi: number): string {
  if (aqi <= 50) return 'Great for outdoor activity'
  if (aqi <= 100) return 'Acceptable air quality'
  if (aqi <= 150) return 'Sensitive groups may be affected'
  if (aqi <= 200) return 'Everyone may experience effects'
  if (aqi <= 300) return 'Health warnings'
  return 'Hazardous conditions'
}

/**
 * Get AQI rating level
 */
export function getAQIRating(aqi: number): AQIRating {
  if (aqi <= 50) return 'EXCELLENT'
  if (aqi <= 100) return 'GOOD'
  if (aqi <= 150) return 'MODERATE'
  if (aqi <= 200) return 'UNHEALTHY'
  if (aqi <= 300) return 'VERY UNHEALTHY'
  return 'HAZARDOUS'
}

/**
 * Get visibility description
 */
export function getVisibilityDescription(km: number): string {
  if (km >= 10) return 'Clear view'
  if (km >= 4) return 'Moderate visibility'
  if (km >= 1) return 'Poor visibility'
  return 'Very poor visibility'
}

/**
 * Get pressure trend description
 */
export function getPressureTrendDescription(trend: PressureTrend): string {
  const descriptions: Record<PressureTrend, string> = {
    rising: 'Rising - improving weather',
    falling: 'Falling - worsening weather',
    steady: 'Steady - stable conditions',
  }
  return descriptions[trend]
}

/**
 * Get feels-like comparison text
 */
export function getFeelsLikeComparison(feelsLike: number, actual: number): string {
  const diff = Math.abs(feelsLike - actual)

  if (diff < 2) return 'Similar to actual'

  if (feelsLike < actual) {
    return `Cooler than actual (${actual}°)`
  }

  return `Warmer than actual (${actual}°)`
}

/**
 * Get cloud cover description
 */
export function getCloudCoverDescription(percent: number): string {
  if (percent < 10) return 'Clear skies'
  if (percent < 25) return 'Mostly clear'
  if (percent < 50) return 'Partly cloudy'
  if (percent < 75) return 'Mostly cloudy'
  return 'Overcast'
}

/**
 * Get precipitation intensity description
 */
export function getPrecipitationDescription(mm: number): string {
  if (mm === 0) return 'No precipitation'
  if (mm < 0.5) return 'Trace amounts'
  if (mm < 2.5) return 'Light precipitation'
  if (mm < 7.5) return 'Moderate precipitation'
  if (mm < 20) return 'Heavy precipitation'
  return 'Very heavy precipitation'
}

/**
 * Get wind direction as full text
 */
export function getWindDirectionFull(direction: WindDirection): string {
  const names: Record<WindDirection, string> = {
    N: 'North',
    NE: 'Northeast',
    E: 'East',
    SE: 'Southeast',
    S: 'South',
    SW: 'Southwest',
    W: 'West',
    NW: 'Northwest',
  }
  return names[direction]
}
