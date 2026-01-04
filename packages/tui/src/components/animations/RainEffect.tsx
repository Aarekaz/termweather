import React, { useMemo } from 'react';
import { Box, Text } from 'ink';
import { SYMBOLS } from '../../utils/symbols.js';
import {
  useWeatherAnimation,
  createRecyclingUpdater,
  type AnimationConfig,
} from '../../hooks/useWeatherAnimation.js';

interface RainEffectProps {
  /** Rain intensity */
  intensity: 'light' | 'medium' | 'heavy';
  /** Container width */
  width: number;
  /** Container height */
  height: number;
  /** Enable/disable animation */
  enabled?: boolean;
}

/**
 * Rain animation effect
 * Falling rain drops with varying speeds for depth perception
 */
export function RainEffect({
  intensity,
  width,
  height,
  enabled = true,
}: RainEffectProps) {
  const config: AnimationConfig = useMemo(
    () => ({
      enabled,
      fps: 12, // 12 FPS for smooth rain
      width,
      height,
      intensity,
    }),
    [enabled, width, height, intensity]
  );

  // Get character based on intensity
  const getChar = (intensity: string) => {
    const chars = SYMBOLS.rainDrops;
    const index = Math.floor(Math.random() * chars.length);
    return chars[index];
  };

  // Get speed based on intensity
  const getSpeed = (intensity: string) => {
    switch (intensity) {
      case 'light':
        return { x: 0, y: 1 };
      case 'medium':
        return { x: 0, y: Math.random() > 0.5 ? 1 : 2 };
      case 'heavy':
        return { x: 0, y: 2 };
      default:
        return { x: 0, y: 1 };
    }
  };

  // Particle count based on intensity
  const particleCount =
    intensity === 'light' ? 20 : intensity === 'medium' ? 35 : 50;

  const updateFn = useMemo(
    () => createRecyclingUpdater(getChar, getSpeed),
    []
  );

  const frame = useWeatherAnimation(config, updateFn, particleCount);

  if (!frame || !enabled) {
    return null;
  }

  // Create 2D grid for rendering
  const grid: string[][] = Array(height)
    .fill(null)
    .map(() => Array(width).fill(' '));

  // Place particles on grid
  frame.particles.forEach((particle) => {
    const x = Math.floor(particle.x);
    const y = Math.floor(particle.y);

    if (x >= 0 && x < width && y >= 0 && y < height) {
      grid[y][x] = particle.char;
    }
  });

  return (
    <Box
      flexDirection="column"
      position="absolute"
      width={width}
      height={height}
    >
      {grid.map((row, i) => (
        <Text key={i} color="blue">
          {row.join('')}
        </Text>
      ))}
    </Box>
  );
}
