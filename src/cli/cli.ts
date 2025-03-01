/**
 * CLI main export module
 * 
 * This file serves as the main entry point for the CLI functionality.
 * It initializes and exports the core CLI components and types.
 * 
 * @module cli
 * 
 * @example
 * // Import and use the CLI programmatically
 * import { program } from '@zero/cli';
 * program.parse(process.argv);
 * 
 * @example
 * // Use individual CLI components
 * import { createCLI, main } from '@zero/cli';
 * const program = createCLI();
 * await main();
 * 
 * @example
 * // Access CLI commands and handlers
 * import { commands, handlers } from '@zero/cli';
 * commands.register(program);
 * 
 * @exports createCLI - Function to create and configure CLI instance
 * @exports main - Main CLI entry point function
 * @exports program - Initialized CLI program instance
 * @exports commands - CLI command definitions
 * @exports handlers - Command handler implementations
 * @exports types - CLI type definitions
 */
/**
 * Zero CLI - Command-line interface for Zero library
 * 
 * This module provides a command-line interface to the Zero library,
 * allowing users to perform secure identity and zero-knowledge proof
 * operations from the terminal.
 * 
 * Usage: zero <command> [options]
 */
import { Command } from 'commander';
import chalk from 'chalk';
import path from 'path';
import  fs from 'fs';
import { registerCommands } from './commands/index.js';
import { ZeroError } from '@/errors/ZeroError.js';

// CLI version should match library version
const CLI_VERSION = fs.readFileSync(path.resolve('package.json'), 'utf-8')
  .match(/"version":\s*"(.*?)"/)?.[1] || '0.0.0';
const PROGRAM_NAME = 'zero';

/**
 * Creates and configures the CLI program
 * 
 * @returns Configured Commander program
 */
export function createCLI(): Command {
  const program = new Command();
  
  // Configure global settings
  program
    .name(PROGRAM_NAME)
    .description(chalk.bold('Zero Identity and ZKP Command Line Interface'))
    .version(CLI_VERSION, '-V, --version', 'Show version information')
    .option('-v, --verbose', 'Enable verbose output')
    .helpOption('-h, --help', 'Show help information');
  
  // Register all commands
  registerCommands(program);
  
  // Handle help command explicitly
  program
    .command('help')
    .description('Show help information')
    .action(() => program.help());
  
  return program;
}

/**
 * Main entry point for CLI execution
 */
export async function main(): Promise<void> {
  try {
    const program = createCLI();
    
    // Parse arguments
    program.parse(process.argv);
    
    // Show help if no arguments are provided
    if (process.argv.length < 3) {
      program.help();
    }
  } catch (error) {
    handleGlobalError(error);
  }
}

/**
 * Global error handler
 * 
 * @param error - Error object
 */
function handleGlobalError(error: unknown): void {
  if (error instanceof ZeroError) {
    console.error(chalk.red(`\nError: ${error.message}`));
    
    // Output additional details if available
    if (error.details) {
      console.error(chalk.yellow('Details:'), error.details);
    }
    
    // Show stack trace in verbose mode
    if (process.env.ZERO_VERBOSE === 'true' && error.stack) {
      console.error(chalk.gray(error.stack));
    }
  } else if (error instanceof Error) {
    console.error(chalk.red(`\nError: ${error.message}`));
    
    // Show stack trace in verbose mode
    if (process.env.ZERO_VERBOSE === 'true' && error.stack) {
      console.error(chalk.gray(error.stack));
    }
  } else {
    console.error(chalk.red(`\nUnknown error: ${String(error)}`));
  }
  
  process.exit(1);
}


const program = createCLI();

/**
 * Run the CLI if this is the main module
 */
if (import.meta.url === new URL(process.argv[1], 'file:').href) {
  main().catch((error) => {
    console.error(chalk.red('Unhandled exception:'), error);
    process.exit(1);
  });
}

export { program };


export default { createCLI, main };