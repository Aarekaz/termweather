"use client"

import { Button } from "@/components/ui/button"
import { DesktopCard } from "@/components/responsive-layout"
import { SmallAnimatedIcon } from "@/components/animated-weather-icons"
import { EnvironmentalGrid } from "@/components/environmental-grid"
import { HourlyForecastChart } from "@/components/hourly-forecast-chart"
import { useWeatherContext } from "@/contexts/weather-context"
import { adaptWeatherData } from "@/lib/weather-adapter"
import Link from "next/link"
import ReactAnimatedWeather from "react-animated-weather"
import { Loader2 } from "lucide-react"

export function DesktopHome() {
  const { currentLocation, getWeatherForLocation, loading } = useWeatherContext()

  // Get weather data for current location
  const weatherData = currentLocation ? getWeatherForLocation(currentLocation.id) : null
  const adapted = weatherData ? adaptWeatherData(weatherData, true) : null

  if (loading && !adapted) {
    return (
      <DesktopCard className="p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-500">Loading weather data...</span>
        </div>
      </DesktopCard>
    )
  }

  if (!adapted) {
    return (
      <DesktopCard className="p-6">
        <div className="flex items-center justify-center h-64 text-gray-500">
          <p>No weather data available</p>
        </div>
      </DesktopCard>
    )
  }

  const { location: currentLocationData, hourly: hourlyData, daily: weeklyData } = adapted
  const highTemp = weeklyData[0]?.high ?? currentLocationData.temp + 6
  const lowTemp = weeklyData[0]?.low ?? currentLocationData.temp - 6

  const getMainIcon = () => {
    switch (currentLocationData.icon) {
      case "rain":
        return <ReactAnimatedWeather icon="RAIN" color="#2563eb" size={120} animate={true} />
      case "sun":
        return <ReactAnimatedWeather icon="CLEAR_DAY" color="#eab308" size={120} animate={true} />
      case "cloud":
        return <ReactAnimatedWeather icon="CLOUDY" color="#9ca3af" size={120} animate={true} />
      case "snow":
        return <ReactAnimatedWeather icon="SNOW" color="#93c5fd" size={120} animate={true} />
      default:
        return <ReactAnimatedWeather icon="CLOUDY" color="#9ca3af" size={120} animate={true} />
    }
  }

  return (
    <div className="space-y-5">
      {/* Main Weather Card */}
      <DesktopCard className="p-6">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{currentLocationData.name}</h1>
            <p className="text-xs text-gray-500 font-mono mt-1">{currentLocationData.coords}</p>
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
            <div className="text-[120px] font-bold leading-none tracking-tight">{currentLocationData.temp}°</div>
            <div className="text-4xl font-bold text-blue-600 mt-3">{currentLocationData.condition}</div>
            <div className="text-2xl font-bold mt-3">
              {highTemp}°/{lowTemp}°
            </div>
          </div>
          <div className="border-3 border-black p-5">{getMainIcon()}</div>
        </div>

        {/* Natural Language Summary */}
        {currentLocationData.summary && (
          <div className="mt-5 pt-5 border-t-2 border-black">
            <p className="text-sm text-gray-600 leading-relaxed">{currentLocationData.summary}</p>
          </div>
        )}
      </DesktopCard>

      {/* Environmental Metrics Grid */}
      <EnvironmentalGrid location={currentLocationData} />

      {/* Hourly Forecast with Chart */}
      <HourlyForecastChart data={hourlyData} />

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
