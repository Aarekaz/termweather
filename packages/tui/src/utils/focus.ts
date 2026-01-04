/**
 * Focus styling utilities for panel focus indicators
 *
 * Provides consistent visual feedback for focused vs unfocused panels
 */

import type { FocusablePanel } from '../types/focus.js';

/**
 * Border style configuration for focus states
 */
export interface FocusStyleConfig {
  borderStyle: 'round' | 'double' | 'single' | 'bold';
  borderColor: string;
  bold?: boolean;
  dim?: boolean;
}

/**
 * Get border style configuration based on focus state
 *
 * Focused panels use double borders with cyan color for emphasis
 * Unfocused panels use round borders with gray color
 *
 * @param isFocused - Whether the panel currently has focus
 * @returns Style configuration object
 */
export function getFocusStyle(isFocused: boolean): FocusStyleConfig {
  if (isFocused) {
    return {
      borderStyle: 'double',
      borderColor: 'cyan',
      bold: true,
      dim: false,
    };
  }

  return {
    borderStyle: 'round',
    borderColor: 'gray',
    bold: false,
    dim: true,
  };
}

/**
 * Get border props suitable for Ink Box component
 *
 * Extracts only the properties that Ink's Box component accepts
 *
 * @param isFocused - Whether the panel currently has focus
 * @returns Object with borderStyle and borderColor properties
 */
export function getFocusBorderProps(isFocused: boolean) {
  const style = getFocusStyle(isFocused);
  return {
    borderStyle: style.borderStyle,
    borderColor: style.borderColor,
  };
}

/**
 * Determine if a panel should show focus indicator
 *
 * In the current implementation, all panels can potentially be focused
 * Future versions might have panels that cannot receive focus
 *
 * @param panel - Panel identifier
 * @returns Whether this panel can be focused
 */
export function canPanelBeFocused(panel: FocusablePanel): boolean {
  // All panels are focusable by default
  // This could be extended with per-panel configuration
  return true;
}

/**
 * Get focus indicator character/symbol
 *
 * Returns a visual indicator that could be shown next to focused panels
 * (Currently unused but available for future enhancements)
 *
 * @param isFocused - Whether the panel is focused
 * @returns Unicode arrow or empty string
 */
export function getFocusIndicator(isFocused: boolean): string {
  return isFocused ? '▸ ' : '';
}
