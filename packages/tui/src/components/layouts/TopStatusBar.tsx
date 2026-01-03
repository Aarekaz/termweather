import React from 'react';
import { Box, Text } from 'ink';
import { formatTemperature, getConditionDisplay } from '@weather/core';
import { getConditionEmoji, getTempColor } from '../../utils/terminal.js';
import { BORDER_HEAVY } from '../../utils/theme.js';

interface TopStatusBarProps {
  location: string;
  temperature: number;
  condition: string;
  feelsLike: number;
  locationIndex: number;
  totalLocations: number;
}

/**
 * Top status bar - Critical information at a glance
 * Full-width bar with location, current temp, and condition
 */
export function TopStatusBar({
  location,
  temperature,
  condition,
  feelsLike,
  locationIndex,
  totalLocations,
}: TopStatusBarProps) {
  const emoji = getConditionEmoji(condition);
  const conditionDisplay = getConditionDisplay(condition);
  const tempColor = getTempColor(temperature);

  return (
    <Box
      borderStyle="round"
      borderColor="cyan"
      paddingX={2}
      justifyContent="space-between"
    >
      {/* Left: Location with arrow indicator */}
      <Box gap={1}>
        <Text color="cyan">▸</Text>
        <Text bold color="white">
          {location.toUpperCase()}
        </Text>
      </Box>

      {/* Center: Temperature + Condition */}
      <Box gap={1}>
        <Text bold color={tempColor}>
          {formatTemperature(temperature, 'C')}
        </Text>
        <Text>{emoji}</Text>
        <Text bold color="white">
          {conditionDisplay.toUpperCase()}
        </Text>
      </Box>

      {/* Right: Feels like + Location counter */}
      <Box gap={1}>
        <Text dimColor>Feels</Text>
        <Text color={getTempColor(feelsLike)}>
          {formatTemperature(feelsLike, 'C')}
        </Text>
        <Text dimColor>
          [{locationIndex + 1}/{totalLocations}]
        </Text>
      </Box>
    </Box>
  );
}
