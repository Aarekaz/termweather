"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { WeatherClient, type WeatherData, type LocationData } from "@weather/core"

// Default locations to show
const DEFAULT_LOCATIONS: SavedLocation[] = [
  { id: "new-york", name: "New York", lat: 40.7128, lon: -74.006, isCurrent: true },
  { id: "london", name: "London", lat: 51.5074, lon: -0.1278 },
  { id: "tokyo", name: "Tokyo", lat: 35.6762, lon: 139.6503 },
  { id: "sydney", name: "Sydney", lat: -33.8688, lon: 151.2093 },
  { id: "paris", name: "Paris", lat: 48.8566, lon: 2.3522 },
  { id: "dubai", name: "Dubai", lat: 25.2048, lon: 55.2708 },
]

export interface SavedLocation {
  id: string
  name: string
  lat: number
  lon: number
  isCurrent?: boolean
}

interface WeatherContextValue {
  // Current location
  currentLocation: SavedLocation | null
  setCurrentLocation: (location: SavedLocation) => void

  // Saved locations
  savedLocations: SavedLocation[]
  addLocation: (location: SavedLocation) => void
  removeLocation: (id: string) => void

  // Weather data cache
  weatherData: Map<string, WeatherData>
  getWeatherForLocation: (id: string) => WeatherData | null

  // Loading states
  loading: boolean
  loadingLocations: Set<string>

  // Fetch functions
  fetchWeatherForLocation: (location: SavedLocation) => Promise<WeatherData | null>
  fetchAllWeather: () => Promise<void>

  // Error handling
  error: Error | null
}

const WeatherContext = createContext<WeatherContextValue | null>(null)

const client = new WeatherClient()

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [currentLocation, setCurrentLocationState] = useState<SavedLocation | null>(null)
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>(DEFAULT_LOCATIONS)
  const [weatherData, setWeatherData] = useState<Map<string, WeatherData>>(new Map())
  const [loading, setLoading] = useState(true)
  const [loadingLocations, setLoadingLocations] = useState<Set<string>>(new Set())
  const [error, setError] = useState<Error | null>(null)

  // Set initial current location
  useEffect(() => {
    const current = savedLocations.find((loc) => loc.isCurrent) || savedLocations[0]
    if (current && !currentLocation) {
      setCurrentLocationState(current)
    }
  }, [savedLocations, currentLocation])

  const setCurrentLocation = useCallback((location: SavedLocation) => {
    // Update isCurrent flag
    setSavedLocations((prev) =>
      prev.map((loc) => ({
        ...loc,
        isCurrent: loc.id === location.id,
      }))
    )
    setCurrentLocationState(location)
  }, [])

  const addLocation = useCallback((location: SavedLocation) => {
    setSavedLocations((prev) => {
      if (prev.some((loc) => loc.id === location.id)) {
        return prev
      }
      return [...prev, location]
    })
  }, [])

  const removeLocation = useCallback((id: string) => {
    setSavedLocations((prev) => prev.filter((loc) => loc.id !== id))
    setWeatherData((prev) => {
      const next = new Map(prev)
      next.delete(id)
      return next
    })
  }, [])

  const getWeatherForLocation = useCallback(
    (id: string) => weatherData.get(id) || null,
    [weatherData]
  )

  const fetchWeatherForLocation = useCallback(async (location: SavedLocation): Promise<WeatherData | null> => {
    setLoadingLocations((prev) => new Set(prev).add(location.id))

    try {
      const data = await client.getWeather(location.lat, location.lon)
      // Enhance with location name
      data.location.name = location.name
      data.location.id = location.id

      setWeatherData((prev) => new Map(prev).set(location.id, data))
      return data
    } catch (e) {
      console.error(`Failed to fetch weather for ${location.name}:`, e)
      return null
    } finally {
      setLoadingLocations((prev) => {
        const next = new Set(prev)
        next.delete(location.id)
        return next
      })
    }
  }, [])

  const fetchAllWeather = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      await Promise.all(savedLocations.map(fetchWeatherForLocation))
    } catch (e) {
      setError(e instanceof Error ? e : new Error("Failed to fetch weather"))
    } finally {
      setLoading(false)
    }
  }, [savedLocations, fetchWeatherForLocation])

  // Initial fetch
  useEffect(() => {
    fetchAllWeather()
  }, []) // Only run once on mount

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(fetchAllWeather, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchAllWeather])

  return (
    <WeatherContext.Provider
      value={{
        currentLocation,
        setCurrentLocation,
        savedLocations,
        addLocation,
        removeLocation,
        weatherData,
        getWeatherForLocation,
        loading,
        loadingLocations,
        fetchWeatherForLocation,
        fetchAllWeather,
        error,
      }}
    >
      {children}
    </WeatherContext.Provider>
  )
}

export function useWeatherContext() {
  const context = useContext(WeatherContext)
  if (!context) {
    throw new Error("useWeatherContext must be used within a WeatherProvider")
  }
  return context
}
