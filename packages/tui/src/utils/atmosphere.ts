import { calculateDewPoint } from '@weather/core';

/**
 * Calculate dewpoint and provide a human-readable description
 * based on the temperature-dewpoint spread
 */
export function calculateAndFormatDewpoint(
  temp: number,
  humidity: number
): {
  value: number;
  description: string;
} {
  const dewpoint = calculateDewPoint(temp, humidity);
  const spread = temp - dewpoint;

  let description: string;
  if (spread < 3) description = 'High humidity';
  else if (spread < 5) description = 'Moderate humidity';
  else description = 'Low humidity';

  return { value: dewpoint, description };
}

/**
 * Get a human-readable visibility rating based on distance in kilometers
 */
export function getVisibilityRating(km: number): string {
  if (km > 40) return 'Excellent';
  if (km > 20) return 'Good';
  if (km > 10) return 'Moderate';
  if (km > 4) return 'Poor';
  return 'Very Poor';
}

/**
 * Get a description for pressure trend
 */
export function getPressureDescription(trend: string): string {
  if (trend === 'rising') return 'Rising';
  if (trend === 'falling') return 'Falling';
  return 'Steady';
}

/**
 * Create a progress bar using block characters
 * @param value Current value
 * @param max Maximum value (for percentage calculation)
 * @param width Number of characters for the bar
 */
export function createProgressBar(
  value: number,
  max: number,
  width: number
): string {
  const filled = Math.floor((value / max) * width);
  const empty = width - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

/**
 * Get cloud cover description and color based on percentage
 */
export function getCloudCoverDescription(percent: number): {
  description: string
  color: string
} {
  if (percent < 10) return { description: 'Clear skies', color: 'cyan' }
  if (percent < 25) return { description: 'Mostly clear', color: 'blue' }
  if (percent < 50) return { description: 'Partly cloudy', color: 'gray' }
  if (percent < 75) return { description: 'Mostly cloudy', color: 'gray' }
  return { description: 'Overcast', color: 'white' }
}

/**
 * Get emoji for precipitation type
 */
export function getPrecipTypeEmoji(type: string): string {
  const emojis: Record<string, string> = {
    rain: '🌧',
    snow: '❄️',
    mixed: '🌨',
    none: '',
  }
  return emojis[type] || ''
}
