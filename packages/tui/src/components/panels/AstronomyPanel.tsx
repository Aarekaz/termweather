import React from 'react';
import { Box, Text } from 'ink';
import type { SunTimes } from '@weather/core';
import { calculateDaylightDuration } from '@weather/core';
import { BORDER_HEAVY } from '../../utils/theme.js';
import { SunArc } from '../visualizations/SunArc.js';
import { MoonPhaseCompact } from '../visualizations/MoonPhase.js';

interface AstronomyPanelProps {
  /** Sun times data */
  sunTimes: SunTimes;
  /** Current time (defaults to now) */
  currentTime?: Date;
}

/**
 * Astronomy panel
 * Displays sun arc, sunrise/sunset times, moon phase, and daylight duration
 */
export function AstronomyPanel({ sunTimes, currentTime }: AstronomyPanelProps) {
  const daylightDuration = calculateDaylightDuration(
    sunTimes.sunrise,
    sunTimes.sunset
  );

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor="cyan"
      paddingX={2}
      paddingY={1}
      width={35}
    >
      {/* Title */}
      <Box marginBottom={1}>
        <Text bold color="cyan">
          {BORDER_HEAVY.horizontal.repeat(2)} Astronomy{' '}
          {BORDER_HEAVY.horizontal.repeat(2)}
        </Text>
      </Box>

      {/* Sun arc visualization */}
      <Box justifyContent="center" marginBottom={1}>
        <SunArc
          sunrise={sunTimes.sunrise}
          sunset={sunTimes.sunset}
          currentTime={currentTime}
        />
      </Box>

      {/* Daylight duration */}
      <Box justifyContent="center" marginBottom={1}>
        <Text dimColor>Daylight: </Text>
        <Text>{daylightDuration}</Text>
      </Box>

      {/* Moon phase */}
      <Box justifyContent="center">
        <Box gap={1}>
          <Text dimColor>Moon:</Text>
          <MoonPhaseCompact date={currentTime} />
        </Box>
      </Box>
    </Box>
  );
}
