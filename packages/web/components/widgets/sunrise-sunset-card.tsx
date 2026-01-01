import type { SunriseSunsetCardProps } from "@/types/weather"
import { calculateDaylightDuration } from "@/lib/weather-utils"

export function SunriseSunsetCard({ sunrise, sunset, className = "" }: SunriseSunsetCardProps) {
  const daylight = calculateDaylightDuration(sunrise, sunset)

  return (
    <div className={`bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3 ${className}`}>
      <div className="text-[10px] font-bold mb-2 text-gray-500">SUN</div>
      <div className="space-y-1 mb-1">
        <div className="text-sm font-bold">☀️ Rise: {sunrise}</div>
        <div className="text-sm font-bold">🌙 Set: {sunset}</div>
      </div>
      <div className="text-[10px] text-gray-500">Daylight: {daylight}</div>
    </div>
  )
}
