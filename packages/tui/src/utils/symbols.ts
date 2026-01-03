/**
 * Unicode symbols and characters for terminal UI
 * Provides weather icons, sparklines, progress indicators, and animation characters
 */

export const SYMBOLS = {
  // Weather symbols
  sun: '☀',
  cloud: '☁',
  partlyCloudy: '⛅',
  rain: '🌧',
  snow: '❄',
  thunder: '⚡',
  wind: '💨',
  fog: '🌫',

  // Moon phases (0-7 corresponding to lunar cycle)
  moon: ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'] as const,

  // Sparkline characters (8 levels from lowest to highest)
  sparkline: ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'] as const,

  // Progress bar characters (4 levels from empty to full)
  progress: ['░', '▒', '▓', '█'] as const,

  // Trend indicators
  trendUp: '↑',
  trendDown: '↓',
  trendSteady: '→',

  // Compass directions (16-point rose)
  compass: {
    N: '↑',
    NNE: '↗',
    NE: '↗',
    ENE: '↗',
    E: '→',
    ESE: '↘',
    SE: '↘',
    SSE: '↘',
    S: '↓',
    SSW: '↙',
    SW: '↙',
    WSW: '↙',
    W: '←',
    WNW: '↖',
    NW: '↖',
    NNW: '↖',
  } as const,

  // Rain animation characters (varying line styles)
  rainDrops: ['│', '┃', '║', '╎', '╏', '┆', '┇', '┊', '┋'] as const,

  // Snow animation characters
  snowFlakes: ['❄', '❅', '❆', '*', '.', '·', '˙'] as const,

  // Cloud patterns for animation
  cloudChars: ['☁', '⛅'] as const,

  // Box drawing for gauges and decorations
  box: {
    horizontal: '─',
    vertical: '│',
    cross: '┼',
    teeUp: '┴',
    teeDown: '┬',
    teeLeft: '┤',
    teeRight: '├',
  } as const,

  // Miscellaneous
  dot: '•',
  circle: '○',
  circleFilled: '●',
  square: '□',
  squareFilled: '■',
  triangle: '△',
  triangleFilled: '▲',
} as const;

/**
 * Get moon phase emoji based on phase number (0-1)
 * 0 = New Moon, 0.25 = First Quarter, 0.5 = Full Moon, 0.75 = Last Quarter
 */
export function getMoonEmoji(phase: number): string {
  const index = Math.floor(phase * 8) % 8;
  return SYMBOLS.moon[index];
}

/**
 * Get compass arrow for wind direction
 */
export function getCompassArrow(direction: string): string {
  return SYMBOLS.compass[direction as keyof typeof SYMBOLS.compass] || '•';
}

/**
 * Get trend arrow based on change value
 */
export function getTrendArrow(change: number, threshold = 0.5): string {
  if (change > threshold) return SYMBOLS.trendUp;
  if (change < -threshold) return SYMBOLS.trendDown;
  return SYMBOLS.trendSteady;
}

/**
 * Moon phase names
 */
export const MOON_PHASE_NAMES = [
  'New Moon',
  'Waxing Crescent',
  'First Quarter',
  'Waxing Gibbous',
  'Full Moon',
  'Waning Gibbous',
  'Last Quarter',
  'Waning Crescent',
] as const;

/**
 * Get moon phase name from phase number (0-1)
 */
export function getMoonPhaseName(phase: number): string {
  const index = Math.floor(phase * 8) % 8;
  return MOON_PHASE_NAMES[index];
}
