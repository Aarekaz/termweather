import React from 'react';
import { Box, Text } from 'ink';
import type { HourlyForecast, DailyForecast } from '@weather/core';
import {
  calculatePrecipitationAccumulation,
  calculateWeeklyPrecipitation,
} from '@weather/core';
import { BORDER_HEAVY } from '../../utils/theme.js';
import { getPrecipTypeEmoji } from '../../utils/atmosphere.js';

interface PrecipitationSummaryPanelProps {
  /** Hourly forecast data */
  hourly: HourlyForecast[];
  /** Daily forecast data */
  daily: DailyForecast[];
}

/**
 * Precipitation Summary Panel
 * Shows 24-hour and 7-day precipitation accumulation
 * Displays rain vs snow breakdown
 */
export function PrecipitationSummaryPanel({
  hourly,
  daily,
}: PrecipitationSummaryPanelProps) {
  const daily24h = calculatePrecipitationAccumulation(hourly, 24);
  const weekly = calculateWeeklyPrecipitation(daily);

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor="cyan"
      paddingX={2}
      paddingY={1}
      width={40}
    >
      {/* Title */}
      <Box marginBottom={1}>
        <Text bold color="cyan">
          {BORDER_HEAVY.horizontal.repeat(2)} Precipitation{' '}
          {BORDER_HEAVY.horizontal.repeat(2)}
        </Text>
      </Box>

      {/* 24-hour accumulation */}
      <Box flexDirection="column" gap={0} marginBottom={1}>
        <Box>
          <Text bold>Next 24 Hours:</Text>
          <Text> {getPrecipTypeEmoji(daily24h.type)}</Text>
        </Box>
        <Box>
          <Text color="cyan">{daily24h.total.toFixed(1)} mm total</Text>
        </Box>
        {daily24h.type === 'mixed' && (
          <Box gap={2}>
            <Text dimColor>Rain: {daily24h.rain.toFixed(1)} mm</Text>
            <Text dimColor>Snow: {daily24h.snow.toFixed(1)} mm</Text>
          </Box>
        )}
      </Box>

      {/* 7-day accumulation */}
      <Box flexDirection="column" gap={0}>
        <Box>
          <Text bold>Next 7 Days:</Text>
        </Box>
        <Box>
          <Text color="cyan">{weekly.total.toFixed(1)} mm total</Text>
        </Box>
        <Text dimColor>
          Avg: {weekly.average.toFixed(1)} mm/day
        </Text>
      </Box>
    </Box>
  );
}
