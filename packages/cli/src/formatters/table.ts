import chalk from 'chalk';
import type { WeatherData, LocationData } from '@weather/core';
import {
  formatTemperature,
  formatWindSpeed,
  formatPressure,
  getUVLevel,
  getAQIRating,
  getWindDirectionFull,
  getPressureTrendSymbol,
  getConditionDisplay,
} from '@weather/core';

const BOX = {
  topLeft: '\u256D',
  topRight: '\u256E',
  bottomLeft: '\u2570',
  bottomRight: '\u256F',
  horizontal: '\u2500',
  vertical: '\u2502',
  teeRight: '\u251C',
  teeLeft: '\u2524',
};

function createBox(lines: string[], width: number): string {
  const top = BOX.topLeft + BOX.horizontal.repeat(width - 2) + BOX.topRight;
  const bottom =
    BOX.bottomLeft + BOX.horizontal.repeat(width - 2) + BOX.bottomRight;
  const separator =
    BOX.teeRight + BOX.horizontal.repeat(width - 2) + BOX.teeLeft;

  const paddedLines = lines.map((line, index) => {
    // Strip ANSI codes for length calculation
    const stripped = line.replace(/\x1b\[[0-9;]*m/g, '');
    const padding = width - 4 - stripped.length;
    const paddedLine =
      BOX.vertical + ' ' + line + ' '.repeat(Math.max(0, padding)) + ' ' + BOX.vertical;

    // Add separator after header section (first 2 lines)
    if (index === 1) {
      return paddedLine + '\n' + separator;
    }
    return paddedLine;
  });

  return [top, ...paddedLines, bottom].join('\n');
}

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

export function formatWeatherTable(weather: WeatherData): string {
  const { location, current } = weather;
  const width = 44;

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });

  const conditionDesc = getConditionDisplay(current.condition);
  const emoji = getConditionEmoji(current.condition);
  const aqi = weather.airQuality?.aqi;
  const aqiDisplay = aqi == null ? 'N/A' : `${aqi} (${getAQIRating(aqi)})`;

  const lines = [
    chalk.bold(`${location.name}, ${location.country}`),
    chalk.dim(`${timeStr} \u00B7 Updated just now`),
    '',
    chalk.bold(
      `        ${formatTemperature(current.temperature, 'C')}  ${emoji} ${conditionDesc}`
    ),
    chalk.dim(`        Feels like ${formatTemperature(current.feelsLike, 'C')}`),
    '',
    `${chalk.dim('Humidity')}    ${current.humidity}%      ${chalk.dim('UV Index')}    ${current.uvIndex} (${getUVLevel(current.uvIndex)})`,
    `${chalk.dim('Wind')}        ${formatWindSpeed(current.windSpeed, 'kmh')} ${getWindDirectionFull(current.windDirection)}`,
    `${chalk.dim('Pressure')}    ${formatPressure(current.pressure, 'mb')} ${getPressureTrendSymbol(current.pressureTrend)}`,
    `${chalk.dim('Visibility')}  ${current.visibility} km   ${chalk.dim('AQI')}         ${aqiDisplay}`,
  ];

  return createBox(lines, width);
}

export function formatForecastTable(
  weather: WeatherData,
  type: 'hourly' | 'daily',
  limit?: number
): string {
  const { location, hourly, daily } = weather;

  if (type === 'hourly') {
    const hours = limit ?? 24;
    const header = chalk.bold(`${hours}-Hour Forecast - ${location.name}`);
    const separator = '-'.repeat(60);

    const rows = hourly.slice(0, hours).map((h) => {
      const time = new Date(h.time).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
      const emoji = getConditionEmoji(h.condition);
      return `  ${time}  ${emoji}  ${formatTemperature(h.temperature, 'C').padStart(6)}  ${chalk.dim('Precip:')} ${h.precipitationProbability}%`;
    });

    return [header, separator, ...rows].join('\n');
  } else {
    const days = limit ?? daily.length;
    const header = chalk.bold(`${days}-Day Forecast - ${location.name}`);
    const separator = '-'.repeat(60);

    const rows = daily.slice(0, days).map((d) => {
      const date = new Date(d.date);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dateStr = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      const emoji = getConditionEmoji(d.condition);
      const high = formatTemperature(d.temperatureMax, 'C');
      const low = formatTemperature(d.temperatureMin, 'C');
      return `  ${dayName} ${dateStr.padEnd(7)} ${emoji}  ${chalk.red(high)} / ${chalk.blue(low)}  ${chalk.dim('Precip:')} ${d.precipitationProbability}%`;
    });

    return [header, separator, ...rows].join('\n');
  }
}

export function formatSearchResults(results: LocationData[]): string {
  if (results.length === 0) {
    return chalk.yellow('No locations found.');
  }

  const header = chalk.bold('Search Results');
  const separator = '-'.repeat(60);

  const rows = results.map((loc, index) => {
    const admin = loc.admin1 ? `, ${loc.admin1}` : '';
    return `  ${chalk.cyan(`[${index + 1}]`)} ${loc.name}${admin}, ${loc.country}`;
  });

  const hint = chalk.dim(
    '\nUse: weather config set-location <number> to set as default'
  );

  return [header, separator, ...rows, hint].join('\n');
}
