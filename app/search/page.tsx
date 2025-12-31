"use client"

import { useState } from "react"
import { Search, Plus, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ResponsiveLayout } from "@/components/responsive-layout"
import { DesktopHome } from "@/components/desktop-home"
import { DesktopLocations } from "@/components/desktop-locations"
import { DesktopRadar } from "@/components/desktop-radar"
import { locations } from "@/lib/mock-data"
import Link from "next/link"
import ReactAnimatedWeather from "react-animated-weather"

function MobileSearchContent() {
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
    <>
      {/* Header */}
      <div className="p-4 pb-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">LOCATIONS</h1>
          <Button
            size="icon"
            className="bg-black text-white hover:bg-gray-800 h-9 w-9 transition-colors"
            onClick={() => setShowAddDialog(!showAddDialog)}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="SEARCH CITIES..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border-2 border-black pl-10 pr-3 py-2 text-xs font-semibold placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition-shadow"
          />
        </div>
        {showAddDialog && (
          <div className="mt-3 p-3 border-2 border-black bg-white">
            <p className="text-xs font-bold">Add a new city to track weather updates!</p>
          </div>
        )}
      </div>

      {/* Locations List */}
      <div className="px-4 pb-4 space-y-3">
        {filteredLocations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="font-bold">No cities found</p>
            <p className="text-sm mt-2">Try a different search term</p>
          </div>
        ) : (
          filteredLocations.map((location) => (
            <Link key={location.id} href="/">
              <div className="border-2 border-black p-3 hover:bg-gray-50 transition-colors cursor-pointer">
                {location.isCurrent && (
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <MapPin className="w-3 h-3 text-blue-600 fill-blue-600" />
                    <span className="text-[10px] font-bold">CURRENT LOCATION</span>
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
                  <div className="flex items-center gap-2">
                    <div className="border-2 border-black p-1.5">
                      <ReactAnimatedWeather
                        icon={iconMap[location.icon] || "CLEAR_DAY"}
                        color={colorMap[location.icon] || "#000"}
                        size={20}
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
    </>
  )
}

export default function SearchPage() {
  return (
    <ResponsiveLayout>
      {/* Mobile View */}
      <div className="lg:hidden">
        <MobileSearchContent />
      </div>

      {/* Desktop View - Full Dashboard with Search highlighted */}
      <div className="hidden lg:block relative p-6">
        <div className="max-w-[1600px] mx-auto">
          {/* Desktop Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">WEATHER DASHBOARD</h1>
              <p className="text-gray-400 font-mono mt-1 text-sm">Real-time weather data and forecasts</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right text-white">
                <div className="text-xs font-bold opacity-70">LAST UPDATED</div>
                <div className="text-base font-mono">14:42 PM EST</div>
              </div>
            </div>
          </div>

          {/* Three Column Layout */}
          <div className="grid grid-cols-12 gap-5">
            {/* Main Weather Column */}
            <div className="col-span-5">
              <DesktopHome />
            </div>

            {/* Locations Column - Highlighted */}
            <div className="col-span-3 ring-4 ring-blue-500 ring-offset-4 ring-offset-[#0a0a0f] rounded-sm">
              <DesktopLocations />
            </div>

            {/* Radar Column */}
            <div className="col-span-4">
              <DesktopRadar />
            </div>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  )
}
