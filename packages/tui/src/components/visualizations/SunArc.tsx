import React from 'react';
import { Box, Text } from 'ink';
import { calculateSunPosition } from '../../utils/astronomy.js';

interface SunArcProps {
  /** Sunrise time (HH:MM format) */
  sunrise: string;
  /** Sunset time (HH:MM format) */
  sunset: string;
  /** Current time (defaults to now) */
  currentTime?: Date;
}

/**
 * Sun arc visualization showing daylight duration
 * Displays sunrise/sunset times with current sun position
 */
export function SunArc({ sunrise, sunset, currentTime }: SunArcProps) {
  const sunPosition = calculateSunPosition(sunrise, sunset, currentTime);
  const isDay = sunPosition !== null;

  // Create arc visualization
  // Arc characters: ╭ ─ ● ─ ╮
  const arcWidth = 15;
  const arcChars = Array(arcWidth).fill('─');

  // Place sun marker if daytime
  if (isDay && sunPosition !== null) {
    const markerPos = Math.floor(sunPosition * (arcWidth - 1));
    arcChars[markerPos] = '●';
  }

  return (
    <Box flexDirection="column" alignItems="center" gap={0}>
      {/* Top label with sunrise and sunset times */}
      <Box gap={2}>
        <Text dimColor>
          ↑ {sunrise}
        </Text>
        <Text dimColor>
          ↓ {sunset}
        </Text>
      </Box>

      {/* Arc visualization */}
      <Box>
        <Text color={isDay ? 'yellow' : 'gray'}>
          ╭{arcChars.join('')}╮
        </Text>
      </Box>

      {/* Horizon line */}
      <Box>
        <Text dimColor>
          └{'─'.repeat(arcWidth)}┘
        </Text>
      </Box>
    </Box>
  );
}

/**
 * Compact sun times display
 * Alternative to full arc for space-constrained layouts
 */
export function SunTimes({ sunrise, sunset }: Omit<SunArcProps, 'currentTime'>) {
  return (
    <Box gap={2}>
      <Box gap={1}>
        <Text dimColor>↑</Text>
        <Text>{sunrise}</Text>
      </Box>
      <Box gap={1}>
        <Text dimColor>↓</Text>
        <Text>{sunset}</Text>
      </Box>
    </Box>
  );
}
