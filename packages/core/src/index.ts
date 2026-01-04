/**
 * @weather/core
 * Shared weather API client, types, and utilities
 */

// API Client
export { WeatherClient, weatherClient } from './api'
export type { WeatherClientConfig } from './api'

// Types
export * from './types'

// Utilities - Descriptors
export {
  getHumidityDescription,
  getUVLevel,
  getUVAdvice,
  getWindBeaufort,
  getAQIDescription,
  getAQIRating,
  getVisibilityDescription,
  getPressureTrendDescription,
  getFeelsLikeComparison,
  getCloudCoverDescription,
  getPrecipitationDescription,
  getWindDirectionFull,
} from './utils/descriptors'

// Utilities - Formatters
export {
  formatTemperature,
  formatTemp,
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  formatWindSpeed,
  formatPressure,
  formatVisibility,
  formatPercent,
  getDirectionArrow,
  getPressureTrendSymbol,
  formatTime,
  formatDate,
  formatDayShort,
  formatRelativeTime,
} from './utils/formatters'

// Utilities - Calculations
export {
  calculateDaylightDuration,
  calculatePressureTrend,
  degreesToWindDirection,
  calculateHeatIndex,
  calculateWindChill,
  calculateFeelsLike,
  calculateDewPoint,
  calculateSolarNoon,
  uvIndexToPercent,
  aqiToPercent,
} from './utils/calculations'

// Utilities - Precipitation
export {
  findNextPrecipitation,
  calculatePrecipitationAccumulation,
  calculateWeeklyPrecipitation,
  formatPrecipitationAlert,
} from './utils/precipitation'

// Cache
export { WeatherCache } from './cache'
