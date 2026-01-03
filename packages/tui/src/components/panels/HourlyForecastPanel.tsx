import React from 'react';
import { Box, Text } from 'ink';
import type { HourlyForecast } from '@weather/core';
import { getConditionEmoji, getTempColor } from '../../utils/terminal.js';
import { BORDER_HEAVY } from '../../utils/theme.js';
import { Sparkline } from '../visualizations/Sparkline.js';
import { WindSparkline } from '../visualizations/WindSparkline.js';

interface HourlyForecastPanelProps {
  /** Hourly forecast data */
  hourly: HourlyForecast[];
  /** Number of hours to display */
  hours?: number;
}

/**
 * Hourly forecast panel
 * Displays upcoming hours with sparklines for temperature and precipitation
 */
export function HourlyForecastPanel({
  hourly,
  hours = 8,
}: HourlyForecastPanelProps) {
  const forecastData = hourly.slice(0, hours);

  // Extract data for sparklines
  const tempData = forecastData.map((h) => h.temperature);
  const precipData = forecastData.map((h) => h.precipitationProbability);
  const feelsLikeData = forecastData.map((h) => h.feelsLike);
  const windSpeedData = forecastData.map((h) => h.windSpeed);

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor="cyan"
      paddingX={2}
      paddingY={0}
    >
      {/* Title */}
      <Box marginBottom={0}>
        <Text bold color="cyan">
          {BORDER_HEAVY.horizontal.repeat(2)} HOURLY FORECAST{' '}
          {BORDER_HEAVY.horizontal.repeat(2)}
        </Text>
      </Box>

      {/* Hour labels and icons */}
      <Box gap={1} marginBottom={0}>
        {forecastData.map((hour, index) => {
          const time = new Date(hour.time).toLocaleTimeString('en-US', {
            hour: 'numeric',
          });
          const shortTime = time.replace(' AM', '').replace(' PM', '');

          return (
            <Box
              key={index}
              flexDirection="column"
              alignItems="center"
              width={4}
            >
              <Text dimColor>{shortTime}</Text>
              <Text>{getConditionEmoji(hour.condition)}</Text>
              <Text color={getTempColor(hour.temperature)}>
                {Math.round(hour.temperature)}°
              </Text>
            </Box>
          );
        })}
      </Box>

      {/* Sparklines section - two columns */}
      <Box flexDirection="row" gap={4} marginTop={1}>
        {/* Left column: Temperature sparklines */}
        <Box flexDirection="column" flexGrow={1}>
          <Box gap={2}>
            <Text dimColor>Temp</Text>
            <Sparkline data={tempData} width={hours * 4} color="yellow" />
          </Box>
          <Box gap={2} marginTop={0}>
            <Text dimColor>Rain</Text>
            <Sparkline data={precipData} width={hours * 4} color="blue" />
          </Box>
        </Box>

        {/* Right column: Feels Like + Wind */}
        <Box flexDirection="column" flexGrow={1}>
          <Box gap={2}>
            <Text dimColor>Feel</Text>
            <Sparkline data={feelsLikeData} width={hours * 4} color="cyan" />
          </Box>
          <Box gap={2} marginTop={0}>
            <Text dimColor>Wind</Text>
            <WindSparkline data={windSpeedData} width={hours * 4} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
