import React from 'react';
import { Box, Text } from 'ink';
import { useTerminalSize } from '../../hooks/useTerminalSize.js';
import { BORDER_DOUBLE } from '../../utils/theme.js';

export interface ModalProps {
  /** Whether the modal is visible */
  visible: boolean;
  /** Callback when modal should be closed */
  onClose: () => void;
  /** Modal title */
  title: string;
  /** Modal content */
  children: React.ReactNode;
}

/**
 * Reusable modal overlay component
 * Displays centered content with dimmed background effect
 */
export function Modal({ visible, onClose, title, children }: ModalProps) {
  if (!visible) {
    return null;
  }

  const { width, height, breakpoint } = useTerminalSize();

  // Responsive modal sizing
  const modalWidthPercent = breakpoint === 'small' ? 0.95 : breakpoint === 'medium' ? 0.9 : 0.8;
  const modalWidth = Math.floor(width * modalWidthPercent);
  const modalHeight = Math.floor(height * 0.8);

  return (
    <Box
      flexDirection="column"
      width={width}
      height={height}
      justifyContent="center"
      alignItems="center"
      position="absolute"
    >
      {/* Modal container */}
      <Box
        flexDirection="column"
        width={modalWidth}
        maxHeight={modalHeight}
        borderStyle="double"
        borderColor="cyan"
        paddingX={2}
        paddingY={1}
      >
        {/* Title */}
        <Box marginBottom={1}>
          <Text bold color="cyan">
            {BORDER_DOUBLE.horizontal.repeat(2)} {title.toUpperCase()}{' '}
            {BORDER_DOUBLE.horizontal.repeat(2)}
          </Text>
        </Box>

        {/* Content */}
        <Box flexDirection="column" flexGrow={1}>
          {children}
        </Box>

        {/* Footer hint */}
        <Box marginTop={1} justifyContent="center">
          <Text dimColor>Press ESC to close</Text>
        </Box>
      </Box>
    </Box>
  );
}
