import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import type { WeatherData } from '@weather/core';
import { formatTemperature } from '@weather/core';
import { getConditionEmoji, getTempColor } from '../utils/terminal.js';
import { Sparkline } from './visualizations/Sparkline.js';
import { TemperatureRangeBar } from './visualizations/TemperatureRangeBar.js';
import { useTerminalSize } from '../hooks/useTerminalSize.js';
import { BORDER_HEAVY, SEMANTIC_COLORS } from '../utils/theme.js';

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
          <Text
            color={view === 'hourly' ? SEMANTIC_COLORS.alert.info : undefined}
          >
            {' '}Hourly
          </Text>
        </Box>
        <Box>
          <Text dimColor>[w]</Text>
          <Text
            color={view === 'daily' ? SEMANTIC_COLORS.alert.info : undefined}
          >
            {' '}Weekly
          </Text>
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
  const { breakpoint } = useTerminalSize();

  // Extract data for sparklines
  const highTemps = data.daily.map((d) => d.temperatureMax);
  const lowTemps = data.daily.map((d) => d.temperatureMin);
  const precipProbs = data.daily.map((d) => d.precipitationProbability);
  const uvIndexes = data.daily.map((d) => d.uvIndexMax || 0);

  // Show enhanced view on medium+ screens
  const showSparklines = breakpoint !== 'tiny' && breakpoint !== 'small';

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor={SEMANTIC_COLORS.temperature.neutral}
      paddingX={2}
      paddingY={0}
    >
      {/* Title */}
      <Box
        marginBottom={0}
        paddingX={1}
        width="100%"
        backgroundColor={SEMANTIC_COLORS.band.background}
      >
        <Text bold color={SEMANTIC_COLORS.band.text}>
          {BORDER_HEAVY.horizontal.repeat(2)} 7-DAY FORECAST{' '}
          {BORDER_HEAVY.horizontal.repeat(2)}
        </Text>
      </Box>

      {/* Day-by-day forecast */}
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
            <Box key={index} gap={2} flexDirection="column">
              <Box gap={2}>
                <Box width={10}>
                  <Text>{dayName}</Text>
                  <Text dimColor> {dateStr}</Text>
                </Box>
                <Text>{emoji}</Text>
                <Box gap={1}>
                  <Text color={SEMANTIC_COLORS.temperature.warm}>{high}</Text>
                  <Text dimColor>/</Text>
                  <Text color={SEMANTIC_COLORS.temperature.cold}>{low}</Text>
                </Box>
                <Box gap={1}>
                  <Text dimColor>Rain:</Text>
                  <Text color={SEMANTIC_COLORS.alert.info}>
                    {day.precipitationProbability}%
                  </Text>
                </Box>
                {day.uvIndexMax && day.uvIndexMax > 0 && (
                  <Box gap={1}>
                    <Text dimColor>UV:</Text>
                    <Text color={SEMANTIC_COLORS.alert.warning}>
                      {day.uvIndexMax}
                    </Text>
                  </Box>
                )}
                {day.windSpeedMax && (
                  <Box gap={1}>
                    <Text dimColor>Wind:</Text>
                    <Text>{Math.round(day.windSpeedMax)} km/h</Text>
                  </Box>
                )}
              </Box>
              {/* Temperature Range Bar */}
              <Box marginLeft={12}>
                <TemperatureRangeBar
                  min={day.temperatureMin}
                  max={day.temperatureMax}
                  width={30}
                />
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Weekly trends (sparklines) */}
      {showSparklines && (
        <Box flexDirection="column" marginTop={2} borderTop borderColor="gray">
          <Box marginTop={1}>
            <Text bold color={SEMANTIC_COLORS.alert.warning}>Weekly Trends</Text>
          </Box>

          {/* Temperature trends */}
          <Box flexDirection="column" marginTop={1}>
            <Box gap={2}>
              <Box width={12}>
                <Text dimColor>High Temps</Text>
              </Box>
              <Sparkline
                data={highTemps}
                width={28}
                color={SEMANTIC_COLORS.temperature.warm}
              />
              <Box gap={1}>
                <Text color={SEMANTIC_COLORS.temperature.warm}>
                  {Math.round(Math.max(...highTemps))}°
                </Text>
                <Text dimColor>max</Text>
              </Box>
            </Box>

            <Box gap={2} marginTop={0}>
              <Box width={12}>
                <Text dimColor>Low Temps</Text>
              </Box>
              <Sparkline
                data={lowTemps}
                width={28}
                color={SEMANTIC_COLORS.temperature.cold}
              />
              <Box gap={1}>
                <Text color={SEMANTIC_COLORS.temperature.cold}>
                  {Math.round(Math.min(...lowTemps))}°
                </Text>
                <Text dimColor>min</Text>
              </Box>
            </Box>
          </Box>

          {/* Precipitation trend */}
          <Box flexDirection="column" marginTop={1}>
            <Box gap={2}>
              <Box width={12}>
                <Text dimColor>Rain Chance</Text>
              </Box>
              <Sparkline
                data={precipProbs}
                width={28}
                color={SEMANTIC_COLORS.alert.info}
              />
              <Box gap={1}>
                <Text color={SEMANTIC_COLORS.alert.info}>
                  {Math.round(Math.max(...precipProbs))}%
                </Text>
                <Text dimColor>max</Text>
              </Box>
            </Box>
          </Box>

          {/* UV Index trend */}
          {uvIndexes.some(uv => uv > 0) && (
            <Box flexDirection="column" marginTop={1}>
              <Box gap={2}>
                <Box width={12}>
                  <Text dimColor>UV Index</Text>
                </Box>
                <Sparkline
                  data={uvIndexes}
                  width={28}
                  color={SEMANTIC_COLORS.alert.warning}
                />
                <Box gap={1}>
                  <Text color={SEMANTIC_COLORS.alert.warning}>
                    {Math.round(Math.max(...uvIndexes))}
                  </Text>
                  <Text dimColor>max</Text>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
