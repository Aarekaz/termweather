/**
 * Easing functions for natural motion
 * Based on https://easings.net/
 *
 * Easing functions map linear progress (0-1) to non-linear progress
 * This creates acceleration/deceleration effects for natural feel
 */

export type EasingFunction = (t: number) => number;

/**
 * Ease-out functions: Quick start, slow end
 * Best for particles entering scene - they decelerate naturally
 */
export const easeOutQuad: EasingFunction = (t) => 1 - (1 - t) * (1 - t);

export const easeOutCubic: EasingFunction = (t) => 1 - Math.pow(1 - t, 3);

export const easeOutQuart: EasingFunction = (t) => 1 - Math.pow(1 - t, 4);

/**
 * Ease-in functions: Slow start, quick end
 * Good for particles exiting scene
 */
export const easeInQuad: EasingFunction = (t) => t * t;

export const easeInCubic: EasingFunction = (t) => t * t * t;

/**
 * Ease-in-out: Smooth acceleration and deceleration
 * Most natural for complete animations
 */
export const easeInOutQuad: EasingFunction = (t) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

export const easeInOutCubic: EasingFunction = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/**
 * Linear (no easing) - for comparison
 */
export const linear: EasingFunction = (t) => t;

/**
 * Ease-out-back: Slight overshoot effect
 * Creates bouncy, playful motion
 */
export const easeOutBack: EasingFunction = (t) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

/**
 * Apply easing to a value transitioning from start to end
 *
 * @param progress Current progress (0-1)
 * @param start Starting value
 * @param end Ending value
 * @param easingFn Easing function to apply
 * @returns Eased value between start and end
 */
export function applyEasing(
  progress: number,
  start: number,
  end: number,
  easingFn: EasingFunction = easeOutQuad
): number {
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const eased = easingFn(clampedProgress);
  return start + (end - start) * eased;
}

/**
 * Create an eased interpolator for smooth transitions
 *
 * @param startValue Initial value
 * @param endValue Target value
 * @param duration Duration in milliseconds
 * @param easingFn Easing function
 * @returns Function that returns current value based on elapsed time
 */
export function createEasedInterpolator(
  startValue: number,
  endValue: number,
  duration: number,
  easingFn: EasingFunction = easeOutQuad
): (elapsedMs: number) => number {
  return (elapsedMs: number) => {
    const progress = Math.min(1, elapsedMs / duration);
    return applyEasing(progress, startValue, endValue, easingFn);
  };
}
