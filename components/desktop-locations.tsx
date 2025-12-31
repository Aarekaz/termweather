"use client"

import { useState } from "react"
import { Search, Plus, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DesktopCard } from "@/components/responsive-layout"
import { locations } from "@/lib/mock-data"
import Link from "next/link"
import ReactAnimatedWeather from "react-animated-weather"

export function DesktopLocations() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)

  const filteredLocations = locations.filter((loc) => loc.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const getLocalTime = (timezone: string) => {
    const times: Record<string, string> = {
      "America/New_York": "14:42 PM",
      "Europe/London": "19:42 PM",
      "Asia/Tokyo": "06:42 AM",
      "Australia/Sydney": "07:42 AM",
      "Europe/Paris": "20:42 PM",
      "Asia/Dubai": "23:42 PM",
    }
    return times[timezone] || ""
  }

  const iconMap: Record<string, any> = {
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
          placeholder="SEARCH CITIES..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border-2 border-black pl-10 pr-3 py-2.5 text-xs font-semibold placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition-shadow"
        />
      </div>

      {showAddDialog && (
        <div className="mb-4 p-3 border-2 border-black bg-yellow-50">
          <p className="text-xs font-bold">Add a new city to track weather updates!</p>
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
          filteredLocations.map((location) => (
            <Link key={location.id} href="/">
              <div className="border-2 border-black p-3 hover:bg-gray-50 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer">
                {location.isCurrent && (
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <MapPin className="w-3 h-3 text-blue-600 fill-blue-600" />
                    <span className="text-[10px] font-bold text-blue-600">CURRENT LOCATION</span>
                  </div>
                )}
                {getLocalTime(location.timezone) && (
                  <div className="text-[10px] font-bold text-gray-500 mb-1.5">{getLocalTime(location.timezone)}</div>
                )}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-0.5">{location.name}</h3>
                    <p className="text-[10px] text-gray-500 font-mono">{location.coords}</p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="border-2 border-black p-1.5">
                      <ReactAnimatedWeather
                        icon={iconMap[location.icon] || "CLEAR_DAY"}
                        color={colorMap[location.icon] || "#000"}
                        size={24}
                        animate={true}
                      />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold leading-none">{location.temp}°</div>
                      <div className="text-[10px] font-bold mt-0.5">{location.condition}</div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </DesktopCard>
  )
}
