"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DesktopCard } from "@/components/responsive-layout"
import { SmallAnimatedIcon } from "@/components/animated-weather-icons"
import { getCurrentLocation, hourlyForecasts, dailyForecasts } from "@/lib/mock-data"
import Link from "next/link"
import ReactAnimatedWeather from "react-animated-weather"

export function DesktopHome() {
  const [currentLocation] = useState(getCurrentLocation())
  const hourlyData = hourlyForecasts[currentLocation.id] || hourlyForecasts.nyc
  const weeklyData = dailyForecasts[currentLocation.id] || dailyForecasts.nyc
  const highTemp = currentLocation.temp + 6
  const lowTemp = currentLocation.temp - 6

  const getMainIcon = () => {
    switch (currentLocation.icon) {
      case "rain":
        return <ReactAnimatedWeather icon="RAIN" color="#2563eb" size={120} animate={true} />
      case "sun":
        return <ReactAnimatedWeather icon="CLEAR_DAY" color="#eab308" size={120} animate={true} />
      case "cloud":
        return <ReactAnimatedWeather icon="CLOUDY" color="#9ca3af" size={120} animate={true} />
      case "snow":
        return <ReactAnimatedWeather icon="SNOW" color="#93c5fd" size={120} animate={true} />
      default:
        return <ReactAnimatedWeather icon="RAIN" color="#2563eb" size={120} animate={true} />
    }
  }

  return (
    <div className="space-y-5">
      {/* Main Weather Card */}
      <DesktopCard className="p-6">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{currentLocation.name}</h1>
            <p className="text-xs text-gray-500 font-mono mt-1">{currentLocation.coords}</p>
          </div>
          <Link href="/search">
            <Button
              variant="outline"
              className="text-xs font-bold px-3.5 h-9 bg-transparent hover:bg-gray-100 border-2 border-black"
            >
              CHANGE
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-[120px] font-bold leading-none tracking-tight">{currentLocation.temp}°</div>
            <div className="text-4xl font-bold text-blue-600 mt-3">{currentLocation.condition}</div>
            <div className="text-2xl font-bold mt-3">
              {highTemp}°/{lowTemp}°
            </div>
          </div>
          <div className="border-3 border-black p-5">{getMainIcon()}</div>
        </div>
      </DesktopCard>

      {/* Hourly Forecast */}
      <DesktopCard className="p-5">
        <h2 className="text-lg font-bold mb-3 border-b-2 border-black pb-2.5">24-HOUR FORECAST</h2>
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-0 min-w-max">
            {hourlyData.map((hour, i) => (
              <div
                key={i}
                className={`flex-shrink-0 w-[70px] p-3 text-center border-r-2 border-gray-200 last:border-r-0 ${
                  i === 1 ? "bg-black text-white" : "hover:bg-gray-50"
                } transition-colors cursor-pointer`}
              >
                <div className="text-[10px] font-bold mb-1.5">{hour.time}</div>
                <div className="text-lg font-bold">{hour.temp}°</div>
              </div>
            ))}
          </div>
        </div>
      </DesktopCard>

      {/* Weekly Forecast */}
      <DesktopCard className="p-5">
        <h2 className="text-lg font-bold mb-3 border-b-2 border-black pb-2.5">5-DAY FORECAST</h2>
        <div className="space-y-3">
          {weeklyData.map((day, i) => (
            <div key={i} className="flex items-center justify-between hover:bg-gray-50 p-1.5 -mx-1.5 transition-colors">
              <div className="text-base font-bold w-14">{day.day}</div>
              <div className="flex-1 flex items-center justify-center">
                <SmallAnimatedIcon type={day.icon} />
                <div className="flex-1 h-0.5 bg-gray-200 mx-3" />
              </div>
              <div className="text-base font-bold">
                {day.high}° / {day.low}°
              </div>
            </div>
          ))}
        </div>
      </DesktopCard>
    </div>
  )
}
