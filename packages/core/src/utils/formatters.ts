/**
 * Weather Formatting Functions
 * Convert and format weather data for display
 */

import type { WindDirection, PressureTrend, TemperatureUnit, WindSpeedUnit } from '../types'

/**
 * Format temperature with unit
 */
export function formatTemperature(temp: number, unit: TemperatureUnit = 'celsius'): string {
  const value = unit === 'fahrenheit' ? celsiusToFahrenheit(temp) : temp
  const symbol = unit === 'fahrenheit' ? 'F' : 'C'
  return `${Math.round(value)}°${symbol}`
}

/**
 * Format temperature without unit suffix (just degrees)
 */
export function formatTemp(temp: number, unit: TemperatureUnit = 'celsius'): string {
  const value = unit === 'fahrenheit' ? celsiusToFahrenheit(temp) : temp
  return `${Math.round(value)}°`
}

/**
 * Convert Celsius to Fahrenheit
 */
export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32
}

/**
 * Convert Fahrenheit to Celsius
 */
export function fahrenheitToCelsius(fahrenheit: number): number {
  return ((fahrenheit - 32) * 5) / 9
}

/**
 * Format wind speed with unit
 */
export function formatWindSpeed(speed: number, unit: WindSpeedUnit = 'kmh'): string {
  let value = speed
  let suffix = 'km/h'

  switch (unit) {
    case 'mph':
      value = speed * 0.621371
      suffix = 'mph'
      break
    case 'ms':
      value = speed / 3.6
      suffix = 'm/s'
      break
    case 'kn':
      value = speed * 0.539957
      suffix = 'kn'
      break
  }

  return `${Math.round(value)} ${suffix}`
}

/**
 * Format pressure with unit
 */
export function formatPressure(pressure: number, unit: 'mb' | 'hPa' | 'inHg' = 'mb'): string {
  if (unit === 'inHg') {
    return `${(pressure * 0.02953).toFixed(2)} inHg`
  }
  return `${Math.round(pressure)} ${unit}`
}

/**
 * Format visibility
 */
export function formatVisibility(km: number): string {
  if (km >= 10) {
    return `${Math.round(km)} km`
  }
  return `${km.toFixed(1)} km`
}

/**
 * Format percentage
 */
export function formatPercent(value: number): string {
  return `${Math.round(value)}%`
}

/**
 * Get wind direction arrow symbol
 */
export function getDirectionArrow(direction: WindDirection): string {
  const arrows: Record<WindDirection, string> = {
    N: '↑',
    NE: '↗',
    E: '→',
    SE: '↘',
    S: '↓',
    SW: '↙',
    W: '←',
    NW: '↖',
  }
  return arrows[direction]
}

/**
 * Get pressure trend symbol
 */
export function getPressureTrendSymbol(trend: PressureTrend): string {
  const symbols: Record<PressureTrend, string> = {
    rising: '▲',
    falling: '▼',
    steady: '—',
  }
  return symbols[trend]
}

/**
 * Format time in 12h or 24h format
 */
export function formatTime(date: Date, format: '12h' | '24h' = '24h'): string {
  if (format === '12h') {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Format day of week (short)
 */
export function formatDayShort(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
}

/**
 * Format relative time (e.g., "5 min ago")
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} min ago`

  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`

  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}
