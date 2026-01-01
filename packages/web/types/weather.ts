/**
 * Weather Type Definitions
 * Type safety for environmental metrics and weather data
 */

export type PressureTrend = "rising" | "falling" | "steady"
export type UVLevel = "LOW" | "MODERATE" | "HIGH" | "VERY HIGH" | "EXTREME"
export type AQIRating = "EXCELLENT" | "GOOD" | "MODERATE" | "UNHEALTHY" | "VERY UNHEALTHY" | "HAZARDOUS"
export type WindDirection = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW"

export interface WeatherMetrics {
  humidity: number
  uvIndex: number
  windSpeed: number
  windDirection: WindDirection
  feelsLike: number
  pressure: number
  pressureTrend: PressureTrend
  visibility: number
  airQuality: number | null
  sunrise: string
  sunset: string
}

export interface WidgetCardProps {
  className?: string
}

export interface HumidityCardProps extends WidgetCardProps {
  humidity: number
}

export interface UVIndexCardProps extends WidgetCardProps {
  uvIndex: number
}

export interface WindCardProps extends WidgetCardProps {
  speed: number
  direction: WindDirection
}

export interface SunriseSunsetCardProps extends WidgetCardProps {
  sunrise: string
  sunset: string
}

export interface FeelsLikeCardProps extends WidgetCardProps {
  feelsLike: number
  actual: number
}

export interface PressureCardProps extends WidgetCardProps {
  pressure: number
  trend: PressureTrend
}

export interface AirQualityCardProps extends WidgetCardProps {
  aqi: number | null
}

export interface VisibilityCardProps extends WidgetCardProps {
  visibility: number
}
