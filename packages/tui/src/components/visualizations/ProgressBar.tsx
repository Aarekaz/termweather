import React from 'react';
import { Box, Text } from 'ink';
import { SYMBOLS } from '../../utils/symbols.js';

interface ProgressBarProps {
  /** Current value */
  value: number;
  /** Maximum value */
  max: number;
  /** Width in characters */
  width: number;
  /** Static color or function to determine color based on percentage */
  color?: string | ((percent: number) => string);
  /** Show value label after the bar */
  showValue?: boolean;
  /** Label to display before the bar */
  label?: string;
}

/**
 * Progress bar visualization component
 * Uses block characters ░▒▓█ for smooth gradient effect
 */
export function ProgressBar({
  value,
  max,
  width,
  color,
  showValue = false,
  label,
}: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  const filled = Math.floor((percent / 100) * width);
  const empty = width - filled;

  // Create progress bar string
  const filledChar = SYMBOLS.progress[3]; // █
  const emptyChar = SYMBOLS.progress[0]; // ░
  const barString = filledChar.repeat(filled) + emptyChar.repeat(empty);

  // Determine color
  const barColor = typeof color === 'function' ? color(percent) : color;

  return (
    <Box gap={1}>
      {label && <Text dimColor>{label}</Text>}
      <Text color={barColor}>{barString}</Text>
      {showValue && (
        <Text color={barColor}>{Math.round(percent)}%</Text>
      )}
    </Box>
  );
}

/**
 * Get color based on percentage threshold
 * Useful for UV index, AQI, etc.
 */
export function getThresholdColor(
  percent: number,
  thresholds: { value: number; color: string }[]
): string {
  // Sort thresholds by value (ascending)
  const sorted = [...thresholds].sort((a, b) => a.value - b.value);

  // Find first threshold that exceeds the percent
  for (const threshold of sorted) {
    if (percent <= threshold.value) {
      return threshold.color;
    }
  }

  // Return last threshold color if all exceeded
  return sorted[sorted.length - 1].color;
}
