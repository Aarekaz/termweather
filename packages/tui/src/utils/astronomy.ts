/**
 * Astronomical calculations
 * Moon phase, sun position, and related utilities
 */

import { getMoonEmoji, getMoonPhaseName } from './symbols.js';

/**
 * Calculate moon phase for a given date
 * Returns phase number (0-1), emoji, and name
 *
 * Algorithm based on lunar cycle (29.53 days average)
 * Reference new moon: January 6, 2000
 *
 * @param date Date to calculate moon phase for
 * @returns Object with phase (0-1), emoji, name, and illumination percentage
 */
export function getMoonPhase(date: Date = new Date()): {
  phase: number;
  emoji: string;
  name: string;
  illumination: number;
} {
  // Reference new moon (known new moon date)
  const knownNewMoon = new Date('2000-01-06T18:14:00Z');

  // Lunar cycle length in days
  const lunarCycle = 29.53058867; // synodic month

  // Calculate days since reference new moon
  const daysSinceNewMoon =
    (date.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);

  // Calculate phase (0-1)
  const phase = (daysSinceNewMoon % lunarCycle) / lunarCycle;

  // Calculate illumination percentage
  // 0 = new moon (0%), 0.5 = full moon (100%)
  const illumination = Math.round((1 - Math.abs(phase - 0.5) * 2) * 100);

  return {
    phase,
    emoji: getMoonEmoji(phase),
    name: getMoonPhaseName(phase),
    illumination,
  };
}

/**
 * Calculate sun position in arc (0-1)
 * 0 = sunrise, 0.5 = solar noon, 1 = sunset
 *
 * @param sunrise Sunrise time string (HH:MM format)
 * @param sunset Sunset time string (HH:MM format)
 * @param now Current date/time
 * @returns Position in arc (0-1), or null if before sunrise or after sunset
 */
export function calculateSunPosition(
  sunrise: string,
  sunset: string,
  now: Date = new Date()
): number | null {
  // Parse time strings (assume same day)
  const sunriseTime = parseTimeString(sunrise, now);
  const sunsetTime = parseTimeString(sunset, now);

  const nowTime = now.getTime();

  // Check if sun is up
  if (nowTime < sunriseTime || nowTime > sunsetTime) {
    return null; // Sun is down
  }

  // Calculate position (0-1)
  const totalDaylight = sunsetTime - sunriseTime;
  const elapsed = nowTime - sunriseTime;

  return elapsed / totalDaylight;
}

/**
 * Parse time string (HH:MM or HH:MM:SS) to timestamp
 * Assumes the time is on the given date
 */
function parseTimeString(timeStr: string, date: Date): number {
  const [hours, minutes, seconds = '0'] = timeStr.split(':').map(Number);

  const result = new Date(date);
  result.setHours(hours);
  result.setMinutes(minutes);
  result.setSeconds(seconds);

  return result.getTime();
}

/**
 * Format minutes into hours and minutes
 * e.g., 135 -> "2h 15m"
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);

  if (hours === 0) return `${mins}m`;
  return `${hours}h ${mins}m`;
}

/**
 * Calculate daylight duration in minutes
 *
 * @param sunrise Sunrise time string (HH:MM)
 * @param sunset Sunset time string (HH:MM)
 * @returns Duration in minutes
 */
export function calculateDaylightMinutes(
  sunrise: string,
  sunset: string
): number {
  const now = new Date();
  const sunriseTime = parseTimeString(sunrise, now);
  const sunsetTime = parseTimeString(sunset, now);

  return Math.round((sunsetTime - sunriseTime) / (1000 * 60));
}

/**
 * Determine if it's currently daytime
 *
 * @param sunrise Sunrise time string
 * @param sunset Sunset time string
 * @param now Current time
 * @returns True if sun is up
 */
export function isDaytime(
  sunrise: string,
  sunset: string,
  now: Date = new Date()
): boolean {
  return calculateSunPosition(sunrise, sunset, now) !== null;
}

/**
 * Calculate twilight times
 * Approximate civil twilight as 30 minutes before sunrise / after sunset
 */
export function getTwilightTimes(sunrise: string, sunset: string): {
  civilDawn: string;
  civilDusk: string;
} {
  const now = new Date();
  const sunriseTime = parseTimeString(sunrise, now);
  const sunsetTime = parseTimeString(sunset, now);

  const civilDawnTime = new Date(sunriseTime - 30 * 60 * 1000);
  const civilDuskTime = new Date(sunsetTime + 30 * 60 * 1000);

  return {
    civilDawn: formatTime(civilDawnTime),
    civilDusk: formatTime(civilDuskTime),
  };
}

/**
 * Format date to HH:MM string
 */
function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}
