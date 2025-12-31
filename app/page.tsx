"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ResponsiveLayout } from "@/components/responsive-layout"
import { DesktopHome } from "@/components/desktop-home"
import { DesktopLocations } from "@/components/desktop-locations"
import { DesktopRadar } from "@/components/desktop-radar"
import {
  AnimatedRain,
  AnimatedSun,
  AnimatedCloud,
  AnimatedSnow,
  SmallAnimatedIcon,
} from "@/components/animated-weather-icons"
import { getCurrentLocation, hourlyForecasts, dailyForecasts } from "@/lib/mock-data"
import { EnvironmentalGrid } from "@/components/environmental-grid"
import Link from "next/link"

function MobileHomeContent() {
  const [currentLocation] = useState(getCurrentLocation())
  const hourlyData = hourlyForecasts[currentLocation.id] || hourlyForecasts.nyc
  const weeklyData = dailyForecasts[currentLocation.id] || dailyForecasts.nyc

  const highTemp = currentLocation.temp + 6
  const lowTemp = currentLocation.temp - 6

  const getMainIcon = () => {
    switch (currentLocation.icon) {
      case "rain":
        return <AnimatedRain />
      case "sun":
        return <AnimatedSun />
      case "cloud":
        return <AnimatedCloud />
      case "snow":
        return <AnimatedSnow />
      default:
        return <AnimatedRain />
    }
  }

  return (
    <>
      {/* Header */}
      <div className="p-4 pb-3 border-b border-gray-200">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h1 className="text-xl font-bold tracking-tight">{currentLocation.name}</h1>
            <p className="text-[10px] text-gray-500 font-mono mt-0.5">{currentLocation.coords}</p>
          </div>
          <Link href="/search">
            <Button variant="outline" size="sm" className="text-[10px] font-bold px-2.5 h-7 bg-transparent hover:bg-gray-100">
              CHANGE
            </Button>
          </Link>
        </div>
      </div>

      {/* Current Weather */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[100px] font-bold leading-none tracking-tight">{currentLocation.temp}°</div>
            <div className="text-3xl font-bold text-blue-600 mt-1.5">{currentLocation.condition}</div>
            <div className="text-xl font-bold mt-1.5">
              {highTemp}°/{lowTemp}°
            </div>
          </div>
          <div className="border-3 border-black p-3 mt-2">{getMainIcon()}</div>
        </div>

        {/* Natural Language Summary - Mobile */}
        {currentLocation.summary && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-600 leading-relaxed">{currentLocation.summary}</p>
          </div>
        )}
      </div>

      {/* Environmental Metrics - Mobile */}
      <div className="p-4 border-b border-gray-200">
        <EnvironmentalGrid location={currentLocation} />
      </div>

      {/* Hourly Forecast */}
      <div className="border-b border-gray-200 overflow-x-auto scrollbar-hide">
        <div className="flex min-w-max">
          {hourlyData.map((hour, i) => (
            <div
              key={i}
              className={`flex-shrink-0 w-16 p-2.5 text-center border-r border-gray-200 last:border-r-0 ${
                i === 1 ? "bg-black text-white" : ""
              }`}
            >
              <div className="text-[10px] font-bold mb-1.5 whitespace-nowrap">{hour.time}</div>
              <div className="text-base font-bold mb-1">{hour.temp}°</div>
              {hour.icon && (
                <div className="flex justify-center mb-0.5">
                  <SmallAnimatedIcon type={hour.icon} />
                </div>
              )}
              {hour.precipChance > 0 && (
                <div className="text-[9px] text-blue-600 font-bold">{hour.precipChance}%</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Forecast */}
      <div className="p-4 space-y-3">
        {weeklyData.map((day, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="text-xs font-bold w-10">{day.day}</div>
            <div className="flex-1 flex items-center justify-center">
              <SmallAnimatedIcon type={day.icon} />
              <div className="flex-1 h-0.5 bg-gray-200 mx-2.5" />
            </div>
            <div className="text-xs font-bold">
              {day.high}° / {day.low}°
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default function Page() {
  return (
    <ResponsiveLayout>
      {/* Mobile View */}
      <div className="lg:hidden">
        <MobileHomeContent />
      </div>

      {/* Desktop View - Full Dashboard */}
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
