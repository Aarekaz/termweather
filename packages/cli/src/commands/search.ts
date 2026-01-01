import { Command } from 'commander';
import chalk from 'chalk';
import { WeatherClient } from '@weather/core';
import {
  formatSearchResults,
  formatSearchResultsJson,
  formatSearchResultsCompact,
} from '../formatters/index.js';
import { setDefaultLocation } from '../config/store.js';

// Store last search results for set-location command
let lastSearchResults: Awaited<
  ReturnType<typeof WeatherClient.prototype.searchLocation>
> = [];

export const searchCommand = new Command('search')
  .description('Search for a location')
  .argument('<query>', 'Location to search for')
  .option('--limit <limit>', 'Maximum number of results', '10')
  .option('--json', 'Output as JSON')
  .option('--compact', 'Output as compact one-line format')
  .option('--set', 'Set the first result as default location')
  .action(async (query: string, options?: Record<string, string>) => {
    try {
      const client = new WeatherClient();
      const limit = parseInt(options?.limit || '10', 10);

      const results = await client.searchLocation(query, limit);
      lastSearchResults = results;

      if (options?.set && results.length > 0) {
        const loc = results[0];
        const admin = loc.admin1 ? `, ${loc.admin1}` : '';
        const fullName = `${loc.name}${admin}, ${loc.country}`;
        setDefaultLocation(fullName, loc.latitude, loc.longitude);
        console.log(chalk.green(`Default location set to: ${fullName}`));
        return;
      }

      if (options?.json) {
        console.log(formatSearchResultsJson(results));
      } else if (options?.compact) {
        console.log(formatSearchResultsCompact(results));
      } else {
        console.log(formatSearchResults(results));
      }
    } catch (error) {
      console.error(
        chalk.red('Error searching:'),
        error instanceof Error ? error.message : 'Unknown error'
      );
      process.exit(1);
    }
  });

export function getLastSearchResults() {
  return lastSearchResults;
}
