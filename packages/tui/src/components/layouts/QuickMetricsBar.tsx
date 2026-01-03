import React from 'react';
import { Box, Text } from 'ink';
import { getCompassArrow, SYMBOLS } from '../../utils/symbols.js';
import { SYMBOLS as ProgressSymbols } from '../../utils/symbols.js';

interface QuickMetricsBarProps {
  wind: { speed: number; direction: string };
  humidity: number;
  pressure: number;
  pressureTrend: 'rising' | 'falling' | 'steady';
  uvIndex?: number;
  aqi?: number;
}

/**
 * Quick metrics bar - One-line scan of critical metrics
 * Compact horizontal display for instant assessment
 */
export function QuickMetricsBar({
  wind,
  humidity,
  pressure,
  pressureTrend,
  uvIndex,
  aqi,
}: QuickMetricsBarProps) {
  const windArrow = getCompassArrow(wind.direction);
  const trendSymbol =
    pressureTrend === 'rising'
      ? SYMBOLS.trendUp
      : pressureTrend === 'falling'
      ? SYMBOLS.trendDown
      : SYMBOLS.trendSteady;

  // Mini progress bar for humidity
  const humidityBar = createMiniProgressBar(humidity, 100, 5);

  return (
    <Box
      borderStyle="single"
      borderColor="gray"
      paddingX={2}
      justifyContent="space-between"
    >
      {/* Wind */}
      <Box gap={1}>
        <Text dimColor>Wind:</Text>
        <Text color="cyan">{windArrow}</Text>
        <Text>{Math.round(wind.speed)} km/h</Text>
      </Box>

      {/* Humidity with mini bar */}
      <Box gap={1}>
        <Text dimColor>Humid:</Text>
        <Text>{humidity}%</Text>
        <Text color="blue">{humidityBar}</Text>
      </Box>

      {/* Pressure with trend */}
      <Box gap={1}>
        <Text dimColor>Press:</Text>
        <Text>{Math.round(pressure)} mb</Text>
        <Text color={pressureTrend === 'rising' ? 'green' : pressureTrend === 'falling' ? 'red' : 'gray'}>
          {trendSymbol}
        </Text>
      </Box>

      {/* UV Index if available */}
      {uvIndex != null && (
        <Box gap={1}>
          <Text dimColor>UV:</Text>
          <Text color={getUVColor(uvIndex)}>{uvIndex.toFixed(1)}</Text>
        </Box>
      )}

      {/* AQI if available */}
      {aqi != null && (
        <Box gap={1}>
          <Text dimColor>AQI:</Text>
          <Text color={getAQIColor(aqi)}>{aqi}</Text>
        </Box>
      )}
    </Box>
  );
}

/**
 * Create mini progress bar using block characters
 */
function createMiniProgressBar(value: number, max: number, width: number): string {
  const filled = Math.floor((value / max) * width);
  const empty = width - filled;
  return ProgressSymbols.progress[3].repeat(filled) + ProgressSymbols.progress[0].repeat(empty);
}

/**
 * Get UV index color
 */
function getUVColor(uv: number): string {
  if (uv <= 2) return 'green';
  if (uv <= 5) return 'yellow';
  if (uv <= 7) return 'magenta';
  return 'red';
}

/**
 * Get AQI color
 */
function getAQIColor(aqi: number): string {
  if (aqi <= 50) return 'green';
  if (aqi <= 100) return 'yellow';
  if (aqi <= 150) return 'magenta';
  return 'red';
}
