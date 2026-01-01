/**
 * Open-Meteo API Response Types
 */

export interface OpenMeteoForecastResponse {
  latitude: number
  longitude: number
  generationtime_ms: number
  utc_offset_seconds: number
  timezone: string
  timezone_abbreviation: string
  elevation: number
  current_units?: Record<string, string>
  current?: OpenMeteoCurrent
  hourly_units?: Record<string, string>
  hourly?: OpenMeteoHourly
  daily_units?: Record<string, string>
  daily?: OpenMeteoDaily
}

export interface OpenMeteoCurrent {
  time: string
  interval: number
  temperature_2m: number
  relative_humidity_2m: number
  apparent_temperature: number
  is_day: number
  precipitation: number
  rain: number
  showers: number
  snowfall: number
  weather_code: number
  cloud_cover: number
  pressure_msl: number
  surface_pressure: number
  wind_speed_10m: number
  wind_direction_10m: number
  wind_gusts_10m: number
  uv_index?: number
  visibility?: number
}

export interface OpenMeteoHourly {
  time: string[]
  temperature_2m: number[]
  relative_humidity_2m: number[]
  apparent_temperature: number[]
  precipitation_probability: number[]
  precipitation: number[]
  weather_code: number[]
  wind_speed_10m: number[]
  wind_direction_10m: number[]
  is_day: number[]
}

export interface OpenMeteoDaily {
  time: string[]
  temperature_2m_max: number[]
  temperature_2m_min: number[]
  sunrise: string[]
  sunset: string[]
  precipitation_probability_max: number[]
  precipitation_sum: number[]
  weather_code: number[]
  uv_index_max: number[]
  wind_speed_10m_max: number[]
  wind_direction_10m_dominant: number[]
}

export interface OpenMeteoAirQualityResponse {
  latitude: number
  longitude: number
  generationtime_ms: number
  utc_offset_seconds: number
  timezone: string
  timezone_abbreviation: string
  current_units?: Record<string, string>
  current?: OpenMeteoAirQualityCurrent
}

export interface OpenMeteoAirQualityCurrent {
  time: string
  interval: number
  us_aqi: number
  pm2_5: number
  pm10: number
  ozone: number
  nitrogen_dioxide: number
}

export interface OpenMeteoGeocodingResponse {
  results?: OpenMeteoGeocodingResult[]
}

export interface OpenMeteoGeocodingResult {
  id: number
  name: string
  latitude: number
  longitude: number
  elevation?: number
  feature_code: string
  country_code: string
  country: string
  admin1?: string
  admin2?: string
  admin3?: string
  admin4?: string
  timezone: string
  population?: number
  postcodes?: string[]
  country_id?: number
  admin1_id?: number
  admin2_id?: number
  admin3_id?: number
  admin4_id?: number
}
