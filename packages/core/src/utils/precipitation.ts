import type { HourlyForecast, DailyForecast } from '../types/index.js'

/**
 * Find the next precipitation event in hourly forecast
 * @param hourly - Array of hourly forecasts
 * @param threshold - Minimum probability threshold (default: 40%)
 * @returns Next precipitation event or null if none found
 */
export function findNextPrecipitation(
  hourly: HourlyForecast[],
  threshold: number = 40
): { hoursUntil: number; probability: number; amount: number } | null {
  for (let i = 0; i < hourly.length; i++) {
    if (hourly[i].precipitationProbability >= threshold) {
      return {
        hoursUntil: i,
        probability: hourly[i].precipitationProbability,
        amount: hourly[i].precipitation,
      }
    }
  }
  return null
}

/**
 * Calculate precipitation accumulation over a time period
 * @param hourly - Array of hourly forecasts
 * @param hours - Number of hours to calculate (default: 24)
 * @returns Precipitation totals and type breakdown
 */
export function calculatePrecipitationAccumulation(
  hourly: HourlyForecast[],
  hours: number = 24
): {
  total: number
  rain: number
  snow: number
  type: 'rain' | 'snow' | 'mixed' | 'none'
} {
  const slice = hourly.slice(0, hours)
  const total = slice.reduce((sum, h) => sum + (h.precipitation || 0), 0)
  const rain = slice.reduce((sum, h) => sum + (h.rain || 0), 0)
  const snow = slice.reduce((sum, h) => sum + (h.snowfall || 0), 0)

  let type: 'rain' | 'snow' | 'mixed' | 'none' = 'none'
  if (total > 0) {
    if (rain > 0 && snow > 0) type = 'mixed'
    else if (snow > 0) type = 'snow'
    else if (rain > 0) type = 'rain'
  }

  return { total, rain, snow, type }
}

/**
 * Calculate weekly precipitation totals
 * @param daily - Array of daily forecasts
 * @returns Weekly precipitation statistics
 */
export function calculateWeeklyPrecipitation(
  daily: DailyForecast[]
): { total: number; days: number; average: number } {
  const total = daily.reduce((sum, d) => sum + (d.precipitationSum || 0), 0)
  return { total, days: daily.length, average: total / daily.length }
}

/**
 * Format precipitation alert message for display
 * @param nextRain - Next precipitation event or null
 * @returns Human-readable alert message
 */
export function formatPrecipitationAlert(
  nextRain: { hoursUntil: number } | null
): string {
  if (!nextRain) return 'No rain expected in next 48 hours'
  if (nextRain.hoursUntil === 0) return 'Rain starting now'
  if (nextRain.hoursUntil === 1) return 'Rain in 1 hour'
  if (nextRain.hoursUntil < 24) return `Rain in ${nextRain.hoursUntil} hours`
  const days = Math.floor(nextRain.hoursUntil / 24)
  return `Rain in ${days} day${days > 1 ? 's' : ''}`
}
