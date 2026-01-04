import React from 'react';
import { Box, Text } from 'ink';
import type { WeatherData } from '@weather/core';
import { StationLayout } from './layouts/StationLayout.js';

interface DashboardProps {
  data: WeatherData | null;
  loading?: boolean;
  animationsEnabled?: boolean;
  locationIndex?: number;
  totalLocations?: number;
}

export function Dashboard({
  data,
  loading,
  animationsEnabled = true,
  locationIndex,
  totalLocations,
}: DashboardProps) {
  if (loading && !data) {
    return (
      <Box padding={2} justifyContent="center">
        <Text>Loading weather data...</Text>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box padding={2} justifyContent="center">
        <Text color="red">Failed to load weather data</Text>
      </Box>
    );
  }

  return (
    <StationLayout
      data={data}
      animationsEnabled={animationsEnabled}
      locationIndex={locationIndex}
      totalLocations={totalLocations}
    />
  );
}
