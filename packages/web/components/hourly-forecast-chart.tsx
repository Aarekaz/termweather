"use client"

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts"
import type { HourlyForecast } from "@/lib/mock-data"
import { SmallAnimatedIcon } from "@/components/animated-weather-icons"

interface HourlyForecastChartProps {
  data: HourlyForecast[]
}

export function HourlyForecastChart({ data }: HourlyForecastChartProps) {
  return (
    <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-5">
      <h2 className="text-lg font-bold mb-3 border-b-2 border-black pb-2.5">24-HOUR FORECAST</h2>

      {/* Temperature curve graph */}
      <div className="mb-3">
        <ResponsiveContainer width="100%" height={100}>
          <LineChart data={data}>
            <XAxis dataKey="time" hide />
            <YAxis hide domain={["dataMin - 2", "dataMax + 2"]} />
            <Line
              type="monotone"
              dataKey="temp"
              stroke="#000"
              strokeWidth={2}
              dot={{ fill: "#000", r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Hour cells with precipitation */}
      <div className="flex gap-0 overflow-x-auto scrollbar-hide">
        {data.map((hour, i) => (
          <div key={i} className="flex-shrink-0 w-[70px] p-3 text-center border-r border-gray-100 last:border-r-0">
            <div className="text-[10px] font-bold mb-1.5 text-gray-500">{hour.time}</div>
            <div className="text-lg font-bold mb-1.5">{hour.temp}°</div>
            {hour.icon && (
              <div className="flex justify-center mb-1">
                <SmallAnimatedIcon type={hour.icon} />
              </div>
            )}
            {hour.precipChance > 0 && (
              <div className="text-[10px] text-blue-600 font-bold">{hour.precipChance}%</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
