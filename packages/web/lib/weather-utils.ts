/**
 * Weather Utility Functions
 * Re-exports from @weather/core plus web-specific functions
 */

// Re-export all utilities from core
export {
  getHumidityDescription,
  getUVLevel,
  getUVAdvice,
  getWindBeaufort,
  getAQIDescription,
  getAQIRating,
  getVisibilityDescription,
  getFeelsLikeComparison,
  calculateDaylightDuration,
  getDirectionArrow,
  getPressureTrendSymbol,
} from '@weather/core'

/**
 * Get Tailwind background class for UV index
 * (Web-specific - uses Tailwind classes)
 */
export function getUVBackground(uvIndex: number): string {
  if (uvIndex < 3) return "bg-green-50"
  if (uvIndex < 6) return "bg-yellow-50"
  if (uvIndex < 8) return "bg-orange-50"
  if (uvIndex < 11) return "bg-red-50"
  return "bg-purple-50"
}

/**
 * Get Tailwind background class for AQI
 * (Web-specific - uses Tailwind classes)
 */
export function getAQIBackground(aqi: number | null): string {
  if (aqi == null) return "bg-gray-100"
  if (aqi <= 50) return "bg-green-50"
  if (aqi <= 100) return "bg-lime-50"
  if (aqi <= 150) return "bg-yellow-50"
  if (aqi <= 200) return "bg-orange-50"
  if (aqi <= 300) return "bg-red-50"
  return "bg-purple-50"
}
