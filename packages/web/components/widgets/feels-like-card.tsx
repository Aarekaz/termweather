import type { FeelsLikeCardProps } from "@/types/weather"
import { getFeelsLikeComparison } from "@/lib/weather-utils"

export function FeelsLikeCard({ feelsLike, actual, className = "" }: FeelsLikeCardProps) {
  const comparison = getFeelsLikeComparison(feelsLike, actual)

  return (
    <div className={`bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3 ${className}`}>
      <div className="text-[10px] font-bold mb-2 text-gray-500">FEELS LIKE</div>
      <div className="text-2xl font-bold mb-1">{feelsLike}°</div>
      <div className="text-[10px] text-gray-500">{comparison}</div>
    </div>
  )
}
