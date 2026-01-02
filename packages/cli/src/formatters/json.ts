import type { WeatherData, LocationData } from '@weather/core';

export function formatWeatherJson(weather: WeatherData): string {
  return JSON.stringify(weather, null, 2);
}

export function formatForecastJson(
  weather: WeatherData,
  type: 'hourly' | 'daily',
  limit?: number
): string {
  const hourly = limit ? weather.hourly.slice(0, limit) : weather.hourly;
  const daily = limit ? weather.daily.slice(0, limit) : weather.daily;
  const data = {
    location: weather.location,
    forecast: type === 'hourly' ? hourly : daily,
    lastUpdated: weather.lastUpdated,
  };
  return JSON.stringify(data, null, 2);
}

export function formatSearchResultsJson(results: LocationData[]): string {
  return JSON.stringify(results, null, 2);
}
