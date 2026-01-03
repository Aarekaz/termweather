import React from 'react';
import { Box, Text } from 'ink';
import { getMoonPhase } from '../../utils/astronomy.js';

interface MoonPhaseProps {
  /** Date to calculate moon phase for (defaults to now) */
  date?: Date;
}

/**
 * Moon phase visualization
 * Displays current moon phase emoji, name, and illumination percentage
 */
export function MoonPhase({ date = new Date() }: MoonPhaseProps) {
  const { emoji, name, illumination } = getMoonPhase(date);

  return (
    <Box flexDirection="column" alignItems="center" gap={0}>
      <Box>
        <Text>{emoji}</Text>
        <Text dimColor> {name}</Text>
      </Box>
      <Text dimColor>{illumination}% illuminated</Text>
    </Box>
  );
}

/**
 * Compact moon phase display
 * Shows only emoji and phase name
 */
export function MoonPhaseCompact({ date = new Date() }: MoonPhaseProps) {
  const { emoji, name } = getMoonPhase(date);

  return (
    <Box gap={1}>
      <Text>{emoji}</Text>
      <Text dimColor>{name}</Text>
    </Box>
  );
}
