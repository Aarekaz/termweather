import type { WeatherData, LocationData } from '@weather/core';

export function formatWeatherJson(weather: WeatherData): string {
  return JSON.stringify(weather, null, 2);
}

export function formatForecastJson(
  weather: WeatherData,
  type: 'hourly' | 'daily'
): string {
  const data = {
    location: weather.location,
    forecast: type === 'hourly' ? weather.hourly : weather.daily,
    lastUpdated: weather.lastUpdated,
  };
  return JSON.stringify(data, null, 2);
}

export function formatSearchResultsJson(results: LocationData[]): string {
  return JSON.stringify(results, null, 2);
}
