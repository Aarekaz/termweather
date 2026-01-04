import React from 'react';
import { Box, Text } from 'ink';

/**
 * Warning component shown when terminal is too small
 * Displayed when terminal width < 60 columns
 */
export function TinyScreenWarning() {
  return (
    <Box
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      padding={2}
      height="100%"
    >
      <Text bold color="yellow">
        ⚠ Terminal Too Small
      </Text>
      <Box marginTop={1}>
        <Text dimColor>Please resize your terminal to at least 60 columns wide</Text>
      </Box>
      <Box marginTop={2} gap={2}>
        <Box gap={1}>
          <Text dimColor>[q]</Text>
          <Text>Quit</Text>
        </Box>
        <Box gap={1}>
          <Text dimColor>[?]</Text>
          <Text>Help</Text>
        </Box>
      </Box>
    </Box>
  );
}
