import { useStdout } from 'ink';

/**
 * Terminal size breakpoints
 */
export type Breakpoint = 'small' | 'medium' | 'large';

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
 * - Small: < 80 columns (single column layout)
 * - Medium: 80-120 columns (two column layout)
 * - Large: > 120 columns (full dashboard)
 */
export function getBreakpoint(width: number): Breakpoint {
  if (width < 80) return 'small';
  if (width < 120) return 'medium';
  return 'large';
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
