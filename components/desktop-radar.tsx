"use client"

import { useState, useEffect } from "react"
import { Plus, Minus, Compass, Play, Pause, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DesktopCard } from "@/components/responsive-layout"

export function DesktopRadar() {
  const [currentTime, setCurrentTime] = useState(14.5)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showLayers, setShowLayers] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)

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
    <DesktopCard className="h-full flex flex-col">
      {/* Header */}
      <div className="p-5 border-b-2 border-black">
        <div className="flex items-center justify-between mb-1.5">
          <h2 className="text-xl font-bold tracking-tight">RADAR</h2>
          <Button
            variant="outline"
            size="sm"
            className="text-xs font-bold px-3 h-8 bg-transparent hover:bg-gray-100 border-2 border-black"
            onClick={() => setShowLayers(!showLayers)}
          >
            <Layers className="w-3.5 h-3.5 mr-1.5" />
            LAYERS
          </Button>
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-[10px] font-bold">CURRENT VIEW: MANHATTAN, NY</p>
          <span className="text-[10px] font-bold bg-red-600 text-white px-1.5 py-0.5 animate-pulse">LIVE</span>
        </div>
      </div>

      {/* Radar Map */}
      <div className="relative flex-1 min-h-[300px] bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 overflow-hidden">
        {/* Animated precipitation overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-400/40 to-pink-500/30 transition-opacity duration-1000"
          style={{
            opacity: 0.6 + Math.sin(currentTime) * 0.2,
            transform: `scale(${zoomLevel})`,
          }}
        />

        {/* Rain animation overlay */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-4 bg-blue-500 animate-rain"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${0.5 + Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>

        {/* Map controls */}
        <div className="absolute right-4 top-4 space-y-2">
          <Button
            size="icon"
            variant="outline"
            className="bg-white w-10 h-10 hover:bg-gray-100 transition-colors border-2 border-black"
            onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 2))}
          >
            <Plus className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="bg-white w-10 h-10 hover:bg-gray-100 transition-colors border-2 border-black"
            onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.5))}
          >
            <Minus className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="bg-white w-10 h-10 hover:bg-gray-100 transition-colors border-2 border-black"
          >
            <Compass className="w-5 h-5" />
          </Button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-3 left-3 bg-white border-2 border-black p-3">
          <div className="text-[10px] font-bold mb-2">PRECIPITATION</div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 bg-blue-400" />
              <span className="text-[10px] font-bold">LIGHT</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 bg-purple-400" />
              <span className="text-[10px] font-bold">MODERATE</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 bg-pink-500" />
              <span className="text-[10px] font-bold">HEAVY</span>
            </div>
          </div>
        </div>

        {/* Layers Panel */}
        {showLayers && (
          <div className="absolute top-3 left-3 bg-white border-2 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-[10px] font-bold mb-2 border-b border-gray-200 pb-1.5">LAYER OPTIONS</p>
            <div className="space-y-1.5 text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer hover:bg-gray-50 p-0.5 -mx-0.5">
                <input type="checkbox" defaultChecked className="w-3.5 h-3.5" /> Precipitation
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer hover:bg-gray-50 p-0.5 -mx-0.5">
                <input type="checkbox" className="w-3.5 h-3.5" /> Temperature
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer hover:bg-gray-50 p-0.5 -mx-0.5">
                <input type="checkbox" className="w-3.5 h-3.5" /> Wind Speed
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer hover:bg-gray-50 p-0.5 -mx-0.5">
                <input type="checkbox" className="w-3.5 h-3.5" /> Satellite
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="p-5 border-t-2 border-black">
        <div className="flex items-center gap-3">
          <Button
            size="icon"
            className="bg-black text-white hover:bg-gray-800 w-10 h-10 transition-colors shrink-0"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>
          <div className="flex-1">
            <div className="flex justify-between text-[10px] font-bold mb-2">
              <span>12:00</span>
              <span className="text-blue-600 bg-blue-50 px-1.5 py-0.5">NOW ({formatTime(currentTime)})</span>
              <span>18:00</span>
            </div>
            <div
              className="relative h-2.5 bg-gray-200 cursor-pointer group"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const x = e.clientX - rect.left
                const percentage = x / rect.width
                setCurrentTime(12 + percentage * 6)
              }}
            >
              <div
                className="absolute h-2.5 bg-black transition-all duration-100"
                style={{ width: `${((currentTime - 12) / 6) * 100}%` }}
              />
              <div
                className="absolute w-4 h-4 bg-white border-2 border-black -top-0.5 cursor-grab active:cursor-grabbing transition-all duration-100 group-hover:scale-110"
                style={{ left: `calc(${((currentTime - 12) / 6) * 100}% - 8px)` }}
              />
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="border-2 border-black p-3 hover:bg-gray-50 transition-colors">
            <div className="text-[10px] font-bold text-gray-500 mb-1">STORM TRACK</div>
            <div className="text-xl font-bold">NE @ 14 MPH</div>
          </div>
          <div className="border-2 border-black p-3 hover:bg-gray-50 transition-colors">
            <div className="text-[10px] font-bold text-gray-500 mb-1">PRECIP CHANCE</div>
            <div className="text-2xl font-bold text-blue-600">85%</div>
          </div>
        </div>
      </div>
    </DesktopCard>
  )
}
