/**
 * Tab configuration for navigation system
 * Defines all available views and their shortcuts
 */

type View = 'dashboard' | 'forecast' | 'search';

export interface TabConfig {
  /** Unique view identifier */
  id: View;
  /** Full label for display on large screens */
  label: string;
  /** Abbreviated label for small screens */
  shortLabel: string;
  /** Number key shortcut (1-3) */
  numberKey: string;
  /** Legacy character shortcut for backward compatibility */
  legacyKey: string;
}

/**
 * All available tabs in navigation order
 */
export const TABS: TabConfig[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    shortLabel: 'Dash',
    numberKey: '1',
    legacyKey: 'd',
  },
  {
    id: 'forecast',
    label: 'Forecast',
    shortLabel: 'Fcst',
    numberKey: '2',
    legacyKey: 'f',
  },
  {
    id: 'search',
    label: 'Search',
    shortLabel: 'Find',
    numberKey: '3',
    legacyKey: '/',
  },
];

/**
 * Get the index of a view in the tabs array
 */
export function getTabIndex(view: View): number {
  return TABS.findIndex((tab) => tab.id === view);
}

/**
 * Get the next tab in cycling order
 */
export function getNextTab(currentView: View): View {
  const currentIndex = getTabIndex(currentView);
  const nextIndex = (currentIndex + 1) % TABS.length;
  return TABS[nextIndex].id;
}

/**
 * Get the previous tab in cycling order
 */
export function getPreviousTab(currentView: View): View {
  const currentIndex = getTabIndex(currentView);
  const prevIndex = currentIndex === 0 ? TABS.length - 1 : currentIndex - 1;
  return TABS[prevIndex].id;
}

/**
 * Get tab by number key (1-3)
 */
export function getTabByNumber(numberKey: string): View | null {
  const tab = TABS.find((t) => t.numberKey === numberKey);
  return tab ? tab.id : null;
}
