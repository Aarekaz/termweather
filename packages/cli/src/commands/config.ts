import { Command } from 'commander';
import chalk from 'chalk';
import { WeatherClient } from '@weather/core';
import {
  getConfigValue,
  setConfigValue,
  setDefaultLocation,
  listConfig,
} from '../config/store.js';

export const configCommand = new Command('config')
  .description('Manage CLI configuration');

configCommand
  .command('get <key>')
  .description('Get a configuration value')
  .action((key: string) => {
    const value = getConfigValue(key);
    if (value !== undefined) {
      console.log(`${key}: ${value}`);
    } else {
      console.error(chalk.red(`Unknown configuration key: ${key}`));
      console.log(chalk.dim('Available keys: location, temperature, windSpeed, pressure, format'));
      process.exit(1);
    }
  });

configCommand
  .command('set <key> <value>')
  .description('Set a configuration value')
  .action(async (key: string, value: string) => {
    if (key === 'location') {
      // Special handling for location - search and set
      try {
        const client = new WeatherClient();
        const results = await client.searchLocation(value);

        if (results.length === 0) {
          console.error(chalk.red(`Location not found: ${value}`));
          process.exit(1);
        }

        const loc = results[0];
        const admin = loc.admin1 ? `, ${loc.admin1}` : '';
        const fullName = `${loc.name}${admin}, ${loc.country}`;
        setDefaultLocation(fullName, loc.latitude, loc.longitude);
        console.log(chalk.green(`Default location set to: ${fullName}`));
        console.log(chalk.dim(`Coordinates: ${loc.latitude}, ${loc.longitude}`));
      } catch (error) {
        console.error(
          chalk.red('Error setting location:'),
          error instanceof Error ? error.message : 'Unknown error'
        );
        process.exit(1);
      }
    } else {
      const success = setConfigValue(key, value);
      if (success) {
        console.log(chalk.green(`${key} set to: ${value}`));
      } else {
        console.error(chalk.red(`Invalid value for ${key}: ${value}`));
        printValidValues(key);
        process.exit(1);
      }
    }
  });

configCommand
  .command('list')
  .description('List all configuration values')
  .action(() => {
    const config = listConfig();
    console.log(chalk.bold('Current Configuration'));
    console.log('-'.repeat(30));
    for (const [key, value] of Object.entries(config)) {
      console.log(`  ${chalk.cyan(key.padEnd(12))} ${value}`);
    }
  });

configCommand
  .command('reset')
  .description('Reset configuration to defaults')
  .action(async () => {
    const { saveConfig } = await import('../config/store.js');
    saveConfig({
      units: {
        temperature: 'celsius',
        windSpeed: 'kmh',
        pressure: 'mb',
      },
      format: 'table',
    });
    console.log(chalk.green('Configuration reset to defaults'));
  });

function printValidValues(key: string): void {
  const validValues: Record<string, string[]> = {
    temperature: ['celsius', 'fahrenheit'],
    windSpeed: ['kmh', 'mph', 'ms', 'kn'],
    pressure: ['mb', 'inHg'],
    format: ['table', 'json', 'compact'],
  };

  const values = validValues[key];
  if (values) {
    console.log(chalk.dim(`Valid values: ${values.join(', ')}`));
  }
}
