import React from 'react';
import { Box, Text } from 'ink';
import { SYMBOLS } from '../../utils/symbols.js';

interface TemperatureRangeBarProps {
  /** Minimum temperature */
  min: number;
  /** Maximum temperature */
  max: number;
  /** Current temperature (optional - shows marker) */
  current?: number;
  /** Width in characters */
  width?: number;
  /** Global min for scale (default: -10°C) */
  scaleMin?: number;
  /** Global max for scale (default: 40°C) */
  scaleMax?: number;
}

/**
 * Temperature Range Bar
 * Visual bar showing daily min/max temperature range
 * Similar to Apple Weather's temperature bars
 */
export function TemperatureRangeBar({
  min,
  max,
  current,
  width = 20,
  scaleMin = -10,
  scaleMax = 40,
}: TemperatureRangeBarProps) {
  const scale = scaleMax - scaleMin;

  // Calculate positions (0-1 normalized)
  const minPos = Math.max(0, Math.min(1, (min - scaleMin) / scale));
  const maxPos = Math.max(0, Math.min(1, (max - scaleMin) / scale));
  const currentPos = current !== undefined
    ? Math.max(0, Math.min(1, (current - scaleMin) / scale))
    : undefined;

  // Convert to character positions
  const minChar = Math.floor(minPos * width);
  const maxChar = Math.floor(maxPos * width);
  const currentChar = currentPos !== undefined
    ? Math.floor(currentPos * width)
    : undefined;

  // Build the bar
  const chars: string[] = Array(width).fill(SYMBOLS.progress[0]); // ░ empty

  // Fill range with gradient
  for (let i = minChar; i <= maxChar; i++) {
    if (i >= 0 && i < width) {
      // Use color gradient: cooler → warmer
      const rangePos = (i - minChar) / (maxChar - minChar || 1);
      if (rangePos < 0.33) {
        chars[i] = SYMBOLS.progress[1]; // ▒ cool
      } else if (rangePos < 0.66) {
        chars[i] = SYMBOLS.progress[2]; // ▓ medium
      } else {
        chars[i] = SYMBOLS.progress[3]; // █ warm
      }
    }
  }

  // Add current temperature marker
  if (currentChar !== undefined && currentChar >= 0 && currentChar < width) {
    chars[currentChar] = '●'; // Current temp marker
  }

  // Determine color based on temperature
  const getColor = (temp: number): string => {
    if (temp < 0) return 'blue';
    if (temp < 10) return 'cyan';
    if (temp < 20) return 'green';
    if (temp < 30) return 'yellow';
    return 'red';
  };

  const barColor = getColor((min + max) / 2);

  return (
    <Box gap={1}>
      <Text dimColor>{min}°</Text>
      <Text color={barColor}>{chars.join('')}</Text>
      <Text dimColor>{max}°</Text>
    </Box>
  );
}
