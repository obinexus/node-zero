// src/cli/commands/challenge.ts

import { ZeroContext } from "@/context/ZeroContext.js";
import { generateChallenge } from "@/encoding/id.js";
import chalk from "chalk/index.js";
import { Command } from "commander";
import ora from "ora";
import fs from "fs/promises";
import path from "path";
import { ChallengeCommandOptions, ProveCommandOptions } from "@/parser/index.js";




/**
 * Registers the 'challenge' command with Commander
 * 
 * @param program - Commander program instance
 * @returns The Commander program with command registered
 */
export function registerChallengeCommand(program: Command): Command {
  return program
    .command('challenge')
    .description('Generate a challenge for ZKP verification')
    .requiredOption('-o, --output <file>', 'Output file for challenge')
    .option('-s, --size <size>', 'Challenge size in bytes', '32')
    .action(async (options: ChallengeCommandOptions) => {
      try {
        await handleChallengeCommand(options);
      } catch (error) {
        handleChallengeError(error);
      }
    });
}

export function registerProveCommand(program: Command): Command {
  return program.command('prove')
    .description('Generate a proof for a Zero ID')  
    .requiredOption('-i, --input <file>', 'Input file with Zero ID data')
    .requiredOption('-p, --proof <file>', 'Input file with proof data')
    .requiredOption('-c, --challenge <file>', 'Input file with challenge data')
    .requiredOption('-o, --output <file>', 'Output file for proof')
    .option('-f, --format <format>', 'Output format (text, json, binary)', 'text')
    .option('-v, --verbose', 'Verbose output')
    .action(async (options: ProveCommandOptions) => {
      try {
        await handleProveCommand(options);
      } catch (error) {
        // handleProveError(error);
      }
    });
}

export function handleProveCommand(options: ProveCommandOptions): Promise<void> {
  throw new Error('Function not implemented.');
}


/**
 * Handles the 'challenge' command execution
 * 
 * @param options - Command options
 */
export async function handleChallengeCommand(options: ChallengeCommandOptions): Promise<void> {
  const spinner = ora('Generating challenge...').start();
  const context = ZeroContext.create();
  
  try {
    // Parse options
    const challengeSize = options.size ? parseInt(options.size, 10) : 32;
    
    // Generate challenge
    const challenge = generateChallenge(context, challengeSize);
    
    // Create directory if it doesn't exist
    const directory = path.dirname(options.output);
    await fs.mkdir(directory, { recursive: true });
    
    // Write challenge to file
    await fs.writeFile(options.output, challenge);
    
    spinner.succeed(`Challenge generated successfully: ${chalk.green(options.output)}`);
  } catch (error) {
    spinner.fail('Failed to generate challenge');
    throw error;
  }
}

/**
 * Handles errors from the challenge command
 * 
 * @param error - Error object
 */
function handleChallengeError(error: unknown): void {
  console.error(chalk.red(`Error: ${error instanceof Error ? error.message : String(error)}`));
  process.exit(1);
}

