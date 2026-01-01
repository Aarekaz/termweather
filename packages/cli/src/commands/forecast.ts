import { Command } from 'commander';
import chalk from 'chalk';
import { WeatherClient } from '@weather/core';
import { loadConfig } from '../config/store.js';
import {
  formatForecastTable,
  formatForecastJson,
  formatForecastCompact,
} from '../formatters/index.js';

export const forecastCommand = new Command('forecast')
  .description('Get weather forecast for a location')
  .argument('[location]', 'Location name (e.g., "New York" or "Tokyo, Japan")')
  .option('--lat <latitude>', 'Latitude coordinate')
  .option('--lon <longitude>', 'Longitude coordinate')
  .option('--hourly', 'Show hourly forecast (default: daily)')
  .option('--days <days>', 'Number of days to show (1-7)', '7')
  .option('--hours <hours>', 'Number of hours to show (1-48)', '24')
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
        console.error(chalk.red('No location specified. Use:'));
        console.error(chalk.dim('  weather forecast "New York"'));
        console.error(chalk.dim('  weather forecast --lat 40.71 --lon -74.01'));
        console.error(
          chalk.dim('  weather config set location "New York" (to set default)')
        );
        process.exit(1);
      }

      const type = options?.hourly ? 'hourly' : 'daily';

      if (options?.json) {
        console.log(formatForecastJson(weather, type));
      } else if (options?.compact) {
        console.log(formatForecastCompact(weather, type));
      } else {
        console.log(formatForecastTable(weather, type));
      }
    } catch (error) {
      console.error(
        chalk.red('Error fetching forecast:'),
        error instanceof Error ? error.message : 'Unknown error'
      );
      process.exit(1);
    }
  });
