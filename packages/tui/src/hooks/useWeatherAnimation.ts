import { useState, useEffect, useCallback } from 'react';

/**
 * Particle representing an animated element (raindrop, snowflake, cloud)
 */
export interface Particle {
  id: number;
  x: number;
  y: number;
  char: string;
  speedY?: number; // Vertical speed
  speedX?: number; // Horizontal speed (for wind, clouds)
}

/**
 * Configuration for weather animation
 */
export interface AnimationConfig {
  enabled: boolean;
  fps: number; // Frames per second (10-15 recommended for terminals)
  width: number; // Container width
  height: number; // Container height
  intensity: 'light' | 'medium' | 'heavy';
}

/**
 * Animation frame containing current particle positions
 */
export interface AnimationFrame {
  particles: Particle[];
  timestamp: number;
}

/**
 * Weather animation hook
 * Manages frame-by-frame animation state for weather effects
 *
 * @param config Animation configuration
 * @param updateFn Custom update function for particle physics
 * @param particleCount Number of particles to maintain
 * @returns Current animation frame
 */
export function useWeatherAnimation(
  config: AnimationConfig,
  updateFn: (particles: Particle[], config: AnimationConfig) => Particle[],
  particleCount: number
): AnimationFrame | null {
  const [frame, setFrame] = useState<AnimationFrame | null>(null);

  // Initialize particles
  const initializeParticles = useCallback(
    (count: number): Particle[] => {
      return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.floor(Math.random() * config.width),
        y: Math.floor(Math.random() * config.height),
        char: '',
        speedY: 1,
        speedX: 0,
      }));
    },
    [config.width, config.height]
  );

  useEffect(() => {
    if (!config.enabled || config.width <= 0 || config.height <= 0) {
      setFrame(null);
      return;
    }

    // Initialize particles on mount or config change
    let particles = initializeParticles(particleCount);

    const interval = 1000 / config.fps;
    const timer = setInterval(() => {
      // Update particles using custom update function
      particles = updateFn(particles, config);

      setFrame({
        particles,
        timestamp: Date.now(),
      });
    }, interval);

    return () => clearInterval(timer);
  }, [config, updateFn, particleCount, initializeParticles]);

  return frame;
}

/**
 * Create a recycling particle updater
 * Particles that exit bottom/side are recycled to top/opposite side
 */
export function createRecyclingUpdater(
  getChar: (intensity: string) => string,
  getSpeed: (intensity: string) => { x: number; y: number }
): (particles: Particle[], config: AnimationConfig) => Particle[] {
  return (particles, config) => {
    return particles.map((particle) => {
      const { x, y } = getSpeed(config.intensity);

      let newX = particle.x + (particle.speedX ?? x);
      let newY = particle.y + (particle.speedY ?? y);

      // Recycle particles that exit bounds
      if (newY >= config.height) {
        newY = 0;
        newX = Math.floor(Math.random() * config.width);
      }

      if (newX >= config.width) {
        newX = 0;
      } else if (newX < 0) {
        newX = config.width - 1;
      }

      return {
        ...particle,
        x: newX,
        y: newY,
        char: getChar(config.intensity),
        speedY: y,
        speedX: x,
      };
    });
  };
}
