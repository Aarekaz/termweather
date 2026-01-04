/**
 * First-run onboarding modal
 *
 * Guides new users through initial location setup with a two-step flow:
 * 1. Welcome screen with instructions
 * 2. Embedded search component for location selection
 */

import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { Modal } from './Modal.js';
import { Search } from '../Search.js';
import type { Breakpoint } from '../../hooks/useTerminalSize.js';
import type { Location } from '../../types/config.js';

export interface OnboardingModalProps {
  /** Whether the modal is visible */
  visible: boolean;
  /** Callback when onboarding is completed with a location or skipped */
  onComplete: (location: Location | null) => void;
  /** Terminal size breakpoint for responsive display */
  breakpoint: Breakpoint;
}

/**
 * Onboarding modal component
 *
 * Provides first-run experience for new users to set up their initial location.
 * Users can either select a location or skip to use defaults.
 */
export function OnboardingModal({ visible, onComplete, breakpoint }: OnboardingModalProps) {
  const [step, setStep] = useState<'welcome' | 'search'>('welcome');

  // Handle keyboard input on welcome screen
  useInput((input, key) => {
    if (step === 'welcome') {
      // Any key press continues to search (except ESC which is handled by Modal)
      if (!key.escape) {
        setStep('search');
      }
    }
  });

  const handleLocationSelect = (location: Location) => {
    onComplete(location);
  };

  const handleSkip = () => {
    onComplete(null);
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} onClose={handleSkip} title="Welcome to Weather TUI">
      {step === 'welcome' ? (
        <Box flexDirection="column" gap={1}>
          <Text>Welcome! Let's set up your first location.</Text>

          <Box marginTop={1} flexDirection="column">
            <Text color="cyan">How it works:</Text>
            <Text dimColor>  • Search for your city</Text>
            <Text dimColor>  • Use ↑/↓ to navigate results</Text>
            <Text dimColor>  • Press Enter to select</Text>
            <Text dimColor>  • Press [s] to save locations for later</Text>
            <Text dimColor>  • Press [/] anytime to add more locations</Text>
          </Box>

          <Box marginTop={2}>
            <Text color="green">Press any key to continue or ESC to skip</Text>
          </Box>
        </Box>
      ) : (
        <Box flexDirection="column">
          <Text dimColor marginBottom={1}>Search for your city:</Text>
          <Search
            onSelect={handleLocationSelect}
            onCancel={handleSkip}
            isEmbedded={true}
          />
        </Box>
      )}
    </Modal>
  );
}
