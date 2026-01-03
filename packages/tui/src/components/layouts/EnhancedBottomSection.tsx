import React from 'react';
import { Box, Text } from 'ink';
import type { SunTimes } from '@weather/core';
import { getAQIRating, formatTemperature } from '@weather/core';
import { SunArc } from '../visualizations/SunArc.js';
import { MoonPhaseCompact } from '../visualizations/MoonPhase.js';
import { getTempColor } from '../../utils/terminal.js';
import {
  calculateAndFormatDewpoint,
  getVisibilityRating,
  getPressureDescription,
  createProgressBar,
} from '../../utils/atmosphere.js';
import { SYMBOLS } from '../../utils/symbols.js';

interface EnhancedBottomSectionProps {
  sunTimes: SunTimes;
  visibility: number;
  aqi?: number;
  cloudCover: number;
  temperature: number;
  humidity: number;
  pressure: number;
  pressureTrend: 'rising' | 'falling' | 'steady';
  currentTime?: Date;
}

/**
 * Enhanced bottom section with astronomy and atmospheric data
 * Two-column layout with expanded information including dewpoint
 */
export function EnhancedBottomSection(props: EnhancedBottomSectionProps) {
  // Calculate dewpoint on-the-fly
  const dewpointData = calculateAndFormatDewpoint(
    props.temperature,
    props.humidity
  );

  const trendSymbol =
    props.pressureTrend === 'rising'
      ? SYMBOLS.trendUp
      : props.pressureTrend === 'falling'
      ? SYMBOLS.trendDown
      : SYMBOLS.trendSteady;

  const pressureTrendColor =
    props.pressureTrend === 'rising'
      ? 'green'
      : props.pressureTrend === 'falling'
      ? 'red'
      : 'gray';

  return (
    <Box gap={1}>
      {/* Left column: SUN & MOON */}
      <Box
        flexDirection="column"
        borderStyle="single"
        borderColor="gray"
        paddingX={2}
        paddingY={0}
        flexGrow={1}
      >
        <Text dimColor>SUN & MOON</Text>

        {/* Sunrise */}
        <Box gap={2} marginTop={0}>
          <Text dimColor>Sunrise</Text>
          <Text color="yellow">↑</Text>
          <Text>{props.sunTimes.sunrise}</Text>
        </Box>

        {/* Sun arc visualization */}
        <Box justifyContent="center" marginTop={0}>
          <SunArc
            sunrise={props.sunTimes.sunrise}
            sunset={props.sunTimes.sunset}
            currentTime={props.currentTime}
          />
        </Box>

        {/* Sunset */}
        <Box gap={2} marginTop={0}>
          <Text dimColor>Sunset</Text>
          <Text color="magenta">↓</Text>
          <Text>{props.sunTimes.sunset}</Text>
        </Box>

        {/* Moon phase */}
        <Box marginTop={1} justifyContent="center">
          <MoonPhaseCompact date={props.currentTime} />
        </Box>
      </Box>

      {/* Right column: ATMOSPHERIC */}
      <Box
        flexDirection="column"
        borderStyle="single"
        borderColor="gray"
        paddingX={2}
        paddingY={0}
        flexGrow={1}
      >
        <Text dimColor>ATMOSPHERIC</Text>

        {/* Visibility */}
        <Box justifyContent="space-between" marginTop={0}>
          <Box gap={2}>
            <Text dimColor>Visibility</Text>
            <Text>{props.visibility} km</Text>
          </Box>
          <Text color="green">{getVisibilityRating(props.visibility)}</Text>
        </Box>

        {/* Cloud Cover with progress bar */}
        <Box justifyContent="space-between" marginTop={0}>
          <Box gap={2}>
            <Text dimColor>Cloud Cover</Text>
            <Text>{props.cloudCover}%</Text>
          </Box>
          <Text color="gray">{createProgressBar(props.cloudCover, 100, 12)}</Text>
        </Box>

        {/* AQI */}
        {props.aqi != null && (
          <Box justifyContent="space-between" marginTop={0}>
            <Box gap={2}>
              <Text dimColor>Air Quality</Text>
              <Text color={getAQIColor(props.aqi)}>{props.aqi}</Text>
            </Box>
            <Box gap={1}>
              <Text color={getAQIColor(props.aqi)}>
                {createProgressBar(props.aqi, 150, 6)}
              </Text>
              <Text color={getAQIColor(props.aqi)}>
                {getAQIRating(props.aqi)}
              </Text>
            </Box>
          </Box>
        )}

        {/* Dewpoint (calculated) */}
        <Box justifyContent="space-between" marginTop={0}>
          <Box gap={2}>
            <Text dimColor>Dewpoint</Text>
            <Text color={getTempColor(dewpointData.value)}>
              {formatTemperature(dewpointData.value, 'C')}
            </Text>
          </Box>
          <Text dimColor>{dewpointData.description}</Text>
        </Box>

        {/* Pressure (detailed) */}
        <Box justifyContent="space-between" marginTop={0}>
          <Box gap={2}>
            <Text dimColor>Pressure</Text>
            <Text>{Math.round(props.pressure)} mb</Text>
            <Text color={pressureTrendColor}>{trendSymbol}</Text>
          </Box>
          <Text dimColor>{getPressureDescription(props.pressureTrend)}</Text>
        </Box>
      </Box>
    </Box>
  );
}

/**
 * Get AQI color
 */
function getAQIColor(aqi: number): string {
  if (aqi <= 50) return 'green';
  if (aqi <= 100) return 'yellow';
  if (aqi <= 150) return 'magenta';
  return 'red';
}
