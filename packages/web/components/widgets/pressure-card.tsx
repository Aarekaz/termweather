import type { PressureCardProps } from "@/types/weather"
import { getPressureTrendSymbol } from "@/lib/weather-utils"

export function PressureCard({ pressure, trend, className = "" }: PressureCardProps) {
  const trendSymbol = getPressureTrendSymbol(trend)
  const trendText = trend ? trend.charAt(0).toUpperCase() + trend.slice(1) : "Unknown"

  return (
    <div className={`bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3 ${className}`}>
      <div className="text-[10px] font-bold mb-2 text-gray-500">PRESSURE</div>
      <div className="text-xl font-bold mb-1">{pressure} hPa</div>
      <div className="text-lg font-bold mb-0.5">{trendSymbol}</div>
      <div className="text-[10px] text-gray-500">{trendText}</div>
    </div>
  )
}
