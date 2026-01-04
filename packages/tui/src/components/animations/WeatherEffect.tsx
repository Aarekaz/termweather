import React from 'react';
import type { WeatherCondition } from '@weather/core';
import { RainEffect } from './RainEffect.js';
import { SnowEffect } from './SnowEffect.js';
import { CloudEffect } from './CloudEffect.js';

interface WeatherEffectProps {
  /** Current weather condition */
  condition: WeatherCondition;
  /** Precipitation probability (0-100) */
  precipitation?: number;
  /** Cloud cover percentage (0-100) */
  cloudCover?: number;
  /** Wind speed (for snow drift) */
  windSpeed?: number;
  /** Container width */
  width: number;
  /** Container height */
  height: number;
  /** Enable/disable animations */
  enabled?: boolean;
}

/**
 * Weather effect orchestrator
 * Conditionally renders appropriate weather animation based on conditions
 */
export function WeatherEffect({
  condition,
  precipitation = 0,
  cloudCover = 0,
  windSpeed = 0,
  width,
  height,
  enabled = true,
}: WeatherEffectProps) {
  if (!enabled || width <= 0 || height <= 0) {
    return null;
  }

  // Determine intensity based on precipitation probability
  const getIntensity = (
    precip: number
  ): 'light' | 'medium' | 'heavy' => {
    if (precip < 30) return 'light';
    if (precip < 70) return 'medium';
    return 'heavy';
  };

  const intensity = getIntensity(precipitation);

  // Render appropriate effect based on condition
  switch (condition) {
    case 'rain':
    case 'drizzle':
      return (
        <RainEffect
          intensity={condition === 'drizzle' ? 'light' : intensity}
          width={width}
          height={height}
          enabled={enabled}
        />
      );

    case 'snow':
      return (
        <SnowEffect
          intensity={intensity}
          width={width}
          height={height}
          windSpeed={windSpeed}
          enabled={enabled}
        />
      );

    case 'cloudy':
    case 'partly-cloudy':
    case 'fog':
      return (
        <CloudEffect
          coverage={cloudCover}
          width={width}
          height={height}
          enabled={enabled}
        />
      );

    case 'thunderstorm':
      // For thunderstorms, show heavy rain
      return (
        <RainEffect
          intensity="heavy"
          width={width}
          height={height}
          enabled={enabled}
        />
      );

    case 'clear':
    default:
      // No animation for clear weather
      return null;
  }
}
