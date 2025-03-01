// src/cli/commands/derive.ts

import { ZeroContext } from "@/context/ZeroContext.js";
import { deriveId } from "@/encoding/id.js";
import chalk from "chalk/";
import { Command } from "commander";
import ora from "ora";
import { FileHandler } from "../handlers/FileHandler.js";
import { displayId } from "../utils/index.js";
import { DeriveCommandOptions, FileFormat } from "@/parser/index.js";



/**
 * Registers the 'derive' command with Commander
 * 
 * @param program - Commander program instance
 * @returns The Commander program with command registered
 */
export function registerDeriveCommand(program: Command): Command {
  return program
    .command('derive')
    .description('Generate a derived ID for a specific purpose')
    .requiredOption('-i, --input <file>', 'Input ID file')
    .requiredOption('-p, --purpose <str>', 'Purpose string for derived ID')
    .option('-o, --output <file>', 'Output file for derived ID')
    .option('-a, --algorithm <algo>', 'KDF algorithm (pbkdf2-sha256, pbkdf2-sha512, scrypt)', 'pbkdf2-sha512')
    .option('-f, --format <format>', 'Output format (text, json, binary)', 'text')
    .action(async (options: DeriveCommandOptions) => {
      try {
        await handleDeriveCommand(options);
      } catch (error) {
        handleDeriveError(error);
      }
    });
}

/**
 * Handles the 'derive' command execution
 * 
 * @param options - Command options
 */
export async function handleDeriveCommand(options: DeriveCommandOptions): Promise<void> {
  const spinner = ora('Deriving ID...').start();
  const context = ZeroContext.create();
  
  try {
    // Read base ID
    const baseId = await FileHandler.readId(options.input);
    
    // Derive new ID
    const derivedId = deriveId(context, baseId, options.purpose);
    
    // Write output or display to console
    if (options.output) {
      const format = parseOutputFormat(options.format);
      await FileHandler.writeOutput(options.output, { id: derivedId }, format);
      spinner.succeed(`Derived ID created successfully: ${chalk.green(options.output)}`);
    } else {
      spinner.succeed('Derived ID created successfully');
      displayId(derivedId, context);
    }
  } catch (error) {
    spinner.fail('Failed to derive ID');
    throw error;
  }
}

/**
 * Handles errors from the derive command
 * 
 * @param error - Error object
 */
function handleDeriveError(error: unknown): void {
  console.error(chalk.red(`Error: ${error instanceof Error ? error.message : String(error)}`));
  process.exit(1);
}

/**
 * Parses output format string to FileFormat enum
 * 
 * @param format - Format string
 * @returns FileFormat enum value
 */
function parseOutputFormat(format?: string): FileFormat {
  if (!format) return FileFormat.TEXT;
  
  switch (format.toLowerCase()) {
    case 'json':
      return FileFormat.JSON;
    case 'binary':
      return FileFormat.BINARY;
    case 'text':
    default:
      return FileFormat.TEXT;
  }
}