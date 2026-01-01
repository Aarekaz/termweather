"use client"

import ReactAnimatedWeather from "react-animated-weather"

const weatherDefaults = {
  animate: true,
  size: 64,
}

export function AnimatedRain({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <div className={className}>
      <ReactAnimatedWeather icon="RAIN" color="#2563eb" size={64} animate={true} />
    </div>
  )
}

export function AnimatedSun({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <div className={className}>
      <ReactAnimatedWeather icon="CLEAR_DAY" color="#eab308" size={64} animate={true} />
    </div>
  )
}

export function AnimatedCloud({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <div className={className}>
      <ReactAnimatedWeather icon="CLOUDY" color="#9ca3af" size={64} animate={true} />
    </div>
  )
}

export function AnimatedSnow({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <div className={className}>
      <ReactAnimatedWeather icon="SNOW" color="#93c5fd" size={64} animate={true} />
    </div>
  )
}

export function AnimatedWind({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <div className={className}>
      <ReactAnimatedWeather icon="WIND" color="#6b7280" size={64} animate={true} />
    </div>
  )
}

export function SmallAnimatedIcon({ type, className = "w-5 h-5" }: { type: string; className?: string }) {
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
    <div className={className}>
      <ReactAnimatedWeather
        icon={iconMap[type] || "CLEAR_DAY"}
        color={colorMap[type] || "#000"}
        size={20}
        animate={true}
      />
    </div>
  )
}
