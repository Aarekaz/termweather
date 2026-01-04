import React from 'react';
import { Box, Text } from 'ink';
import type { HourlyForecast } from '@weather/core';
import { findNextPrecipitation, formatPrecipitationAlert } from '@weather/core';
import { BORDER_HEAVY } from '../../utils/theme.js';

interface PrecipitationAlertPanelProps {
  /** Hourly forecast data */
  hourly: HourlyForecast[];
  /** Probability threshold for alerts (default: 40%) */
  threshold?: number;
}

/**
 * Precipitation Alert Panel
 * Displays when the next rain/snow is expected
 * Apple Weather-style "Rain in X hours" alert
 */
export function PrecipitationAlertPanel({
  hourly,
  threshold = 40,
}: PrecipitationAlertPanelProps) {
  const nextPrecip = findNextPrecipitation(hourly, threshold);
  const alertMessage = formatPrecipitationAlert(nextPrecip);

  // Determine icon and color based on timing
  const getAlertStyle = () => {
    if (!nextPrecip) {
      return { icon: '☀️', color: 'green' as const };
    }
    if (nextPrecip.hoursUntil === 0) {
      return { icon: '🌧', color: 'yellow' as const };
    }
    if (nextPrecip.hoursUntil < 3) {
      return { icon: '⚠️', color: 'yellow' as const };
    }
    if (nextPrecip.hoursUntil < 12) {
      return { icon: '☁️', color: 'cyan' as const };
    }
    return { icon: '🌤', color: 'blue' as const };
  };

  const { icon, color } = getAlertStyle();

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
          {BORDER_HEAVY.horizontal.repeat(2)} Next Precipitation{' '}
          {BORDER_HEAVY.horizontal.repeat(2)}
        </Text>
      </Box>

      {/* Alert Message */}
      <Box flexDirection="column" gap={1}>
        <Box>
          <Text>
            {icon} <Text color={color} bold>{alertMessage}</Text>
          </Text>
        </Box>

        {/* Details if precipitation is coming */}
        {nextPrecip && (
          <Box flexDirection="column">
            <Text dimColor>
              Probability: {nextPrecip.probability}%
            </Text>
            <Text dimColor>
              Expected: {nextPrecip.amount.toFixed(1)} mm
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}
