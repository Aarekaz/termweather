/**
 * Theme system for Weather Station TUI
 * Defines color palette, border styles, and visual constants
 */

export const THEME = {
  // Primary UI colors
  header: 'cyanBright',
  accent: 'cyan',

  // Temperature scale - color-coded for quick scanning
  temp: {
    freezing: 'blueBright',    // < 0°C
    cold: 'blue',              // 0-10°C
    cool: 'cyan',              // 10-20°C
    mild: 'green',             // 20-25°C
    warm: 'yellow',            // 25-30°C
    hot: 'red',                // 30-35°C
    extreme: 'redBright',      // > 35°C
  },

  // Weather condition colors
  condition: {
    clear: 'yellow',
    cloudy: 'gray',
    rain: 'blue',
    snow: 'cyan',
    storm: 'magenta',
  },

  // Alert severity levels
  alert: {
    low: 'green',
    moderate: 'yellow',
    high: 'magenta',
    severe: 'red',
    extreme: 'redBright',
  },

  // UI element colors
  border: 'gray',
  borderEmphasis: 'cyan',
  dimText: 'gray',
  label: 'white',
  value: 'whiteBright',
} as const;

// Semantic colors for consistent UI meaning (small palette)
export const SEMANTIC_COLORS = {
  temperature: {
    cold: 'blueBright',
    neutral: 'white',
    warm: 'yellow',
    hot: 'red',
  },
  alert: {
    info: 'cyan',
    warning: 'yellow',
    danger: 'red',
    severe: 'redBright',
  },
  band: {
    background: 'blackBright',
    text: 'white',
  },
} as const;

// Heavy industrial borders for main panels
export const BORDER_HEAVY = {
  topLeft: '┏',
  topRight: '┓',
  bottomLeft: '┗',
  bottomRight: '┛',
  horizontal: '━',
  vertical: '┃',
} as const;

// Medium borders for sub-panels
export const BORDER_MEDIUM = {
  topLeft: '┌',
  topRight: '┐',
  bottomLeft: '└',
  bottomRight: '┘',
  horizontal: '─',
  vertical: '│',
} as const;

// Double borders for emphasis
export const BORDER_DOUBLE = {
  topLeft: '╔',
  topRight: '╗',
  bottomLeft: '╚',
  bottomRight: '╝',
  horizontal: '═',
  vertical: '║',
} as const;

// Round borders (from original design, kept for compatibility)
export const BORDER_ROUND = {
  topLeft: '╭',
  topRight: '╮',
  bottomLeft: '╰',
  bottomRight: '╯',
  horizontal: '─',
  vertical: '│',
} as const;

/**
 * Helper to create a border string
 */
export function createBorder(
  borderStyle: typeof BORDER_HEAVY | typeof BORDER_MEDIUM | typeof BORDER_DOUBLE | typeof BORDER_ROUND,
  width: number,
  position: 'top' | 'bottom'
): string {
  const { horizontal, topLeft, topRight, bottomLeft, bottomRight } = borderStyle;

  if (position === 'top') {
    return topLeft + horizontal.repeat(width - 2) + topRight;
  } else {
    return bottomLeft + horizontal.repeat(width - 2) + bottomRight;
  }
}

/**
 * Get color for temperature value
 */
export function getTemperatureColor(temp: number): string {
  if (temp < 8) return SEMANTIC_COLORS.temperature.cold;
  if (temp < 22) return SEMANTIC_COLORS.temperature.neutral;
  if (temp < 30) return SEMANTIC_COLORS.temperature.warm;
  return SEMANTIC_COLORS.temperature.hot;
}

/**
 * Visual hierarchy colors for reducing cyan overuse
 */
export const VISUAL_HIERARCHY = {
  // Headers & emphasis
  primary: 'cyan',
  primaryBright: 'cyanBright',

  // Data values
  dataValue: 'white',
  dataValueEmphasis: 'whiteBright',

  // Labels & secondary
  label: 'gray',
  labelDim: 'gray',

  // Borders
  borderPrimary: 'cyan', // Status bar, hourly forecast
  borderSecondary: 'gray', // Metrics bar, bottom section
} as const;
