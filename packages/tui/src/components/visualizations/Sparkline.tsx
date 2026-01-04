import React from 'react';
import { Text } from 'ink';
import { generateSparkline, getTrendDirection } from '../../utils/sparkline.js';
import { SYMBOLS } from '../../utils/symbols.js';

interface SparklineProps {
  /** Array of numeric values to visualize */
  data: number[];
  /** Width in characters */
  width: number;
  /** Color for the sparkline */
  color?: string;
  /** Show trend arrow indicator */
  showTrend?: boolean;
}

/**
 * Sparkline visualization component
 * Displays inline chart using Unicode block characters ▁▂▃▄▅▆▇█
 */
export function Sparkline({ data, width, color, showTrend = false }: SparklineProps) {
  if (data.length === 0 || width <= 0) {
    return null;
  }

  const sparklineWidth = showTrend ? width - 2 : width;
  const sparklineStr = generateSparkline(data, sparklineWidth);

  if (showTrend) {
    const trend = getTrendDirection(data);
    const arrow =
      trend === 'up'
        ? SYMBOLS.trendUp
        : trend === 'down'
        ? SYMBOLS.trendDown
        : SYMBOLS.trendSteady;

    const arrowColor =
      trend === 'up' ? 'green' : trend === 'down' ? 'red' : 'gray';

    return (
      <>
        <Text color={color}>{sparklineStr}</Text>
        <Text color={arrowColor}> {arrow}</Text>
      </>
    );
  }

  return <Text color={color}>{sparklineStr}</Text>;
}
