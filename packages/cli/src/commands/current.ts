import { Command } from 'commander';
import chalk from 'chalk';
import { WeatherClient } from '@weather/core';
import { loadConfig } from '../config/store.js';
import {
  formatWeatherTable,
  formatWeatherJson,
  formatWeatherCompact,
} from '../formatters/index.js';

export const currentCommand = new Command('current')
  .description('Get current weather for a location')
  .argument('[location]', 'Location name (e.g., "New York" or "Tokyo, Japan")')
  .option('--lat <latitude>', 'Latitude coordinate')
  .option('--lon <longitude>', 'Longitude coordinate')
  .option('--json', 'Output as JSON')
  .option('--compact', 'Output as compact one-line format')
  .action(async (location?: string, options?: Record<string, string>) => {
    try {
      const client = new WeatherClient();
      const config = loadConfig();

      let weather;

      if (options?.lat && options?.lon) {
        const lat = parseFloat(options.lat);
        const lon = parseFloat(options.lon);
        weather = await client.getWeather(lat, lon);
      } else if (location) {
        // Use getWeatherByName to get proper location name
        weather = await client.getWeatherByName(location);
      } else if (config.defaultLocation) {
        weather = await client.getWeather(
          config.defaultLocation.latitude,
          config.defaultLocation.longitude
        );
        // Override with saved location name
        weather.location.name = config.defaultLocation.name;
      } else {
        console.error(
          chalk.red('No location specified. Use:')
        );
        console.error(chalk.dim('  weather current "New York"'));
        console.error(chalk.dim('  weather current --lat 40.71 --lon -74.01'));
        console.error(
          chalk.dim('  weather config set location "New York" (to set default)')
        );
        process.exit(1);
      }

      if (options?.json) {
        console.log(formatWeatherJson(weather));
      } else if (options?.compact) {
        console.log(formatWeatherCompact(weather));
      } else {
        console.log(formatWeatherTable(weather));
      }
    } catch (error) {
      console.error(
        chalk.red('Error fetching weather:'),
        error instanceof Error ? error.message : 'Unknown error'
      );
      process.exit(1);
    }
  });
