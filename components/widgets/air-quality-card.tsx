import type { AirQualityCardProps } from "@/types/weather"
import { getAQIRating, getAQIDescription, getAQIBackground } from "@/lib/weather-utils"

export function AirQualityCard({ aqi, className = "" }: AirQualityCardProps) {
  const rating = getAQIRating(aqi)
  const description = getAQIDescription(aqi)
  const bgClass = getAQIBackground(aqi)

  return (
    <div className={`bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3 ${className}`}>
      <div className="text-[10px] font-bold mb-2 text-gray-500">AIR QUALITY</div>
      <div className="text-2xl font-bold mb-1">{aqi}</div>
      <div className={`text-[10px] font-bold px-1.5 py-0.5 inline-block mb-1 ${bgClass}`}>{rating}</div>
      <div className="text-[10px] text-gray-500">{description}</div>
    </div>
  )
}
