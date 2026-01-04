import React from 'react';
import { Box, Text } from 'ink';
import { formatTemperature, getConditionDisplay } from '@weather/core';
import { getConditionEmoji, getTempColor } from '../../utils/terminal.js';
import { getCompassArrow, SYMBOLS } from '../../utils/symbols.js';
import { useTerminalSize } from '../../hooks/useTerminalSize.js';

interface UnifiedHeaderProps {
  location: string;
  temperature: number;
  condition: string;
  feelsLike: number;
  locationIndex: number;
  totalLocations: number;
  wind: { speed: number; direction: string };
  humidity: number;
  pressure: number;
  pressureTrend: 'rising' | 'falling' | 'steady';
  uvIndex?: number;
  aqi?: number;
}

/**
 * Unified double-height header combining location info and quick metrics
 * Replaces separate TopStatusBar + QuickMetricsBar for cleaner design
 */
export function UnifiedHeader(props: UnifiedHeaderProps) {
  const { breakpoint } = useTerminalSize();

  // Adaptive gaps based on terminal size to prevent excessive whitespace
  const row1Gap = breakpoint === 'small' ? 2 : breakpoint === 'medium' ? 3 : 4;
  const row2Gap = breakpoint === 'small' ? 1 : breakpoint === 'medium' ? 2 : 3;

  const emoji = getConditionEmoji(props.condition);
  const conditionDisplay = getConditionDisplay(props.condition);
  const tempColor = getTempColor(props.temperature);
  const windArrow = getCompassArrow(props.wind.direction);

  const trendSymbol =
    props.pressureTrend === 'rising'
      ? SYMBOLS.trendUp
      : props.pressureTrend === 'falling'
      ? SYMBOLS.trendDown
      : SYMBOLS.trendSteady;

  const pressureTrendColor =
    props.pressureTrend === 'rising'
      ? 'green'
      : props.pressureTrend === 'falling'
      ? 'red'
      : 'gray';

  // Mini progress bar for humidity
  const humidityFilled = Math.floor((props.humidity / 100) * 5);
  const humidityEmpty = 5 - humidityFilled;
  const humidityBar =
    SYMBOLS.progress[3].repeat(humidityFilled) +
    SYMBOLS.progress[0].repeat(humidityEmpty);

  return (
    <Box
      flexDirection="column"
      borderStyle="double"
      borderColor="cyan"
      paddingX={2}
      paddingY={0}
    >
      {/* Row 1: Location + Current Conditions */}
      <Box gap={row1Gap}>
        <Box gap={1}>
          <Text color="cyan">▸</Text>
          <Text bold color="white">
            {props.location.toUpperCase()}
          </Text>
        </Box>

        <Box gap={1}>
          <Text bold color={tempColor}>
            {formatTemperature(props.temperature, 'C')}
          </Text>
          <Text>{emoji}</Text>
          <Text bold color="white">
            {conditionDisplay.toUpperCase()}
          </Text>
        </Box>

        <Box gap={1}>
          <Text dimColor>Feels</Text>
          <Text color={getTempColor(props.feelsLike)}>
            {formatTemperature(props.feelsLike, 'C')}
          </Text>
        </Box>

        <Text dimColor>
          [{props.locationIndex + 1}/{props.totalLocations}]
        </Text>
      </Box>

      {/* Row 2: Quick Metrics */}
      <Box gap={row2Gap}>
        {/* Wind */}
        <Box gap={1}>
          <Text dimColor>Wind:</Text>
          <Text color="cyan">{windArrow}</Text>
          <Text>{Math.round(props.wind.speed)} km/h</Text>
        </Box>

        {/* Humidity */}
        <Box gap={1}>
          <Text dimColor>Humid:</Text>
          <Text>{props.humidity}%</Text>
          <Text color="blue">{humidityBar}</Text>
        </Box>

        {/* Pressure */}
        <Box gap={1}>
          <Text dimColor>Press:</Text>
          <Text>{Math.round(props.pressure)} mb</Text>
          <Text color={pressureTrendColor}>{trendSymbol}</Text>
        </Box>

        {/* UV Index */}
        {props.uvIndex != null && (
          <Box gap={1}>
            <Text dimColor>UV:</Text>
            <Text color={getUVColor(props.uvIndex)}>
              {props.uvIndex.toFixed(1)}
            </Text>
          </Box>
        )}

        {/* AQI - Hidden on small terminals to save space */}
        {props.aqi != null && breakpoint !== 'small' && (
          <Box gap={1}>
            <Text dimColor>AQI:</Text>
            <Text color={getAQIColor(props.aqi)}>{props.aqi}</Text>
          </Box>
        )}
      </Box>
    </Box>
  );
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
