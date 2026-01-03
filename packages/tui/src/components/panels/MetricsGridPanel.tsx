import React from 'react';
import { Box, Text } from 'ink';
import type { CurrentWeather } from '@weather/core';
import {
  getUVLevel,
  getAQIRating,
  formatPressure,
} from '@weather/core';
import { getUVColor, getAQIColor } from '../../utils/terminal.js';
import { BORDER_HEAVY } from '../../utils/theme.js';
import { ProgressBar, getThresholdColor } from '../visualizations/ProgressBar.js';
import { WindIndicator } from '../visualizations/CompassRose.js';
import { PressureGauge } from '../visualizations/PressureGauge.js';

interface MetricsGridPanelProps {
  /** Current weather conditions */
  current: CurrentWeather;
  /** Air Quality Index (optional) */
  aqi?: number;
  /** 24h pressure history for sparkline (optional) */
  pressureHistory?: number[];
}

/**
 * Compact metric box for grid layout
 */
function MetricBox({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Box
      flexDirection="column"
      borderStyle="single"
      borderColor="gray"
      paddingX={1}
      paddingY={0}
      minWidth={14}
    >
      <Text dimColor>{label.toUpperCase()}</Text>
      {children}
    </Box>
  );
}

/**
 * Metrics grid panel
 * 2x3 grid of key weather metrics with visualizations
 */
export function MetricsGridPanel({
  current,
  aqi,
  pressureHistory,
}: MetricsGridPanelProps) {
  // UV Index color thresholds
  const uvColorFn = (percent: number) =>
    getThresholdColor(percent, [
      { value: 20, color: 'green' },
      { value: 50, color: 'yellow' },
      { value: 70, color: 'magenta' },
      { value: 100, color: 'red' },
    ]);

  // AQI color thresholds
  const aqiColorFn = (percent: number) =>
    getThresholdColor(percent, [
      { value: 25, color: 'green' },
      { value: 50, color: 'yellow' },
      { value: 75, color: 'magenta' },
      { value: 100, color: 'red' },
    ]);

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor="cyan"
      paddingX={2}
      paddingY={1}
      width={45}
    >
      {/* Title */}
      <Box marginBottom={1}>
        <Text bold color="cyan">
          {BORDER_HEAVY.horizontal.repeat(2)} Metrics{' '}
          {BORDER_HEAVY.horizontal.repeat(2)}
        </Text>
      </Box>

      {/* Top row: Humidity, UV Index, Wind */}
      <Box gap={1} marginBottom={1}>
        <MetricBox label="Humidity">
          <ProgressBar
            value={current.humidity}
            max={100}
            width={10}
            showValue
            color="cyan"
          />
        </MetricBox>

        <MetricBox label="UV Index">
          <Box flexDirection="column">
            <Text color={getUVColor(current.uvIndex)} bold>
              {current.uvIndex}
            </Text>
            <ProgressBar
              value={current.uvIndex}
              max={11}
              width={10}
              color={uvColorFn}
            />
            <Text dimColor>{getUVLevel(current.uvIndex)}</Text>
          </Box>
        </MetricBox>

        <MetricBox label="Wind">
          <WindIndicator
            direction={current.windDirection}
            speed={current.windSpeed}
            unit="km/h"
          />
        </MetricBox>
      </Box>

      {/* Bottom row: Pressure, Visibility, AQI */}
      <Box gap={1}>
        <MetricBox label="Pressure">
          <PressureGauge
            pressure={current.pressure}
            trend={current.pressureTrend}
            history={pressureHistory}
          />
        </MetricBox>

        <MetricBox label="Visibility">
          <Text bold>{current.visibility} km</Text>
        </MetricBox>

        <MetricBox label="Air Quality">
          {aqi != null ? (
            <Box flexDirection="column">
              <Text color={getAQIColor(aqi)} bold>
                {aqi}
              </Text>
              <ProgressBar
                value={aqi}
                max={200}
                width={10}
                color={aqiColorFn}
              />
              <Text dimColor>{getAQIRating(aqi)}</Text>
            </Box>
          ) : (
            <Text dimColor>N/A</Text>
          )}
        </MetricBox>
      </Box>
    </Box>
  );
}
