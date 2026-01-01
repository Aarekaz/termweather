import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import type { WeatherData } from '@weather/core';
import { formatTemperature } from '@weather/core';
import { getConditionEmoji, getTempColor } from '../utils/terminal.js';

interface ForecastProps {
  data: WeatherData | null;
  loading?: boolean;
}

export function Forecast({ data, loading }: ForecastProps) {
  const [view, setView] = useState<'hourly' | 'daily'>('daily');

  useInput((input) => {
    if (input === 'h') setView('hourly');
    if (input === 'w') setView('daily');
  });

  if (loading && !data) {
    return (
      <Box padding={2} justifyContent="center">
        <Text>Loading forecast...</Text>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box padding={2} justifyContent="center">
        <Text color="red">Failed to load forecast</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" padding={1}>
      {/* View Toggle */}
      <Box marginBottom={1} gap={2}>
        <Box>
          <Text dimColor>[h]</Text>
          <Text color={view === 'hourly' ? 'cyan' : undefined}> Hourly</Text>
        </Box>
        <Box>
          <Text dimColor>[w]</Text>
          <Text color={view === 'daily' ? 'cyan' : undefined}> Weekly</Text>
        </Box>
      </Box>

      {view === 'hourly' ? (
        <HourlyForecast data={data} />
      ) : (
        <DailyForecast data={data} />
      )}
    </Box>
  );
}

function HourlyForecast({ data }: { data: WeatherData }) {
  return (
    <Box flexDirection="column">
      <Text bold>24-Hour Forecast</Text>
      <Box flexDirection="column" marginTop={1}>
        {data.hourly.slice(0, 24).map((hour, index) => {
          const time = new Date(hour.time);
          const timeStr = time.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          });
          const emoji = getConditionEmoji(hour.condition);
          const temp = formatTemperature(hour.temperature, 'C');

          return (
            <Box key={index} gap={2}>
              <Text dimColor>{timeStr.padEnd(8)}</Text>
              <Text>{emoji}</Text>
              <Text color={getTempColor(hour.temperature)}>{temp.padStart(6)}</Text>
              <Text dimColor>Precip: {hour.precipitationProbability}%</Text>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

function DailyForecast({ data }: { data: WeatherData }) {
  return (
    <Box flexDirection="column">
      <Text bold>7-Day Forecast</Text>
      <Box flexDirection="column" marginTop={1}>
        {data.daily.map((day, index) => {
          const date = new Date(day.date);
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
          const dateStr = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });
          const emoji = getConditionEmoji(day.condition);
          const high = formatTemperature(day.temperatureMax, 'C');
          const low = formatTemperature(day.temperatureMin, 'C');

          return (
            <Box key={index} gap={2}>
              <Text>{dayName}</Text>
              <Text dimColor>{dateStr.padEnd(7)}</Text>
              <Text>{emoji}</Text>
              <Text color="red">{high.padStart(6)}</Text>
              <Text dimColor>/</Text>
              <Text color="blue">{low.padStart(6)}</Text>
              <Text dimColor>Precip: {day.precipitationProbability}%</Text>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
