import React, { useMemo } from 'react';
import { Box, Text } from 'ink';
import { SYMBOLS } from '../../utils/symbols.js';
import {
  useWeatherAnimation,
  createRecyclingUpdater,
  type AnimationConfig,
} from '../../hooks/useWeatherAnimation.js';

interface SnowEffectProps {
  /** Snow intensity */
  intensity: 'light' | 'medium' | 'heavy';
  /** Container width */
  width: number;
  /** Container height */
  height: number;
  /** Wind speed (affects horizontal drift) */
  windSpeed?: number;
  /** Enable/disable animation */
  enabled?: boolean;
}

/**
 * Snow animation effect
 * Falling snowflakes with gentle diagonal drift
 */
export function SnowEffect({
  intensity,
  width,
  height,
  windSpeed = 0,
  enabled = true,
}: SnowEffectProps) {
  const config: AnimationConfig = useMemo(
    () => ({
      enabled,
      fps: 10, // 10 FPS for gentle snow
      width,
      height,
      intensity,
    }),
    [enabled, width, height, intensity]
  );

  // Get snowflake character based on intensity
  const getChar = (intensity: string) => {
    const chars = SYMBOLS.snowFlakes;

    // Heavier snow uses more snowflake emojis, lighter uses dots
    if (intensity === 'heavy') {
      return chars[Math.floor(Math.random() * 3)]; // ❄ ❅ ❆
    } else if (intensity === 'medium') {
      return chars[Math.floor(Math.random() * 5)]; // ❄ ❅ ❆ * .
    } else {
      return chars[Math.floor(Math.random() * chars.length)]; // All chars
    }
  };

  // Get speed based on intensity and wind
  const getSpeed = (intensity: string) => {
    // Snow falls slower than rain
    const baseY = intensity === 'light' ? 0.5 : intensity === 'medium' ? 0.75 : 1;

    // Wind affects horizontal drift
    const baseX = windSpeed > 10 ? (Math.random() - 0.5) * 0.5 : 0;

    return { x: baseX, y: baseY };
  };

  // Particle count based on intensity
  const particleCount =
    intensity === 'light' ? 15 : intensity === 'medium' ? 25 : 40;

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
        <Text key={i} color="cyan">
          {row.join('')}
        </Text>
      ))}
    </Box>
  );
}
