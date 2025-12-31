/**
 * Weather Utility Functions
 * Contextual descriptions and helpers for weather metrics
 */

export function getHumidityDescription(humidity: number): string {
  if (humidity < 30) return "Dry"
  if (humidity < 60) return "Comfortable"
  if (humidity < 80) return "Humid"
  return "Very humid"
}

export function getUVAdvice(uvIndex: number): string {
  if (uvIndex < 3) return "Low risk"
  if (uvIndex < 6) return "Moderate risk"
  if (uvIndex < 8) return "Wear sunscreen"
  if (uvIndex < 11) return "Seek shade, wear sunscreen"
  return "Avoid sun exposure"
}

export function getUVLevel(uvIndex: number): string {
  if (uvIndex < 3) return "LOW"
  if (uvIndex < 6) return "MODERATE"
  if (uvIndex < 8) return "HIGH"
  if (uvIndex < 11) return "VERY HIGH"
  return "EXTREME"
}

export function getUVBackground(uvIndex: number): string {
  if (uvIndex < 3) return "bg-green-50"
  if (uvIndex < 6) return "bg-yellow-50"
  if (uvIndex < 8) return "bg-orange-50"
  if (uvIndex < 11) return "bg-red-50"
  return "bg-purple-50"
}

export function getWindBeaufort(speed: number): string {
  if (speed < 1) return "Calm"
  if (speed < 4) return "Light air"
  if (speed < 8) return "Light breeze"
  if (speed < 13) return "Gentle breeze"
  if (speed < 19) return "Moderate breeze"
  if (speed < 25) return "Fresh breeze"
  if (speed < 32) return "Strong breeze"
  if (speed < 39) return "Near gale"
  return "Gale"
}

export function getAQIDescription(aqi: number): string {
  if (aqi <= 50) return "Great for outdoor activity"
  if (aqi <= 100) return "Acceptable air quality"
  if (aqi <= 150) return "Sensitive groups may be affected"
  if (aqi <= 200) return "Everyone may experience effects"
  if (aqi <= 300) return "Health warnings"
  return "Hazardous conditions"
}

export function getAQIRating(aqi: number): string {
  if (aqi <= 50) return "EXCELLENT"
  if (aqi <= 100) return "GOOD"
  if (aqi <= 150) return "MODERATE"
  if (aqi <= 200) return "UNHEALTHY"
  if (aqi <= 300) return "VERY UNHEALTHY"
  return "HAZARDOUS"
}

export function getAQIBackground(aqi: number): string {
  if (aqi <= 50) return "bg-green-50"
  if (aqi <= 100) return "bg-lime-50"
  if (aqi <= 150) return "bg-yellow-50"
  if (aqi <= 200) return "bg-orange-50"
  if (aqi <= 300) return "bg-red-50"
  return "bg-purple-50"
}

export function getVisibilityDescription(km: number): string {
  if (km >= 10) return "Clear view"
  if (km >= 4) return "Moderate visibility"
  if (km >= 1) return "Poor visibility"
  return "Very poor visibility"
}

export function calculateDaylightDuration(sunrise: string, sunset: string): string {
  const [sunriseHour, sunriseMin] = sunrise.split(":").map(Number)
  const [sunsetHour, sunsetMin] = sunset.split(":").map(Number)

  const sunriseMinutes = sunriseHour * 60 + sunriseMin
  const sunsetMinutes = sunsetHour * 60 + sunsetMin

  let durationMinutes = sunsetMinutes - sunriseMinutes

  const hours = Math.floor(durationMinutes / 60)
  const minutes = durationMinutes % 60

  return `${hours}h ${minutes}m`
}

export function getDirectionArrow(direction: string): string {
  const arrows: Record<string, string> = {
    N: "↑",
    NE: "↗",
    E: "→",
    SE: "↘",
    S: "↓",
    SW: "↙",
    W: "←",
    NW: "↖",
  }
  return arrows[direction] || "•"
}

export function getPressureTrendSymbol(trend: "rising" | "falling" | "steady"): string {
  const symbols = {
    rising: "▲",
    falling: "▼",
    steady: "—",
  }
  return symbols[trend]
}

export function getFeelsLikeComparison(feelsLike: number, actual: number): string {
  const diff = Math.abs(feelsLike - actual)

  if (diff < 2) return "Similar to actual"

  if (feelsLike < actual) {
    return `Cooler than actual (${actual}°)`
  }

  return `Warmer than actual (${actual}°)`
}
