import React from 'react';
import { Box, Text } from 'ink';
import type { WeatherData } from '@weather/core';
import {
  formatTemperature,
  getConditionDisplay,
  calculateDaylightDuration,
} from '@weather/core';
import { Metrics } from './Metrics.js';
import { getConditionEmoji, getTempColor } from '../utils/terminal.js';

interface DashboardProps {
  data: WeatherData | null;
  loading?: boolean;
}

export function Dashboard({ data, loading }: DashboardProps) {
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

  const { current, location } = data;
  const emoji = getConditionEmoji(current.condition);
  const condition = getConditionDisplay(current.condition);
  const tempColor = getTempColor(current.temperature);

  return (
    <Box flexDirection="column" padding={1} gap={1}>
      {/* Main Temperature Display */}
      <Box flexDirection="column" alignItems="center">
        <Box>
          <Text bold color={tempColor}>
            {formatTemperature(current.temperature, 'C')}
          </Text>
          <Text> </Text>
          <Text>{emoji}</Text>
          <Text> </Text>
          <Text bold>{condition}</Text>
        </Box>
        <Text dimColor>
          Feels like {formatTemperature(current.feelsLike, 'C')}
        </Text>
      </Box>

      {/* Sun Times */}
      <Box justifyContent="center" gap={2}>
        <Text>
          <Text dimColor>Sunrise:</Text> {data.sunTimes.sunrise}
        </Text>
        <Text>
          <Text dimColor>Sunset:</Text> {data.sunTimes.sunset}
        </Text>
        <Text>
          <Text dimColor>Daylight:</Text>{' '}
          {calculateDaylightDuration(data.sunTimes.sunrise, data.sunTimes.sunset)}
        </Text>
      </Box>

      {/* Metrics Grid */}
      <Box marginTop={1}>
        <Metrics current={current} aqi={data.airQuality?.aqi} />
      </Box>

      {/* Hourly Preview */}
      <Box flexDirection="column" marginTop={1}>
        <Text bold dimColor>
          Next Hours
        </Text>
        <Box gap={1} flexWrap="wrap">
          {data.hourly.slice(0, 8).map((hour, index) => {
            const time = new Date(hour.time).toLocaleTimeString('en-US', {
              hour: 'numeric',
            });
            const hourEmoji = getConditionEmoji(hour.condition);
            return (
              <Box
                key={index}
                flexDirection="column"
                alignItems="center"
                paddingX={1}
              >
                <Text dimColor>{time}</Text>
                <Text>{hourEmoji}</Text>
                <Text color={getTempColor(hour.temperature)}>
                  {Math.round(hour.temperature)}°
                </Text>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
