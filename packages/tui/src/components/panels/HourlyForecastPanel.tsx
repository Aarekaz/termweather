import React from 'react';
import { Box, Text } from 'ink';
import type { HourlyForecast } from '@weather/core';
import { getConditionEmoji, getTempColor } from '../../utils/terminal.js';
import { BORDER_HEAVY, SEMANTIC_COLORS } from '../../utils/theme.js';
import { Sparkline } from '../visualizations/Sparkline.js';
import { WindSparkline } from '../visualizations/WindSparkline.js';
import { getFocusBorderProps } from '../../utils/focus.js';
import { getPrecipTypeEmoji } from '../../utils/atmosphere.js';
import { useTerminalSize } from '../../hooks/useTerminalSize.js';

interface HourlyForecastPanelProps {
  /** Hourly forecast data */
  hourly: HourlyForecast[];
  /** Number of hours to display */
  hours?: number;
  /** Whether this panel currently has focus (for future interactive navigation) */
  isFocused?: boolean;
}

/**
 * Hourly forecast panel
 * Displays upcoming hours with sparklines for temperature and precipitation
 */
export function HourlyForecastPanel({
  hourly,
  hours = 8,
  isFocused = false,
}: HourlyForecastPanelProps) {
  const { breakpoint } = useTerminalSize();
  const forecastData = hourly.slice(0, hours);
  const showFeelsLike = breakpoint !== 'tiny' && breakpoint !== 'small';
  const showGust = breakpoint === 'large' || breakpoint === 'xlarge';

  // Extract data for sparklines
  const tempData = forecastData.map((h) => h.temperature);
  const precipData = forecastData.map((h) => h.precipitationProbability);
  const feelsLikeData = forecastData.map((h) => h.feelsLike);
  const windSpeedData = forecastData.map((h) => h.windSpeed);
  const windGustData = forecastData.map((h) => h.windGusts ?? h.windSpeed);

  // Get border styling based on focus state (infrastructure for future panel navigation)
  const borderProps = getFocusBorderProps(isFocused);

  return (
    <Box
      flexDirection="column"
      {...borderProps}
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

          const precipEmoji = hour.precipitationType
            ? getPrecipTypeEmoji(hour.precipitationType)
            : '';

          return (
            <Box
              key={index}
              flexDirection="column"
              alignItems="center"
              width={4}
            >
              <Text dimColor>{shortTime}</Text>
              <Text>{getConditionEmoji(hour.condition)}</Text>
              {precipEmoji && <Text>{precipEmoji}</Text>}
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
          {/* Temperature sparkline with range */}
          <Box flexDirection="column">
            <Box gap={2}>
              <Text dimColor>Temp</Text>
              <Sparkline
                data={tempData}
                width={hours * 4}
                color={SEMANTIC_COLORS.temperature.warm}
              />
            </Box>
            <Box gap={1} marginTop={0}>
              <Text dimColor>Range:</Text>
              <Text color={SEMANTIC_COLORS.temperature.neutral}>
                {Math.round(Math.min(...tempData))}° to{' '}
                {Math.round(Math.max(...tempData))}°
              </Text>
            </Box>
          </Box>

          {/* Rain sparkline with max probability */}
          <Box flexDirection="column" marginTop={1}>
            <Box gap={2}>
              <Text dimColor>Rain</Text>
              <Sparkline
                data={precipData}
                width={hours * 4}
                color={SEMANTIC_COLORS.alert.info}
              />
            </Box>
            <Box gap={1} marginTop={0}>
              <Text dimColor>Max:</Text>
              <Text color={SEMANTIC_COLORS.alert.info}>
                {Math.round(Math.max(...precipData))}%
              </Text>
            </Box>
          </Box>
        </Box>

        {/* Right column: Feels Like + Wind */}
        <Box flexDirection="column" flexGrow={1}>
          {/* Feels Like sparkline with range */}
          {showFeelsLike && (
            <Box flexDirection="column">
              <Box gap={2}>
                <Text dimColor>Feel</Text>
                <Sparkline
                  data={feelsLikeData}
                  width={hours * 4}
                  color={SEMANTIC_COLORS.temperature.neutral}
                />
              </Box>
              <Box gap={1} marginTop={0}>
                <Text dimColor>Range:</Text>
                <Text color={SEMANTIC_COLORS.temperature.neutral}>
                  {Math.round(Math.min(...feelsLikeData))}° to{' '}
                  {Math.round(Math.max(...feelsLikeData))}°
                </Text>
              </Box>
            </Box>
          )}

          {/* Wind sparkline with max speed */}
          <Box flexDirection="column" marginTop={showFeelsLike ? 1 : 0}>
            <Box gap={2}>
              <Text dimColor>Wind</Text>
              <WindSparkline data={windSpeedData} width={hours * 4} />
            </Box>
            <Box gap={1} marginTop={0}>
              <Text dimColor>Max:</Text>
              <Text color="gray">
                {Math.round(Math.max(...windSpeedData))} km/h
              </Text>
            </Box>
          </Box>

          {/* Wind Gusts sparkline - NEW */}
          {showGust && (
            <Box flexDirection="column" marginTop={1}>
              <Box gap={2}>
                <Text dimColor>Gust</Text>
                <Sparkline
                  data={windGustData}
                  width={hours * 4}
                  color={SEMANTIC_COLORS.alert.warning}
                />
              </Box>
              <Box gap={1} marginTop={0}>
                <Text dimColor>Max:</Text>
                <Text color={SEMANTIC_COLORS.alert.warning}>
                  {Math.round(Math.max(...windGustData))} km/h
                </Text>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
