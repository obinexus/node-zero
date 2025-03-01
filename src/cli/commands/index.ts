// src/cli/commands/index.ts

import { Command } from 'commander';

// Import individual command registration functions
import { registerCreateCommand } from './create.js';
import { registerDeriveCommand } from './derive.js';
import { registerVerifyCommand } from './verify.js';
import { registerChallengeCommand } from './challenge.js';
import { registerProveCommand } from './prove.js';
import { registerVerifyProofCommand } from './verify-proof.js';
import { registerInfoCommand } from './info.js';
import { registerStegoCommand } from './stego.js';
import { registerConfigCommand } from './config.js';

/**
 * Registers all CLI commands
 * 
 * @param program - Commander program instance
 */
export function registerCommands(program: Command): void {
  // Register individual commands
  registerCreateCommand(program);
  registerDeriveCommand(program);
  registerVerifyCommand(program);
  registerChallengeCommand(program);
  registerProveCommand(program);
  registerVerifyProofCommand(program);
  registerInfoCommand(program);
  registerStegoCommand(program);
  registerConfigCommand(program);
}

// Export individual command handlers
export * from './create.js';
export * from './derive.js';
export * from './verify.js';
export * from './challenge.js';
export * from './prove.js';
export * from './verify-proof.js';
export * from './info.js';
export * from './stego.js';
export * from './config.js';
