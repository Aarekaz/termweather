import React from 'react';
import { Box, Text } from 'ink';
import type { SunTimes } from '@weather/core';
import { SunArc } from '../visualizations/SunArc.js';
import { MoonPhaseCompact } from '../visualizations/MoonPhase.js';
import { getAQIRating } from '@weather/core';

interface BottomSectionProps {
  sunTimes: SunTimes;
  visibility: number;
  aqi?: number;
  cloudCover: number;
  currentTime?: Date;
}

/**
 * Bottom section - Astronomy and additional details
 * Two-column layout with supplementary information
 */
export function BottomSection({
  sunTimes,
  visibility,
  aqi,
  cloudCover,
  currentTime,
}: BottomSectionProps) {
  return (
    <Box gap={1}>
      {/* Left column: Astronomy */}
      <Box
        flexDirection="column"
        borderStyle="single"
        borderColor="gray"
        paddingX={2}
        paddingY={0}
        flexGrow={1}
      >
        <Text dimColor>ASTRONOMY</Text>
        <Box marginTop={0} justifyContent="center">
          <SunArc
            sunrise={sunTimes.sunrise}
            sunset={sunTimes.sunset}
            currentTime={currentTime}
          />
        </Box>
        <Box marginTop={0} justifyContent="center">
          <MoonPhaseCompact date={currentTime} />
        </Box>
      </Box>

      {/* Right column: Details */}
      <Box
        flexDirection="column"
        borderStyle="single"
        borderColor="gray"
        paddingX={2}
        paddingY={0}
        flexGrow={1}
      >
        <Text dimColor>DETAILS</Text>
        <Box marginTop={0} gap={2}>
          {/* Visibility */}
          <Box gap={1}>
            <Text dimColor>Visibility:</Text>
            <Text>{visibility} km</Text>
          </Box>
        </Box>
        <Box gap={2}>
          {/* Cloud Cover */}
          <Box gap={1}>
            <Text dimColor>Cloud Cover:</Text>
            <Text>{cloudCover}%</Text>
          </Box>
        </Box>
        <Box gap={2}>
          {/* AQI */}
          {aqi != null && (
            <Box gap={1}>
              <Text dimColor>AQI:</Text>
              <Text color={getAQIColor(aqi)}>{aqi}</Text>
              <Text dimColor>{getAQIRating(aqi)}</Text>
            </Box>
          )}
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
