import { SEMANTIC_COLORS, getTemperatureColor } from './theme.js';

export function getConditionEmoji(condition: string): string {
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

export function getUVColor(uvIndex: number): string {
  if (uvIndex <= 2) return SEMANTIC_COLORS.alert.info;
  if (uvIndex <= 5) return SEMANTIC_COLORS.alert.warning;
  if (uvIndex <= 7) return SEMANTIC_COLORS.alert.warning;
  if (uvIndex <= 10) return SEMANTIC_COLORS.alert.danger;
  return SEMANTIC_COLORS.alert.severe;
}

export function getAQIColor(aqi: number): string {
  if (aqi <= 50) return SEMANTIC_COLORS.alert.info;
  if (aqi <= 100) return SEMANTIC_COLORS.alert.warning;
  if (aqi <= 150) return SEMANTIC_COLORS.alert.warning;
  if (aqi <= 200) return SEMANTIC_COLORS.alert.danger;
  return SEMANTIC_COLORS.alert.severe;
}

export function getTempColor(temp: number): string {
  return getTemperatureColor(temp);
}

export function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 120) return '1 minute ago';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 7200) return '1 hour ago';
  return `${Math.floor(seconds / 3600)} hours ago`;
}
