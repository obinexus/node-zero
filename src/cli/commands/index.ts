// src/cli/commands/index.ts

import { Command } from 'commander';
import { registerChallengeCommand } from './challenge.js';
import { registerCreateCommand } from './create.js';
import { registerDeriveCommand } from './derive.js';
import { registerInfoCommand } from './info.js';
import { registerVerifyProofCommand } from './verify-proof.js';
import { registerVerifyCommand } from './verify.js';

/**
 * Register all CLI commands with the Commander program
 * @param program - Commander program instance
 * @returns The Commander program with all commands registered
 */
export function registerCommands(program: Command): Command {
  registerCreateCommand(program);
  registerVerifyCommand(program);
  registerDeriveCommand(program);
  registerChallengeCommand(program);
  registerProveCommand(program);
  registerVerifyProofCommand(program);
  registerInfoCommand(program);
  
  return program;
}
export { registerCreateCommand } from './create.js';
export { registerVerifyCommand } from './verify.js';
export { registerDeriveCommand } from './derive.js';
export { registerChallengeCommand } from './challenge.js';
export { registerProveCommand } from './prove.js';
export { registerVerifyProofCommand } from './verify-proof.js';
export { registerInfoCommand } from './info.js';
