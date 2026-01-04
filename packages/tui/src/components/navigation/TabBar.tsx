import React from 'react';
import { Box, Text } from 'ink';
import { TABS } from '../../config/tabs.js';
import type { Breakpoint } from '../../hooks/useTerminalSize.js';

type View = 'dashboard' | 'forecast' | 'search';

export interface TabBarProps {
  /** Current active view */
  currentView: View;
  /** Callback when tab is changed (for future mouse support) */
  onTabChange: (view: View) => void;
  /** Terminal size breakpoint for responsive display */
  breakpoint: Breakpoint;
}

/**
 * Tab navigation bar component
 * Displays horizontal tabs with active tab highlighted and keyboard hints
 */
export function TabBar({ currentView, breakpoint }: TabBarProps) {
  // Don't show tab bar on tiny screens
  if (breakpoint === 'tiny') {
    return null;
  }

  // Use short labels on small screens
  const useShortLabel = breakpoint === 'small';

  return (
    <Box paddingX={1} paddingY={0} gap={1}>
      {TABS.map((tab, index) => {
        const isActive = tab.id === currentView;
        const label = useShortLabel ? tab.shortLabel : tab.label;

        return (
          <React.Fragment key={tab.id}>
            {/* Active tab indicator */}
            {isActive && <Text color="cyan">▸</Text>}

            {/* Tab label with shortcut hint */}
            <Box gap={1}>
              <Text dimColor>[{tab.numberKey}]</Text>
              <Text
                bold={isActive}
                color={isActive ? 'cyan' : 'white'}
                dimColor={!isActive}
              >
                {label}
              </Text>
            </Box>

            {/* Separator (not after last tab) */}
            {index < TABS.length - 1 && (
              <Text dimColor>│</Text>
            )}
          </React.Fragment>
        );
      })}

      {/* Navigation hint */}
      <Box marginLeft={2}>
        <Text dimColor>Tab to cycle</Text>
      </Box>
    </Box>
  );
}
