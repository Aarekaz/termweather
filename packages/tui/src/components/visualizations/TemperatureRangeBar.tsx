import React from 'react';
import { Box, Text } from 'ink';
import { SYMBOLS } from '../../utils/symbols.js';
import { getTemperatureColor, SEMANTIC_COLORS } from '../../utils/theme.js';

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

  // Build the bar with per-segment temperature colors
  const chars: string[] = Array(width).fill(SYMBOLS.progress[0]); // ░ empty
  const colors: string[] = Array(width).fill(SEMANTIC_COLORS.temperature.neutral);

  for (let i = minChar; i <= maxChar; i++) {
    if (i >= 0 && i < width) {
      chars[i] = SYMBOLS.progress[3]; // █ filled range
      const tempAt = scaleMin + (i / Math.max(1, width - 1)) * scale;
      colors[i] = getTemperatureColor(tempAt);
    }
  }

  if (currentChar !== undefined && currentChar >= 0 && currentChar < width) {
    chars[currentChar] = '●';
    colors[currentChar] = SEMANTIC_COLORS.temperature.hot;
  }

  const segments: { text: string; color: string }[] = [];
  let currentText = '';
  let currentColor = colors[0];
  for (let i = 0; i < width; i++) {
    if (colors[i] !== currentColor) {
      segments.push({ text: currentText, color: currentColor });
      currentText = '';
      currentColor = colors[i];
    }
    currentText += chars[i];
  }
  if (currentText) {
    segments.push({ text: currentText, color: currentColor });
  }

  return (
    <Box gap={1}>
      <Text dimColor>{min}°</Text>
      <Box>
        {segments.map((segment, index) => (
          <Text key={index} color={segment.color}>
            {segment.text}
          </Text>
        ))}
      </Box>
      <Text dimColor>{max}°</Text>
    </Box>
  );
}
