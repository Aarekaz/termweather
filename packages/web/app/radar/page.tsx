"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Plus, Minus, Compass, Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ResponsiveLayout } from "@/components/responsive-layout"
import { DesktopHome } from "@/components/desktop-home"
import { DesktopLocations } from "@/components/desktop-locations"
import { DesktopRadar } from "@/components/desktop-radar"
import Link from "next/link"

function MobileRadarContent() {
  const [currentTime, setCurrentTime] = useState(14.5)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showLayers, setShowLayers] = useState(false)

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= 18) return 12
        return prev + 0.1
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isPlaying])

  const formatTime = (time: number) => {
    const hours = Math.floor(time)
    const minutes = Math.round((time % 1) * 60)
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
  }

  return (
    <>
      {/* Header */}
      <div className="p-4 pb-3 border-b border-gray-200">
        <div className="flex items-start justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <Link href="/">
              <ArrowLeft className="w-5 h-5 cursor-pointer hover:text-gray-600 transition-colors" />
            </Link>
            <h1 className="text-xl font-bold tracking-tight">RADAR</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-[10px] font-bold px-2.5 h-7 bg-transparent hover:bg-gray-100"
            onClick={() => setShowLayers(!showLayers)}
          >
            LAYERS
          </Button>
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-[10px] font-bold">CURRENT VIEW: MANHATTAN, NY</p>
          <span className="text-[10px] font-bold bg-red-600 text-white px-1.5 py-0.5 animate-pulse">LIVE</span>
        </div>
        {showLayers && (
          <div className="mt-2.5 p-2.5 border-2 border-black bg-white">
            <p className="text-[10px] font-bold mb-1.5">LAYER OPTIONS:</p>
            <div className="space-y-1 text-[10px]">
              <div className="flex items-center gap-1.5">
                <input type="checkbox" defaultChecked className="w-3 h-3" /> Precipitation
              </div>
              <div className="flex items-center gap-1.5">
                <input type="checkbox" className="w-3 h-3" /> Temperature
              </div>
              <div className="flex items-center gap-1.5">
                <input type="checkbox" className="w-3 h-3" /> Wind Speed
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Radar Map */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
        {/* Animated precipitation overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-400/40 to-pink-500/30 transition-opacity duration-1000"
          style={{
            opacity: 0.6 + Math.sin(currentTime) * 0.2,
          }}
        />

        {/* Map controls */}
        <div className="absolute right-4 top-4 space-y-2">
          <Button size="icon" variant="outline" className="bg-white w-10 h-10 hover:bg-gray-100 transition-colors">
            <Plus className="w-5 h-5" />
          </Button>
          <Button size="icon" variant="outline" className="bg-white w-10 h-10 hover:bg-gray-100 transition-colors">
            <Minus className="w-5 h-5" />
          </Button>
          <Button size="icon" variant="outline" className="bg-white w-10 h-10 hover:bg-gray-100 transition-colors">
            <Compass className="w-5 h-5" />
          </Button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-3 left-3 bg-white border-2 border-black p-2.5">
          <div className="text-[10px] font-bold mb-1.5">PRECIPITATION</div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 bg-blue-400" />
              <span className="text-[10px] font-bold">LIGHT</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 bg-purple-400" />
              <span className="text-[10px] font-bold">MODERATE</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 bg-pink-500" />
              <span className="text-[10px] font-bold">HEAVY</span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2.5">
          <Button
            size="icon"
            className="bg-black text-white hover:bg-gray-800 w-9 h-9 transition-colors"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <div className="flex-1">
            <div className="flex justify-between text-[10px] font-bold mb-1.5">
              <span>12:00</span>
              <span className="text-blue-600">NOW ({formatTime(currentTime)})</span>
              <span>18:00</span>
            </div>
            <div
              className="relative h-2 bg-gray-200 rounded-full cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const x = e.clientX - rect.left
                const percentage = x / rect.width
                setCurrentTime(12 + percentage * 6)
              }}
            >
              <div
                className="absolute h-2 bg-black rounded-full transition-all duration-100"
                style={{ width: `${((currentTime - 12) / 6) * 100}%` }}
              />
              <div
                className="absolute w-3.5 h-3.5 bg-white border-2 border-black rounded-full -top-0.5 cursor-grab active:cursor-grabbing transition-all duration-100"
                style={{ left: `calc(${((currentTime - 12) / 6) * 100}% - 7px)` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="p-4 grid grid-cols-2 gap-3">
        <div className="border-2 border-black p-3">
          <div className="text-[10px] font-bold text-gray-500 mb-1">STORM TRACK</div>
          <div className="text-lg font-bold">NE @ 14 MPH</div>
        </div>
        <div className="border-2 border-black p-3">
          <div className="text-[10px] font-bold text-gray-500 mb-1">PRECIP CHANCE</div>
          <div className="text-2xl font-bold text-blue-600">85%</div>
        </div>
      </div>
    </>
  )
}

export default function RadarPage() {
  return (
    <ResponsiveLayout>
      {/* Mobile View */}
      <div className="lg:hidden">
        <MobileRadarContent />
      </div>

      {/* Desktop View - Full Dashboard with Radar highlighted */}
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

            {/* Locations Column */}
            <div className="col-span-3">
              <DesktopLocations />
            </div>

            {/* Radar Column - Highlighted */}
            <div className="col-span-4 ring-4 ring-blue-500 ring-offset-4 ring-offset-[#0a0a0f] rounded-sm">
              <DesktopRadar />
            </div>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  )
}
