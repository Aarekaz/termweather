#!/usr/bin/env node
import { Command } from 'commander';
import {
  currentCommand,
  forecastCommand,
  searchCommand,
  configCommand,
} from './commands/index.js';

// List of valid CLI subcommands and flags
const CLI_COMMANDS = ['current', 'forecast', 'search', 'config'];
const CLI_FLAGS = ['--help', '-h', '--version', '-V'];

/**
 * Check if the user provided a CLI subcommand or flag
 */
function hasCliCommand(): boolean {
  const arg = process.argv[2];
  if (!arg) return false;
  return CLI_COMMANDS.includes(arg) || CLI_FLAGS.includes(arg);
}

/**
 * Launch the interactive TUI
 */
async function launchTUI(): Promise<void> {
  const { launchTUI: startTUI } = await import('@weather/tui');
  startTUI();
}

/**
 * Run the CLI with Commander.js
 */
function runCLI(): void {
  const program = new Command();

  program
    .name('weather')
    .description('Weather CLI - get weather from your terminal')
    .version('1.0.0');

  // Add all commands
  program.addCommand(currentCommand);
  program.addCommand(forecastCommand);
  program.addCommand(searchCommand);
  program.addCommand(configCommand);

  // Parse command line arguments
  program.parse();
}

/**
 * Main entry point
 * - No args: Launch TUI (interactive dashboard)
 * - With subcommand: Run CLI command
 */
async function main(): Promise<void> {
  if (hasCliCommand()) {
    // User provided a subcommand or flag - run CLI
    runCLI();
  } else {
    // No subcommand - launch interactive TUI
    await launchTUI();
  }
}

// Run the main function
main().catch((error) => {
  console.error('Error:', error.message);
  process.exit(1);
});
