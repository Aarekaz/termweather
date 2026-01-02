import React from 'react';
import { Box, Text } from 'ink';
import type { CurrentWeather } from '@weather/core';
import {
  getUVLevel,
  getAQIRating,
  getWindDirectionFull,
  getPressureTrendSymbol,
  formatWindSpeed,
  formatPressure,
} from '@weather/core';
import { getUVColor, getAQIColor } from '../utils/terminal.js';

interface MetricBoxProps {
  label: string;
  value: string;
  color?: string;
}

function MetricBox({ label, value, color }: MetricBoxProps) {
  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor="gray"
      paddingX={2}
      paddingY={0}
      minWidth={16}
    >
      <Text dimColor>{label}</Text>
      <Text bold color={color}>
        {value}
      </Text>
    </Box>
  );
}

interface MetricsProps {
  current: CurrentWeather;
  aqi?: number;
}

export function Metrics({ current, aqi }: MetricsProps) {
  const aqiDisplay = aqi == null ? 'N/A' : `${aqi} ${getAQIRating(aqi)}`;
  const aqiColor = aqi == null ? undefined : getAQIColor(aqi);

  return (
    <Box flexDirection="column" gap={1}>
      <Box gap={1}>
        <MetricBox label="Humidity" value={`${current.humidity}%`} />
        <MetricBox
          label="UV Index"
          value={`${current.uvIndex} ${getUVLevel(current.uvIndex)}`}
          color={getUVColor(current.uvIndex)}
        />
        <MetricBox
          label="Wind"
          value={`${formatWindSpeed(current.windSpeed, 'kmh')} ${getWindDirectionFull(current.windDirection)}`}
        />
      </Box>
      <Box gap={1}>
        <MetricBox
          label="Pressure"
          value={`${formatPressure(current.pressure, 'mb')} ${getPressureTrendSymbol(current.pressureTrend)}`}
        />
        <MetricBox label="Visibility" value={`${current.visibility} km`} />
        <MetricBox label="Air Quality" value={aqiDisplay} color={aqiColor} />
      </Box>
    </Box>
  );
}
