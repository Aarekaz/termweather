import React from 'react';
import { Box, Text } from 'ink';
import { SEMANTIC_COLORS } from '../utils/theme.js';
import cliPackage from '../../../cli/package.json';

const LOGO_LINES = [
  '  ╭╮  ╭╮   TERMWEATHER',
  '  ╰╯  ╰╯   Beautiful weather in your terminal',
];

const WEATHER_LINE = '      ☀️  ☁️  🌧  ❄️  🌩';

export function SplashScreen() {
  return (
    <Box
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      width="100%"
      height="100%"
    >
      <Box
        borderStyle="round"
        borderColor={SEMANTIC_COLORS.alert.info}
        paddingX={4}
        paddingY={1}
        flexDirection="column"
        alignItems="center"
        gap={1}
      >
        {LOGO_LINES.map((line) => (
          <Text key={line} color={SEMANTIC_COLORS.temperature.neutral}>
            {line}
          </Text>
        ))}

        <Text color={SEMANTIC_COLORS.alert.info}>{WEATHER_LINE}</Text>

        <Text dimColor>v{cliPackage.version}</Text>
      </Box>
    </Box>
  );
}
