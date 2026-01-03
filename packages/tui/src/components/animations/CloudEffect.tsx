import React, { useMemo } from 'react';
import { Box, Text } from 'ink';
import { SYMBOLS } from '../../utils/symbols.js';
import {
  useWeatherAnimation,
  createRecyclingUpdater,
  type AnimationConfig,
} from '../../hooks/useWeatherAnimation.js';

interface CloudEffectProps {
  /** Cloud coverage percentage (0-100) */
  coverage: number;
  /** Container width */
  width: number;
  /** Container height (clouds appear in top portion) */
  height: number;
  /** Enable/disable animation */
  enabled?: boolean;
}

/**
 * Cloud animation effect
 * Horizontally scrolling clouds with parallax layers
 */
export function CloudEffect({
  coverage,
  width,
  height,
  enabled = true,
}: CloudEffectProps) {
  const config: AnimationConfig = useMemo(
    () => ({
      enabled,
      fps: 8, // 8 FPS for slow cloud movement
      width,
      height: Math.min(height, 3), // Clouds only in top 3 rows
      intensity: coverage > 66 ? 'heavy' : coverage > 33 ? 'medium' : 'light',
    }),
    [enabled, width, height, coverage]
  );

  // Get cloud character
  const getChar = () => {
    const chars = SYMBOLS.cloudChars;
    return chars[Math.floor(Math.random() * chars.length)];
  };

  // Get speed (horizontal scrolling with parallax)
  const getSpeed = () => {
    // Multiple layers with different speeds for parallax effect
    const speeds = [0.25, 0.5, 0.75];
    return {
      x: -speeds[Math.floor(Math.random() * speeds.length)], // Move left
      y: 0, // No vertical movement
    };
  };

  // Particle count based on coverage
  const particleCount = Math.floor((coverage / 100) * 15);

  const updateFn = useMemo(
    () => createRecyclingUpdater(getChar, getSpeed),
    []
  );

  const frame = useWeatherAnimation(config, updateFn, particleCount);

  if (!frame || !enabled || particleCount === 0) {
    return null;
  }

  // Create 2D grid for rendering
  const cloudHeight = config.height;
  const grid: string[][] = Array(cloudHeight)
    .fill(null)
    .map(() => Array(width).fill(' '));

  // Place particles on grid
  frame.particles.forEach((particle) => {
    const x = Math.floor(particle.x);
    const y = Math.floor(particle.y);

    if (x >= 0 && x < width && y >= 0 && y < cloudHeight) {
      grid[y][x] = particle.char;
    }
  });

  return (
    <Box
      flexDirection="column"
      position="absolute"
      width={width}
      height={cloudHeight}
    >
      {grid.map((row, i) => (
        <Text key={i} color="gray" dimColor>
          {row.join('')}
        </Text>
      ))}
    </Box>
  );
}
