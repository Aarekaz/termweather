import React from 'react';
import { Text } from 'ink';

interface WindSparklineProps {
  data: number[];
  width: number;
}

/**
 * Wind speed sparkline using horizontal bar characters
 * Shows wind intensity with varying line styles
 */
export function WindSparkline({ data, width }: WindSparklineProps) {
  // Wind intensity characters: calm → light → moderate → strong
  const WIND_CHARS = [' ', '╺', '╸', '━', '━'];

  // Normalize data to 0-1 range
  const max = Math.max(...data, 1); // Avoid division by zero
  const min = Math.min(...data, 0);
  const range = max - min || 1;

  // Generate sparkline
  const sparkline = data
    .map((value) => {
      const normalized = (value - min) / range;
      const index = Math.min(
        Math.floor(normalized * WIND_CHARS.length),
        WIND_CHARS.length - 1
      );
      return WIND_CHARS[index];
    })
    .join('');

  // Pad or truncate to exact width
  const paddedSparkline =
    sparkline.length < width
      ? sparkline + ' '.repeat(width - sparkline.length)
      : sparkline.substring(0, width);

  return <Text color="gray">{paddedSparkline}</Text>;
}
