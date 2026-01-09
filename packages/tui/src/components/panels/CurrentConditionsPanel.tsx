import React from 'react';
import { Box, Text } from 'ink';
import type { WeatherData } from '@weather/core';
import { formatTemperature, getConditionDisplay } from '@weather/core';
import { getConditionEmoji, getTempColor } from '../../utils/terminal.js';
import { BORDER_HEAVY, SEMANTIC_COLORS } from '../../utils/theme.js';
import { Sparkline } from '../visualizations/Sparkline.js';
import { WeatherEffect } from '../animations/WeatherEffect.js';

interface CurrentConditionsPanelProps {
  /** Complete weather data */
  data: WeatherData;
  /** Show animated weather effect background */
  showAnimation?: boolean;
}

/**
 * Current conditions panel
 * Large temperature display with weather animation background
 */
export function CurrentConditionsPanel({
  data,
  showAnimation = true,
}: CurrentConditionsPanelProps) {
  const { current, hourly } = data;
  const emoji = getConditionEmoji(current.condition);
  const condition = getConditionDisplay(current.condition);
  const tempColor = getTempColor(current.temperature);

  // Extract 24h temperature data for sparkline
  const tempData = hourly.slice(0, 24).map((h) => h.temperature);

  // Panel dimensions
  const panelWidth = 35;
  const panelHeight = 12;

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor={SEMANTIC_COLORS.temperature.neutral}
      paddingX={2}
      paddingY={1}
      width={panelWidth}
      height={panelHeight}
    >
      {/* Title */}
      <Box
        marginBottom={1}
        paddingX={1}
        width="100%"
        backgroundColor={SEMANTIC_COLORS.band.background}
      >
        <Text bold color={SEMANTIC_COLORS.band.text}>
          {BORDER_HEAVY.horizontal.repeat(2)} Current Conditions{' '}
          {BORDER_HEAVY.horizontal.repeat(2)}
        </Text>
      </Box>

      {/* Weather animation background (if enabled) */}
      {showAnimation && (
        <Box position="relative">
          <WeatherEffect
            condition={current.condition}
            precipitation={current.precipitationProbability || 0}
            cloudCover={current.cloudCover}
            windSpeed={current.windSpeed}
            width={panelWidth - 4}
            height={panelHeight - 6}
            enabled={showAnimation}
          />
        </Box>
      )}

      {/* Main temperature display */}
      <Box flexDirection="column" alignItems="center" gap={0}>
        <Box gap={1}>
          <Text bold color={tempColor} fontSize={20}>
            {formatTemperature(current.temperature, 'C')}
          </Text>
          <Text>{emoji}</Text>
          <Text bold>{condition}</Text>
        </Box>

        <Text dimColor>
          Feels like {formatTemperature(current.feelsLike, 'C')}
        </Text>
      </Box>

      {/* 24h temperature trend */}
      <Box flexDirection="column" marginTop={1} alignItems="center">
        <Text dimColor>24h Trend</Text>
        <Sparkline data={tempData} width={28} color={tempColor} showTrend />
      </Box>
    </Box>
  );
}
