import React from 'react';
import { Box, Text } from 'ink';
import { formatTemperature, getConditionDisplay } from '@weather/core';
import { getConditionEmoji, getTempColor } from '../../utils/terminal.js';
import { useTerminalSize } from '../../hooks/useTerminalSize.js';
import { SEMANTIC_COLORS } from '../../utils/theme.js';

interface UnifiedHeaderProps {
  location: string;
  temperature: number;
  condition: string;
  feelsLike: number;
  locationIndex: number;
  totalLocations: number;
}

/**
 * Unified double-height header combining location info and quick metrics
 * Replaces separate TopStatusBar + QuickMetricsBar for cleaner design
 */
export function UnifiedHeader(props: UnifiedHeaderProps) {
  const { breakpoint } = useTerminalSize();

  // Adaptive gaps based on terminal size to prevent excessive whitespace
  const row1Gap = breakpoint === 'small' ? 2 : breakpoint === 'medium' ? 3 : 4;

  const emoji = getConditionEmoji(props.condition);
  const conditionDisplay = getConditionDisplay(props.condition);
  const tempColor = getTempColor(props.temperature);

  return (
    <Box
      flexDirection="column"
      borderStyle="single"
      borderColor={SEMANTIC_COLORS.temperature.neutral}
      paddingX={2}
      paddingY={0}
    >
      {/* Row 1: Location + Current Conditions */}
      <Box gap={row1Gap} paddingX={1}>
        <Box gap={1}>
          <Text color={SEMANTIC_COLORS.alert.info}>▸</Text>
          <Text bold color={SEMANTIC_COLORS.temperature.neutral}>
            {props.location.toUpperCase()}
          </Text>
        </Box>

        <Box gap={1}>
          <Text bold color={tempColor}>
            {formatTemperature(props.temperature, 'C')}
          </Text>
          <Text>{emoji}</Text>
          <Text bold color={SEMANTIC_COLORS.temperature.neutral}>
            {conditionDisplay.toUpperCase()}
          </Text>
        </Box>

        <Box gap={1}>
          <Text dimColor>Feels</Text>
          <Text color={getTempColor(props.feelsLike)}>
            {formatTemperature(props.feelsLike, 'C')}
          </Text>
        </Box>

      </Box>
    </Box>
  );
}
