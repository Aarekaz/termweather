import React from 'react';
import { Box, Text } from 'ink';
import { getCompassArrow } from '../../utils/symbols.js';

interface CompassRoseProps {
  /** Wind direction (e.g., "N", "NE", "SSW") */
  direction: string;
  /** Wind speed */
  speed: number;
  /** Unit for wind speed */
  unit?: string;
}

/**
 * Compass rose visualization showing wind direction
 * Displays 8-point compass with highlighted current direction
 */
export function CompassRose({ direction, speed, unit = 'km/h' }: CompassRoseProps) {
  const arrow = getCompassArrow(direction);

  // Simplified 8-point compass rose
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

  return (
    <Box flexDirection="column" alignItems="center" gap={0}>
      {/* Top row: NW N NE */}
      <Box gap={1}>
        {['NW', 'N', 'NE'].map((dir) => (
          <Text
            key={dir}
            color={dir === direction ? 'cyan' : 'gray'}
            dimColor={dir !== direction}
            bold={dir === direction}
          >
            {dir === direction ? arrow : '·'}
          </Text>
        ))}
      </Box>

      {/* Middle row: W · E */}
      <Box gap={1}>
        {['W', '', 'E'].map((dir, i) => (
          <Text
            key={i}
            color={dir === direction ? 'cyan' : 'gray'}
            dimColor={dir !== direction && dir !== ''}
            bold={dir === direction}
          >
            {dir === '' ? '·' : dir === direction ? arrow : '·'}
          </Text>
        ))}
      </Box>

      {/* Bottom row: SW S SE */}
      <Box gap={1}>
        {['SW', 'S', 'SE'].map((dir) => (
          <Text
            key={dir}
            color={dir === direction ? 'cyan' : 'gray'}
            dimColor={dir !== direction}
            bold={dir === direction}
          >
            {dir === direction ? arrow : '·'}
          </Text>
        ))}
      </Box>

      {/* Wind speed below compass */}
      <Box marginTop={0}>
        <Text color="cyan">
          {speed} {unit}
        </Text>
      </Box>
    </Box>
  );
}

/**
 * Compact wind display (arrow + speed)
 * Alternative to full compass rose for space-constrained layouts
 */
export function WindIndicator({
  direction,
  speed,
  unit = 'km/h',
}: CompassRoseProps) {
  const arrow = getCompassArrow(direction);

  return (
    <Box gap={1}>
      <Text color="cyan" bold>
        {arrow}
      </Text>
      <Text dimColor>{direction}</Text>
      <Text>
        {speed} {unit}
      </Text>
    </Box>
  );
}
