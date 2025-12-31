import type { Location } from "@/lib/mock-data"
import {
  HumidityCard,
  UVIndexCard,
  WindCard,
  SunriseSunsetCard,
  FeelsLikeCard,
  PressureCard,
  AirQualityCard,
  VisibilityCard,
} from "@/components/widgets"

interface EnvironmentalGridProps {
  location: Location
}

export function EnvironmentalGrid({ location }: EnvironmentalGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <HumidityCard humidity={location.humidity} />
      <UVIndexCard uvIndex={location.uvIndex} />
      <WindCard speed={location.windSpeed} direction={location.windDirection} />
      <FeelsLikeCard feelsLike={location.feelsLike} actual={location.temp} />
      <PressureCard pressure={location.pressure} trend={location.pressureTrend} />
      <AirQualityCard aqi={location.airQuality} />
      <VisibilityCard visibility={location.visibility} />
      <SunriseSunsetCard sunrise={location.sunrise} sunset={location.sunset} />
    </div>
  )
}
