"use client"

import { useState, useEffect, useCallback } from "react"
import { WeatherClient, type WeatherData, type LocationData } from "@weather/core"

interface UseWeatherOptions {
  autoRefresh?: boolean
  refreshInterval?: number // in milliseconds
}

interface UseWeatherResult {
  data: WeatherData | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

const client = new WeatherClient()

/**
 * Hook to fetch weather data for coordinates
 */
export function useWeather(
  lat: number | null,
  lon: number | null,
  options: UseWeatherOptions = {}
): UseWeatherResult {
  const { autoRefresh = true, refreshInterval = 5 * 60 * 1000 } = options

  const [data, setData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchWeather = useCallback(async () => {
    if (lat === null || lon === null) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const weather = await client.getWeather(lat, lon)
      setData(weather)
    } catch (e) {
      setError(e instanceof Error ? e : new Error("Failed to fetch weather"))
    } finally {
      setLoading(false)
    }
  }, [lat, lon])

  useEffect(() => {
    fetchWeather()

    if (autoRefresh && lat !== null && lon !== null) {
      const interval = setInterval(fetchWeather, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [fetchWeather, autoRefresh, refreshInterval, lat, lon])

  return { data, loading, error, refetch: fetchWeather }
}

/**
 * Hook to fetch weather data by location name
 */
export function useWeatherByName(
  locationName: string | null,
  options: UseWeatherOptions = {}
): UseWeatherResult {
  const { autoRefresh = true, refreshInterval = 5 * 60 * 1000 } = options

  const [data, setData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchWeather = useCallback(async () => {
    if (!locationName) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const weather = await client.getWeatherByName(locationName)
      setData(weather)
    } catch (e) {
      setError(e instanceof Error ? e : new Error("Failed to fetch weather"))
    } finally {
      setLoading(false)
    }
  }, [locationName])

  useEffect(() => {
    fetchWeather()

    if (autoRefresh && locationName) {
      const interval = setInterval(fetchWeather, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [fetchWeather, autoRefresh, refreshInterval, locationName])

  return { data, loading, error, refetch: fetchWeather }
}

/**
 * Hook for location search
 */
export function useLocationSearch() {
  const [results, setResults] = useState<LocationData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const search = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setResults([])
      return
    }

    try {
      setLoading(true)
      setError(null)
      const locations = await client.searchLocation(query, 10)
      setResults(locations)
    } catch (e) {
      setError(e instanceof Error ? e : new Error("Search failed"))
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  const clear = useCallback(() => {
    setResults([])
    setError(null)
  }, [])

  return { results, loading, error, search, clear }
}

/**
 * Hook to fetch weather for multiple locations
 */
export function useMultipleWeather(
  locations: Array<{ lat: number; lon: number; id: string }>,
  options: UseWeatherOptions = {}
): {
  data: Map<string, WeatherData>
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
} {
  const { autoRefresh = true, refreshInterval = 5 * 60 * 1000 } = options

  const [data, setData] = useState<Map<string, WeatherData>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchAll = useCallback(async () => {
    if (locations.length === 0) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const results = await Promise.allSettled(
        locations.map(async (loc) => {
          const weather = await client.getWeather(loc.lat, loc.lon)
          return { id: loc.id, weather }
        })
      )

      const newData = new Map<string, WeatherData>()
      for (const result of results) {
        if (result.status === "fulfilled") {
          newData.set(result.value.id, result.value.weather)
        }
      }
      setData(newData)
    } catch (e) {
      setError(e instanceof Error ? e : new Error("Failed to fetch weather"))
    } finally {
      setLoading(false)
    }
  }, [locations])

  useEffect(() => {
    fetchAll()

    if (autoRefresh && locations.length > 0) {
      const interval = setInterval(fetchAll, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [fetchAll, autoRefresh, refreshInterval, locations])

  return { data, loading, error, refetch: fetchAll }
}
