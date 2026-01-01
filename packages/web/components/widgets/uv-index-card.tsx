import type { UVIndexCardProps } from "@/types/weather"
import { getUVLevel, getUVAdvice, getUVBackground } from "@/lib/weather-utils"

export function UVIndexCard({ uvIndex, className = "" }: UVIndexCardProps) {
  const level = getUVLevel(uvIndex)
  const advice = getUVAdvice(uvIndex)
  const bgClass = getUVBackground(uvIndex)

  return (
    <div className={`bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3 ${className}`}>
      <div className="text-[10px] font-bold mb-2 text-gray-500">UV INDEX</div>
      <div className="text-2xl font-bold mb-1">{uvIndex}</div>
      <div className={`text-[10px] font-bold px-1.5 py-0.5 inline-block mb-1 ${bgClass}`}>{level}</div>
      <div className="text-[10px] text-gray-500">{advice}</div>
    </div>
  )
}
