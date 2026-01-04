/**
 * Configuration file utilities for Weather TUI
 *
 * Handles persistent storage of user preferences and saved locations
 * with XDG Base Directory compliance and robust error handling.
 */

import { promises as fs } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import type { AppConfig, Location } from '../types/config.js';
import { DEFAULT_CONFIG } from '../types/config.js';

/**
 * Get the configuration file path
 *
 * Follows XDG Base Directory specification:
 * - Linux/macOS: $XDG_CONFIG_HOME/weather-tui/config.json or ~/.config/weather-tui/config.json
 * - Windows fallback: ~/.weather-tui.json
 *
 * @returns Absolute path to config file
 */
export function getConfigPath(): string {
  const platform = process.platform;

  if (platform === 'win32') {
    // Windows: Use home directory fallback
    return join(homedir(), '.weather-tui.json');
  }

  // Unix-like systems: Use XDG spec
  const xdgConfigHome = process.env.XDG_CONFIG_HOME || join(homedir(), '.config');
  return join(xdgConfigHome, 'weather-tui', 'config.json');
}

/**
 * Ensure the config directory exists
 *
 * Creates parent directories recursively if they don't exist.
 * Safe to call multiple times (idempotent).
 *
 * @throws If directory creation fails due to permissions
 */
export async function ensureConfigDir(): Promise<void> {
  const configPath = getConfigPath();
  const configDir = join(configPath, '..');

  try {
    await fs.mkdir(configDir, { recursive: true });
  } catch (error) {
    // Only throw if error is not EEXIST
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
      throw error;
    }
  }
}

/**
 * Backup a corrupted config file
 *
 * Copies the corrupted file to .corrupted-<timestamp>.json
 * Silent failure if backup cannot be created.
 *
 * @param path - Path to corrupted config file
 */
async function backupCorruptedConfig(path: string): Promise<void> {
  try {
    const timestamp = Date.now();
    const backupPath = path.replace('.json', `.corrupted-${timestamp}.json`);
    await fs.copyFile(path, backupPath);
    console.warn(`Corrupted config backed up to: ${backupPath}`);
  } catch (error) {
    // Silent failure - backup is best-effort
    console.warn('Failed to backup corrupted config:', error);
  }
}

/**
 * Load configuration from disk
 *
 * Error handling:
 * - File doesn't exist (ENOENT) → return DEFAULT_CONFIG
 * - Corrupted JSON (SyntaxError) → backup file, return DEFAULT_CONFIG
 * - Permission denied → throw (user needs to fix permissions)
 * - Other errors → throw
 *
 * Merges loaded config with DEFAULT_CONFIG for forward compatibility
 * (allows adding new fields without breaking existing configs)
 *
 * @returns Loaded configuration or DEFAULT_CONFIG
 * @throws On permission errors or unexpected file system errors
 */
export async function loadConfig(): Promise<AppConfig> {
  const configPath = getConfigPath();

  try {
    const content = await fs.readFile(configPath, 'utf-8');
    const loaded = JSON.parse(content) as Partial<AppConfig>;

    // Merge with defaults for forward compatibility
    return {
      ...DEFAULT_CONFIG,
      ...loaded,
      settings: {
        ...DEFAULT_CONFIG.settings,
        ...loaded.settings,
      },
    };
  } catch (error) {
    const err = error as NodeJS.ErrnoException;

    // File doesn't exist - first run
    if (err.code === 'ENOENT') {
      return { ...DEFAULT_CONFIG };
    }

    // Corrupted JSON
    if (error instanceof SyntaxError) {
      await backupCorruptedConfig(configPath);
      console.warn('Config file corrupted, using defaults');
      return { ...DEFAULT_CONFIG };
    }

    // Permission denied or other errors - throw
    throw error;
  }
}

/**
 * Save configuration to disk
 *
 * Uses atomic write pattern:
 * 1. Write to temporary file
 * 2. Rename temp file to target (atomic operation)
 *
 * This prevents corruption if the process crashes during write.
 *
 * @param config - Configuration to save
 * @throws On file system errors
 */
export async function saveConfig(config: AppConfig): Promise<void> {
  const configPath = getConfigPath();
  const tempPath = `${configPath}.tmp`;

  try {
    // Ensure directory exists
    await ensureConfigDir();

    // Write to temp file
    const content = JSON.stringify(config, null, 2);
    await fs.writeFile(tempPath, content, 'utf-8');

    // Atomic rename
    await fs.rename(tempPath, configPath);
  } catch (error) {
    // Clean up temp file if it exists
    try {
      await fs.unlink(tempPath);
    } catch {
      // Ignore cleanup errors
    }
    throw error;
  }
}

/**
 * Add a location to saved locations
 *
 * Prevents duplicates by checking latitude/longitude.
 * If location already exists, returns config unchanged.
 *
 * @param location - Location to add
 * @returns Updated configuration
 */
export async function addLocation(location: Location): Promise<AppConfig> {
  const config = await loadConfig();

  // Check for duplicate (same coordinates)
  const exists = config.locations.some(
    (loc) => loc.latitude === location.latitude && loc.longitude === location.longitude
  );

  if (exists) {
    return config;
  }

  // Add location and save
  config.locations.push(location);
  await saveConfig(config);
  return config;
}

/**
 * Remove a location from saved locations
 *
 * Adjusts defaultLocationIndex if:
 * - Removed location was the default → set to 0
 * - Removed location was before default → decrement index
 *
 * @param latitude - Latitude of location to remove
 * @param longitude - Longitude of location to remove
 * @returns Updated configuration
 */
export async function removeLocation(
  latitude: number,
  longitude: number
): Promise<AppConfig> {
  const config = await loadConfig();

  // Find index of location to remove
  const removeIndex = config.locations.findIndex(
    (loc) => loc.latitude === latitude && loc.longitude === longitude
  );

  if (removeIndex === -1) {
    return config; // Location not found
  }

  // Remove location
  config.locations.splice(removeIndex, 1);

  // Adjust default index if needed
  if (config.defaultLocationIndex === removeIndex) {
    config.defaultLocationIndex = 0;
  } else if (config.defaultLocationIndex > removeIndex) {
    config.defaultLocationIndex -= 1;
  }

  // Ensure index is valid
  if (config.locations.length === 0) {
    config.defaultLocationIndex = 0;
  } else if (config.defaultLocationIndex >= config.locations.length) {
    config.defaultLocationIndex = config.locations.length - 1;
  }

  await saveConfig(config);
  return config;
}

/**
 * Check if config file exists
 *
 * Used for first-run detection.
 *
 * @returns true if config file exists
 */
export async function configExists(): Promise<boolean> {
  const configPath = getConfigPath();
  try {
    await fs.access(configPath);
    return true;
  } catch {
    return false;
  }
}
