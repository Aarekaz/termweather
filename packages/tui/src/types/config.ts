/**
 * Configuration types for Weather TUI
 *
 * Centralized type definitions for app configuration and location data.
 * This eliminates the Location interface duplication across multiple files.
 */

/**
 * Geographic location with coordinates
 *
 * Used throughout the app for weather data fetching and display.
 * Centralized here to ensure type consistency.
 */
export interface Location {
  /** Display name of the location (e.g., "New York, NY") */
  name: string;
  /** Latitude coordinate (decimal degrees) */
  latitude: number;
  /** Longitude coordinate (decimal degrees) */
  longitude: number;
}

/**
 * Application configuration schema
 *
 * Persisted to ~/.config/weather-tui/config.json (XDG-compliant)
 * or ~/.weather-tui.json (Windows fallback)
 */
export interface AppConfig {
  /** Config schema version for future migrations */
  version: string;
  /** User's saved locations list */
  locations: Location[];
  /** Index of the default location to show on startup */
  defaultLocationIndex: number;
  /** Application settings and preferences */
  settings: {
    /** Enable/disable terminal animations */
    animationsEnabled: boolean;
    /** Weather data refresh interval in milliseconds */
    refreshInterval: number;
  };
}

/**
 * Default configuration values
 *
 * Used for:
 * - First-run initialization
 * - Fallback when config file is corrupted or unreadable
 * - Merging with loaded config for forward compatibility
 */
export const DEFAULT_CONFIG: AppConfig = {
  version: '1.0.0',
  locations: [],
  defaultLocationIndex: 0,
  settings: {
    animationsEnabled: true,
    refreshInterval: 5 * 60 * 1000, // 5 minutes
  },
};
