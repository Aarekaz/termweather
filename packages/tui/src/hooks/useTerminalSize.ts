import { useStdout } from 'ink';

/**
 * Terminal size breakpoints
 * - Tiny: < 60 columns (show warning, minimal functionality)
 * - Small: 60-80 columns (abbreviated labels, reduced features)
 * - Medium: 80-120 columns (standard UI)
 * - Large: 120-160 columns (full UI)
 * - XLarge: > 160 columns (enhanced visualizations)
 */
export type Breakpoint = 'tiny' | 'small' | 'medium' | 'large' | 'xlarge';

/**
 * Terminal size information
 */
export interface TerminalSize {
  width: number;
  height: number;
  breakpoint: Breakpoint;
}

/**
 * Get breakpoint based on terminal width
 */
export function getBreakpoint(width: number): Breakpoint {
  if (width < 60) return 'tiny';
  if (width < 80) return 'small';
  if (width < 120) return 'medium';
  if (width < 160) return 'large';
  return 'xlarge';
}

/**
 * Hook to get current terminal size and breakpoint
 * Updates on terminal resize
 */
export function useTerminalSize(): TerminalSize {
  const { stdout } = useStdout();

  const width = stdout?.columns ?? 80;
  const height = stdout?.rows ?? 24;
  const breakpoint = getBreakpoint(width);

  return {
    width,
    height,
    breakpoint,
  };
}
