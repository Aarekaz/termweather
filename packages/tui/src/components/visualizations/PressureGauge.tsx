import React from 'react';
import { Box, Text } from 'ink';
import { SYMBOLS } from '../../utils/symbols.js';
import { Sparkline } from './Sparkline.js';

interface PressureGaugeProps {
  /** Current pressure in mb/hPa */
  pressure: number;
  /** Pressure trend */
  trend: 'rising' | 'falling' | 'steady';
  /** Optional 24h pressure history for sparkline */
  history?: number[];
  /** Unit to display */
  unit?: string;
}

/**
 * Pressure gauge visualization
 * Shows current pressure with trend indicator and optional history sparkline
 */
export function PressureGauge({
  pressure,
  trend,
  history,
  unit = 'mb',
}: PressureGaugeProps) {
  const trendSymbol =
    trend === 'rising'
      ? SYMBOLS.trendUp
      : trend === 'falling'
      ? SYMBOLS.trendDown
      : SYMBOLS.trendSteady;

  const trendColor =
    trend === 'rising'
      ? 'green'
      : trend === 'falling'
      ? 'red'
      : 'gray';

  const trendLabel =
    trend === 'rising'
      ? 'Rising'
      : trend === 'falling'
      ? 'Falling'
      : 'Steady';

  return (
    <Box flexDirection="column" gap={0}>
      {/* Current pressure with trend */}
      <Box gap={1}>
        <Text bold>
          {Math.round(pressure)} {unit}
        </Text>
        <Text color={trendColor}>{trendSymbol}</Text>
      </Box>

      {/* Trend label */}
      <Text dimColor>{trendLabel}</Text>

      {/* 24h history sparkline if available */}
      {history && history.length > 0 && (
        <Box marginTop={0}>
          <Sparkline data={history} width={12} color={trendColor} />
        </Box>
      )}
    </Box>
  );
}

/**
 * Get weather prediction based on pressure and trend
 * Rough barometric pressure interpretation
 */
export function getPressurePrediction(
  pressure: number,
  trend: 'rising' | 'falling' | 'steady'
): string {
  // Pressure thresholds (mb/hPa)
  const low = 1000;
  const normal = 1013;
  const high = 1020;

  if (pressure < low) {
    return trend === 'falling' ? 'Storm likely' : 'Unsettled';
  }

  if (pressure > high) {
    return trend === 'rising' ? 'Clear & dry' : 'Fair weather';
  }

  if (trend === 'falling') {
    return 'Cloudy/rain likely';
  }

  if (trend === 'rising') {
    return 'Improving';
  }

  return 'Settled';
}
