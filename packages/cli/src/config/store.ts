import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

export interface CLIConfig {
  defaultLocation?: {
    name: string;
    latitude: number;
    longitude: number;
  };
  units: {
    temperature: 'celsius' | 'fahrenheit';
    windSpeed: 'kmh' | 'mph' | 'ms' | 'kn';
    pressure: 'mb' | 'inHg';
  };
  format: 'table' | 'json' | 'compact';
}

const DEFAULT_CONFIG: CLIConfig = {
  units: {
    temperature: 'celsius',
    windSpeed: 'kmh',
    pressure: 'mb',
  },
  format: 'table',
};

function getConfigDir(): string {
  const configDir = join(homedir(), '.weather-cli');
  if (!existsSync(configDir)) {
    mkdirSync(configDir, { recursive: true });
  }
  return configDir;
}

function getConfigPath(): string {
  return join(getConfigDir(), 'config.json');
}

export function loadConfig(): CLIConfig {
  const configPath = getConfigPath();

  if (!existsSync(configPath)) {
    return DEFAULT_CONFIG;
  }

  try {
    const content = readFileSync(configPath, 'utf-8');
    const parsed = JSON.parse(content);
    return { ...DEFAULT_CONFIG, ...parsed };
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function saveConfig(config: CLIConfig): void {
  const configPath = getConfigPath();
  writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
}

export function getConfigValue(key: string): string | undefined {
  const config = loadConfig();

  switch (key) {
    case 'location':
      return config.defaultLocation?.name;
    case 'temperature':
    case 'units.temperature':
      return config.units.temperature;
    case 'windSpeed':
    case 'units.windSpeed':
      return config.units.windSpeed;
    case 'pressure':
    case 'units.pressure':
      return config.units.pressure;
    case 'format':
      return config.format;
    default:
      return undefined;
  }
}

export function setConfigValue(key: string, value: string): boolean {
  const config = loadConfig();

  switch (key) {
    case 'location':
      // Location will be set by the search command with coordinates
      return false;
    case 'temperature':
    case 'units.temperature':
      if (value === 'celsius' || value === 'fahrenheit') {
        config.units.temperature = value;
        saveConfig(config);
        return true;
      }
      return false;
    case 'windSpeed':
    case 'units.windSpeed':
      if (['kmh', 'mph', 'ms', 'kn'].includes(value)) {
        config.units.windSpeed = value as CLIConfig['units']['windSpeed'];
        saveConfig(config);
        return true;
      }
      return false;
    case 'pressure':
    case 'units.pressure':
      if (value === 'mb' || value === 'inHg') {
        config.units.pressure = value;
        saveConfig(config);
        return true;
      }
      return false;
    case 'format':
      if (['table', 'json', 'compact'].includes(value)) {
        config.format = value as CLIConfig['format'];
        saveConfig(config);
        return true;
      }
      return false;
    default:
      return false;
  }
}

export function setDefaultLocation(
  name: string,
  latitude: number,
  longitude: number
): void {
  const config = loadConfig();
  config.defaultLocation = { name, latitude, longitude };
  saveConfig(config);
}

export function listConfig(): Record<string, string> {
  const config = loadConfig();
  return {
    location: config.defaultLocation?.name || '(not set)',
    temperature: config.units.temperature,
    windSpeed: config.units.windSpeed,
    pressure: config.units.pressure,
    format: config.format,
  };
}
