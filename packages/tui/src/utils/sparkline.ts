/**
 * Sparkline generation utilities
 * Creates inline charts using Unicode block characters
 */

import { SYMBOLS } from './symbols.js';

/**
 * Generate a sparkline from data array
 * Maps data values to Unicode block characters (▁▂▃▄▅▆▇█)
 *
 * @param data Array of numeric values to visualize
 * @param width Target width in characters
 * @param characters Custom characters to use (defaults to sparkline blocks)
 * @returns Sparkline string
 */
export function generateSparkline(
  data: number[],
  width: number,
  characters: readonly string[] = SYMBOLS.sparkline
): string {
  if (data.length === 0 || width <= 0) return '';

  // Find min and max for normalization
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1; // Avoid division by zero

  // Sample data to fit target width
  const sampled = sampleData(data, width);

  // Map each value to a character
  return sampled
    .map((value) => {
      const normalized = (value - min) / range; // 0 to 1
      const index = Math.floor(normalized * (characters.length - 1));
      return characters[index];
    })
    .join('');
}

/**
 * Sample data array to fit target width
 * Uses averaging when downsampling
 */
function sampleData(data: number[], targetWidth: number): number[] {
  if (data.length <= targetWidth) {
    return data;
  }

  const sampled: number[] = [];
  const bucketSize = data.length / targetWidth;

  for (let i = 0; i < targetWidth; i++) {
    const start = Math.floor(i * bucketSize);
    const end = Math.floor((i + 1) * bucketSize);
    const bucket = data.slice(start, end);

    // Average values in bucket
    const avg = bucket.reduce((sum, val) => sum + val, 0) / bucket.length;
    sampled.push(avg);
  }

  return sampled;
}

/**
 * Determine trend direction from data series
 * Compares first and last thirds of the data
 *
 * @param data Array of numeric values
 * @returns 'up', 'down', or 'steady'
 */
export function getTrendDirection(data: number[]): 'up' | 'down' | 'steady' {
  if (data.length < 3) return 'steady';

  const thirdSize = Math.floor(data.length / 3);

  // Average first third
  const firstThird = data.slice(0, thirdSize);
  const firstAvg =
    firstThird.reduce((sum, val) => sum + val, 0) / firstThird.length;

  // Average last third
  const lastThird = data.slice(-thirdSize);
  const lastAvg = lastThird.reduce((sum, val) => sum + val, 0) / lastThird.length;

  const change = lastAvg - firstAvg;
  const threshold = (Math.max(...data) - Math.min(...data)) * 0.1; // 10% of range

  if (change > threshold) return 'up';
  if (change < -threshold) return 'down';
  return 'steady';
}

/**
 * Calculate percentage change from data series
 *
 * @param data Array of numeric values
 * @returns Percentage change from first to last value
 */
export function calculateChange(data: number[]): number {
  if (data.length < 2) return 0;

  const first = data[0];
  const last = data[data.length - 1];

  if (first === 0) return 0;

  return ((last - first) / Math.abs(first)) * 100;
}

/**
 * Generate a simple bar chart
 * Similar to sparkline but with full-height bars
 *
 * @param data Array of numeric values
 * @param width Target width in characters
 * @param maxHeight Maximum height in lines
 * @returns Array of strings (one per line)
 */
export function generateBarChart(
  data: number[],
  width: number,
  maxHeight: number
): string[] {
  if (data.length === 0 || width <= 0 || maxHeight <= 0) {
    return [];
  }

  const sampled = sampleData(data, width);
  const min = Math.min(...sampled);
  const max = Math.max(...sampled);
  const range = max - min || 1;

  // Create 2D grid
  const grid: string[][] = Array(maxHeight)
    .fill(null)
    .map(() => Array(width).fill(' '));

  // Fill bars from bottom up
  sampled.forEach((value, col) => {
    const normalized = (value - min) / range;
    const barHeight = Math.ceil(normalized * maxHeight);

    for (let row = 0; row < barHeight; row++) {
      grid[maxHeight - 1 - row][col] = '█';
    }
  });

  // Convert grid to strings
  return grid.map((row) => row.join(''));
}
