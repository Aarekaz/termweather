import type { WindCardProps } from "@/types/weather"
import { getWindBeaufort, getDirectionArrow } from "@/lib/weather-utils"

export function WindCard({ speed, direction, className = "" }: WindCardProps) {
  const beaufort = getWindBeaufort(speed)
  const arrow = getDirectionArrow(direction)

  return (
    <div className={`bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3 ${className}`}>
      <div className="text-[10px] font-bold mb-2 text-gray-500">WIND</div>
      <div className="text-xl font-bold mb-1">
        {direction} {arrow} {speed} MPH
      </div>
      <div className="text-[10px] text-gray-500">{beaufort}</div>
    </div>
  )
}
