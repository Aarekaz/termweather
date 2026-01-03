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
      borderStyle="round"
      borderColor="gray"
      paddingX={2}
      justifyContent="space-between"
    >
      {/* Left: Navigation shortcuts */}
      <Box gap={1}>
        <Text dimColor>[d]</Text>
        <Text color={view === 'dashboard' ? 'cyan' : 'white'}>Dashboard</Text>
        <Text dimColor>[f]</Text>
        <Text color={view === 'forecast' ? 'cyan' : 'white'}>Forecast</Text>
        <Text dimColor>[/]</Text>
        <Text color={view === 'search' ? 'cyan' : 'white'}>Search</Text>
      </Box>

      {/* Right: Status indicators */}
      <Box gap={2}>
        <Box gap={1}>
          <Text dimColor>[a]</Text>
          <Text>Animations</Text>
        </Box>
        <Box gap={1}>
          <Text dimColor>[r]</Text>
          <Text>Refresh</Text>
        </Box>
        <Box gap={1}>
          <Text dimColor>[q]</Text>
          <Text>Quit</Text>
        </Box>
        {loading ? (
          <Text color="yellow">Updating...</Text>
        ) : lastUpdated ? (
          <Text dimColor>Updated {formatTimeAgo(lastUpdated)}</Text>
        ) : null}
      </Box>
    </Box>
  );
}
