import type { WeatherData, LocationData } from '@weather/core';
import {
  formatTemperature,
  formatWindSpeed,
  getConditionDisplay,
  getWindDirectionFull,
} from '@weather/core';

function getConditionEmoji(condition: string): string {
  const emojis: Record<string, string> = {
    clear: '\u2600\uFE0F',
    'partly-cloudy': '\u26C5',
    cloudy: '\u2601\uFE0F',
    fog: '\uD83C\uDF2B\uFE0F',
    drizzle: '\uD83C\uDF27\uFE0F',
    rain: '\uD83C\uDF27\uFE0F',
    snow: '\u2744\uFE0F',
    thunderstorm: '\u26C8\uFE0F',
  };
  return emojis[condition] || '\uD83C\uDF21\uFE0F';
}

export function formatWeatherCompact(weather: WeatherData): string {
  const { location, current } = weather;
  const emoji = getConditionEmoji(current.condition);
  const condition = getConditionDisplay(current.condition);

  return `${location.name}: ${formatTemperature(current.temperature, 'C')} ${emoji} ${condition} | Feels ${formatTemperature(current.feelsLike, 'C')} | Wind ${formatWindSpeed(current.windSpeed, 'kmh')} ${getWindDirectionFull(current.windDirection)} | Humidity ${current.humidity}%`;
}

export function formatForecastCompact(
  weather: WeatherData,
  type: 'hourly' | 'daily',
  limit?: number
): string {
  const { location, hourly, daily } = weather;

  if (type === 'hourly') {
    const items = hourly.slice(0, limit ?? 12).map((h) => {
      const time = new Date(h.time).toLocaleTimeString('en-US', {
        hour: 'numeric',
      });
      const emoji = getConditionEmoji(h.condition);
      return `${time}:${formatTemperature(h.temperature, 'C')}${emoji}`;
    });
    return `${location.name} Hourly: ${items.join(' ')}`;
  } else {
    const items = daily.slice(0, limit ?? daily.length).map((d) => {
      const date = new Date(d.date);
      const day = date.toLocaleDateString('en-US', { weekday: 'short' });
      const emoji = getConditionEmoji(d.condition);
      return `${day}:${formatTemperature(d.temperatureMax, 'C')}/${formatTemperature(d.temperatureMin, 'C')}${emoji}`;
    });
    return `${location.name} Weekly: ${items.join(' ')}`;
  }
}

export function formatSearchResultsCompact(results: LocationData[]): string {
  if (results.length === 0) {
    return 'No locations found';
  }

  const items = results.map((loc, i) => {
    const admin = loc.admin1 ? ` (${loc.admin1})` : '';
    return `[${i + 1}] ${loc.name}${admin}, ${loc.country}`;
  });

  return items.join(' | ');
}
