"use client"

import { useState } from "react"
import { Search, Plus, MapPin, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DesktopCard } from "@/components/responsive-layout"
import { useWeatherContext } from "@/contexts/weather-context"
import { useLocationSearch } from "@/hooks/use-weather"
import { toLocation } from "@/lib/weather-adapter"
import ReactAnimatedWeather from "react-animated-weather"

export function DesktopLocations() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)

  const {
    savedLocations,
    currentLocation,
    setCurrentLocation,
    addLocation,
    getWeatherForLocation,
    loadingLocations,
  } = useWeatherContext()

  const { results: searchResults, loading: searchLoading, search } = useLocationSearch()

  // Filter saved locations by search query
  const filteredLocations = savedLocations.filter((loc) =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (showAddDialog && query.length >= 2) {
      search(query)
    }
  }

  const handleAddLocation = (result: typeof searchResults[0]) => {
    addLocation({
      id: result.id,
      name: result.name,
      lat: result.latitude,
      lon: result.longitude,
    })
    setShowAddDialog(false)
    setSearchQuery("")
  }

  const getLocalTime = (timezone: string) => {
    try {
      return new Date().toLocaleTimeString("en-US", {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    } catch {
      return ""
    }
  }

  const iconMap: Record<string, string> = {
    sun: "CLEAR_DAY",
    cloud: "CLOUDY",
    rain: "RAIN",
    snow: "SNOW",
    wind: "WIND",
  }

  const colorMap: Record<string, string> = {
    sun: "#eab308",
    cloud: "#9ca3af",
    rain: "#2563eb",
    snow: "#93c5fd",
    wind: "#6b7280",
  }

  return (
    <DesktopCard className="p-5 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b-2 border-black pb-3">
        <h2 className="text-xl font-bold tracking-tight">LOCATIONS</h2>
        <Button
          size="icon"
          className="bg-black text-white hover:bg-gray-800 h-9 w-9 transition-colors"
          onClick={() => setShowAddDialog(!showAddDialog)}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder={showAddDialog ? "SEARCH NEW CITY..." : "FILTER CITIES..."}
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full border-2 border-black pl-10 pr-3 py-2.5 text-xs font-semibold placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition-shadow"
        />
        {searchLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
        )}
      </div>

      {/* Add City Dialog */}
      {showAddDialog && (
        <div className="mb-4 p-3 border-2 border-black bg-yellow-50">
          <p className="text-xs font-bold mb-2">Search for a city to add:</p>
          {searchResults.length > 0 && (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {searchResults.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleAddLocation(result)}
                  className="w-full text-left p-2 hover:bg-yellow-100 border border-black/20 text-xs"
                >
                  <span className="font-bold">{result.name}</span>
                  {result.admin1 && <span className="text-gray-500">, {result.admin1}</span>}
                  <span className="text-gray-500">, {result.country}</span>
                </button>
              ))}
            </div>
          )}
          {searchQuery.length >= 2 && searchResults.length === 0 && !searchLoading && (
            <p className="text-xs text-gray-500">No cities found</p>
          )}
        </div>
      )}

      {/* Locations List */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto scrollbar-hide">
        {filteredLocations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="font-bold">No cities found</p>
            <p className="text-sm mt-2">Try a different search term</p>
          </div>
        ) : (
          filteredLocations.map((location) => {
            const weatherData = getWeatherForLocation(location.id)
            const isLoading = loadingLocations.has(location.id)
            const isCurrent = currentLocation?.id === location.id

            // Convert to legacy format for display
            const displayData = weatherData ? toLocation(weatherData, isCurrent) : null

            return (
              <button
                key={location.id}
                onClick={() => setCurrentLocation(location)}
                className="w-full text-left"
              >
                <div
                  className={`border-2 border-black p-3 hover:bg-gray-50 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer ${
                    isCurrent ? "bg-blue-50 border-blue-600" : ""
                  }`}
                >
                  {isCurrent && (
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <MapPin className="w-3 h-3 text-blue-600 fill-blue-600" />
                      <span className="text-[10px] font-bold text-blue-600">CURRENT LOCATION</span>
                    </div>
                  )}
                  {displayData?.timezone && (
                    <div className="text-[10px] font-bold text-gray-500 mb-1.5">
                      {getLocalTime(displayData.timezone)}
                    </div>
                  )}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-0.5">{location.name.toUpperCase()}</h3>
                      {displayData && (
                        <p className="text-[10px] text-gray-500 font-mono">{displayData.coords}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2.5">
                      {isLoading ? (
                        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                      ) : displayData ? (
                        <>
                          <div className="border-2 border-black p-1.5">
                            <ReactAnimatedWeather
                              icon={iconMap[displayData.icon] || "CLEAR_DAY"}
                              color={colorMap[displayData.icon] || "#000"}
                              size={24}
                              animate={true}
                            />
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold leading-none">{displayData.temp}°</div>
                            <div className="text-[10px] font-bold mt-0.5">{displayData.condition}</div>
                          </div>
                        </>
                      ) : (
                        <div className="text-xs text-gray-400">Loading...</div>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            )
          })
        )}
      </div>
    </DesktopCard>
  )
}
