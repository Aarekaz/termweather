import React from 'react';
import { Box, Text } from 'ink';
import { Modal } from './Modal.js';
import type { Breakpoint } from '../../hooks/useTerminalSize.js';

type View = 'dashboard' | 'forecast' | 'search';

export interface HelpModalProps {
  /** Whether the help modal is visible */
  visible: boolean;
  /** Callback when modal should be closed */
  onClose: () => void;
  /** Current view to show context-specific shortcuts */
  currentView: View;
  /** Terminal size breakpoint for responsive layout */
  breakpoint: Breakpoint;
}

interface Shortcut {
  key: string;
  description: string;
}

/**
 * Help modal displaying all keyboard shortcuts organized by category
 * Context-aware: shows different shortcuts based on current view
 */
export function HelpModal({ visible, onClose, currentView, breakpoint }: HelpModalProps) {
  // Navigation shortcuts
  const navigationShortcuts: Shortcut[] = [
    { key: 'Tab', description: 'Next view' },
    { key: 'Shift+Tab', description: 'Previous view' },
    { key: '1-3', description: 'Jump to specific view' },
    { key: '/', description: 'Open search/Add location' },
    { key: '←/→', description: 'Switch location (Dashboard)' },
  ];

  // Action shortcuts
  const actionShortcuts: Shortcut[] = [
    { key: 'r', description: 'Refresh weather data' },
    { key: 'a', description: 'Toggle animations' },
  ];

  // View-specific shortcuts
  const viewSpecificShortcuts: Record<View, Shortcut[]> = {
    dashboard: [
      { key: '←/→', description: 'Navigate between locations' },
    ],
    forecast: [
      { key: 'h', description: 'Show hourly forecast' },
      { key: 'w', description: 'Show weekly forecast' },
    ],
    search: [
      { key: '↑/↓', description: 'Navigate results' },
      { key: 'Enter', description: 'Select location' },
      { key: 's', description: 'Save location' },
      { key: 'd', description: 'Delete saved location' },
      { key: 'Esc', description: 'Cancel search' },
    ],
  };

  // System shortcuts
  const systemShortcuts: Shortcut[] = [
    { key: '?', description: 'Show this help' },
    { key: 'q', description: 'Quit application' },
    { key: 'Ctrl+C', description: 'Force quit' },
  ];

  const renderShortcutList = (shortcuts: Shortcut[]) => (
    <Box flexDirection="column" gap={0}>
      {shortcuts.map((shortcut, index) => (
        <Box key={index} gap={2}>
          <Box width={12}>
            <Text color="cyan">{shortcut.key}</Text>
          </Box>
          <Text>{shortcut.description}</Text>
        </Box>
      ))}
    </Box>
  );

  const renderCategory = (title: string, shortcuts: Shortcut[]) => (
    <Box flexDirection="column" marginBottom={1}>
      <Text bold color="yellow" marginBottom={0}>
        {title}
      </Text>
      {renderShortcutList(shortcuts)}
    </Box>
  );

  // Show simple warning on tiny screens
  if (breakpoint === 'tiny') {
    return (
      <Modal visible={visible} onClose={onClose} title="Help">
        <Box flexDirection="column" padding={1}>
          <Text color="yellow">Terminal too small for full help</Text>
          <Text dimColor marginTop={1}>Press q to quit • Resize for full UI</Text>
        </Box>
      </Modal>
    );
  }

  // Two-column layout on large screens, single column on small/medium
  const useTwoColumns = breakpoint === 'large' || breakpoint === 'xlarge';

  return (
    <Modal visible={visible} onClose={onClose} title="Keyboard Shortcuts">
      {useTwoColumns ? (
        <Box gap={4}>
          {/* Left column */}
          <Box flexDirection="column" flexGrow={1}>
            {renderCategory('Navigation', navigationShortcuts)}
            {renderCategory('Actions', actionShortcuts)}
          </Box>

          {/* Right column */}
          <Box flexDirection="column" flexGrow={1}>
            {renderCategory(
              `${currentView.charAt(0).toUpperCase() + currentView.slice(1)} View`,
              viewSpecificShortcuts[currentView]
            )}
            {renderCategory('System', systemShortcuts)}
          </Box>
        </Box>
      ) : (
        <Box flexDirection="column">
          {renderCategory('Navigation', navigationShortcuts)}
          {renderCategory('Actions', actionShortcuts)}
          {renderCategory(
            `${currentView.charAt(0).toUpperCase() + currentView.slice(1)} View`,
            viewSpecificShortcuts[currentView]
          )}
          {renderCategory('System', systemShortcuts)}
        </Box>
      )}
    </Modal>
  );
}
