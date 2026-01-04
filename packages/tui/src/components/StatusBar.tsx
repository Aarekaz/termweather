import React from 'react';
import { Box, Text } from 'ink';
import { formatTimeAgo } from '../utils/terminal.js';
import type { Breakpoint } from '../hooks/useTerminalSize.js';

interface StatusBarProps {
  view: 'dashboard' | 'forecast' | 'search';
  lastUpdated: Date | null;
  loading?: boolean;
  breakpoint: Breakpoint;
}

interface Shortcut {
  key: string;
  label: string;
}

export function StatusBar({ view, lastUpdated, loading, breakpoint }: StatusBarProps) {
  // Context-specific shortcuts per view
  const viewShortcuts: Record<string, Shortcut[]> = {
    dashboard: [{ key: '←/→', label: 'Location' }],
    forecast: [{ key: 'h/w', label: 'Hourly/Weekly' }],
    search: [
      { key: '↑/↓', label: 'Navigate' },
      { key: 'Enter', label: 'Select' },
    ],
  };

  // Global shortcuts (always available)
  const globalShortcuts: Shortcut[] = [
    { key: 'r', label: 'Refresh' },
    { key: '?', label: 'Help' },
    { key: 'q', label: 'Quit' },
  ];

  // Responsive: show fewer shortcuts on small/tiny screens
  const shortcutsToShow = breakpoint === 'tiny' || breakpoint === 'small'
    ? globalShortcuts.slice(1) // Only ? and q on small screens
    : globalShortcuts;

  const currentViewShortcuts = viewShortcuts[view] || [];

  return (
    <Box
      borderStyle="round"
      borderColor="gray"
      paddingX={2}
      justifyContent="space-between"
    >
      {/* Left: Context-specific + global shortcuts */}
      <Box gap={2}>
        {/* View-specific shortcuts */}
        {currentViewShortcuts.map((shortcut, index) => (
          <Box key={index} gap={1}>
            <Text dimColor>[{shortcut.key}]</Text>
            <Text>{shortcut.label}</Text>
          </Box>
        ))}

        {/* Separator if we have both view and global shortcuts */}
        {currentViewShortcuts.length > 0 && shortcutsToShow.length > 0 && (
          <Text dimColor>•</Text>
        )}

        {/* Global shortcuts */}
        {shortcutsToShow.map((shortcut, index) => (
          <Box key={index} gap={1}>
            <Text dimColor>{shortcut.key}</Text>
            <Text>{shortcut.label}</Text>
          </Box>
        ))}
      </Box>

      {/* Right: Status indicators */}
      <Box gap={2}>
        {loading ? (
          <Text color="yellow">Updating...</Text>
        ) : lastUpdated ? (
          <Text dimColor>Updated {formatTimeAgo(lastUpdated)}</Text>
        ) : null}
      </Box>
    </Box>
  );
}
