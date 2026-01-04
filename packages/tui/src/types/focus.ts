/**
 * Focus system types for interactive panel navigation
 *
 * This provides infrastructure for future panel-to-panel navigation
 * using arrow keys or Tab/Shift+Tab when not navigating between views.
 */

/**
 * Identifiers for focusable panels in the weather dashboard
 */
export type FocusablePanel =
  | 'current-conditions'
  | 'hourly-forecast'
  | 'metrics-grid'
  | 'astronomy'
  | 'atmospheric'
  | 'bottom-section';

/**
 * Focus state for the application
 */
export interface FocusState {
  /** Currently active/focused panel (null = no panel focused) */
  activePanel: FocusablePanel | null;
  /** Set of panels that can receive focus */
  focusedPanels: Set<FocusablePanel>;
}

/**
 * Focus behavior configuration for a panel
 */
export interface FocusBehavior {
  /** Can this panel receive focus? */
  canFocus: boolean;
  /** Show visual focus indicator when active */
  showFocusIndicator: boolean;
  /** Next panel when pressing Tab (within dashboard) */
  nextPanel?: FocusablePanel;
  /** Previous panel when pressing Shift+Tab (within dashboard) */
  prevPanel?: FocusablePanel;
}

/**
 * Focus navigation map defining panel traversal order
 * This would be used to implement keyboard navigation between panels
 */
export interface FocusNavigationMap {
  [key: string]: {
    next: FocusablePanel | null;
    prev: FocusablePanel | null;
    up?: FocusablePanel | null;
    down?: FocusablePanel | null;
    left?: FocusablePanel | null;
    right?: FocusablePanel | null;
  };
}

/**
 * Example navigation map (for future implementation)
 *
 * This defines how focus moves between panels:
 * - Tab/Shift+Tab: next/prev in linear order
 * - Arrow keys: spatial navigation
 */
export const DEFAULT_FOCUS_NAVIGATION: FocusNavigationMap = {
  'current-conditions': {
    next: 'hourly-forecast',
    prev: null,
    down: 'hourly-forecast',
  },
  'hourly-forecast': {
    next: 'atmospheric',
    prev: 'current-conditions',
    up: 'current-conditions',
    down: 'atmospheric',
  },
  'atmospheric': {
    next: 'astronomy',
    prev: 'hourly-forecast',
    up: 'hourly-forecast',
    right: 'astronomy',
  },
  'astronomy': {
    next: null,
    prev: 'atmospheric',
    up: 'hourly-forecast',
    left: 'atmospheric',
  },
};
