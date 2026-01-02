import React from 'react';
import { Box, Text } from 'ink';
import { formatTimeAgo } from '../utils/terminal.js';

interface StatusBarProps {
  view: 'dashboard' | 'forecast' | 'search';
  lastUpdated: Date | null;
  loading?: boolean;
}

export function StatusBar({ view, lastUpdated, loading }: StatusBarProps) {
  const viewLabels = {
    dashboard: 'Dashboard',
    forecast: 'Forecast',
    search: 'Search',
  };

  return (
    <Box
      borderStyle="single"
      borderColor="gray"
      paddingX={1}
      justifyContent="space-between"
    >
      <Box>
        <Text dimColor>[d]</Text>
        <Text color={view === 'dashboard' ? 'cyan' : undefined}> Dashboard </Text>
        <Text dimColor>[f]</Text>
        <Text color={view === 'forecast' ? 'cyan' : undefined}> Forecast </Text>
        <Text dimColor>[/]</Text>
        <Text color={view === 'search' ? 'cyan' : undefined}> Search </Text>
        <Text dimColor>[q] Quit</Text>
      </Box>
      <Box>
        {loading ? (
          <Text color="yellow">Updating...</Text>
        ) : lastUpdated ? (
          <Text dimColor>Updated {formatTimeAgo(lastUpdated)}</Text>
        ) : null}
      </Box>
    </Box>
  );
}
