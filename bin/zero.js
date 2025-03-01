#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

// Load the CLI module
import('../dist/cli/cli.js').catch(err => {
  console.error('Failed to load the Zero CLI:', err);
  process.exit(1);
});
