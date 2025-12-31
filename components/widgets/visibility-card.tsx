import type { VisibilityCardProps } from "@/types/weather"
import { getVisibilityDescription } from "@/lib/weather-utils"

export function VisibilityCard({ visibility, className = "" }: VisibilityCardProps) {
  const description = getVisibilityDescription(visibility)

  return (
    <div className={`bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3 ${className}`}>
      <div className="text-[10px] font-bold mb-2 text-gray-500">VISIBILITY</div>
      <div className="text-2xl font-bold mb-1">{visibility} km</div>
      <div className="text-[10px] text-gray-500">{description}</div>
    </div>
  )
}
