#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure bin directory exists
async function createBinDir() {
  const binDir = path.resolve(__dirname, '..', 'bin');
  try {
    await fs.mkdir(binDir, { recursive: true });
    console.log('✅ Created bin directory');
    return binDir;
  } catch (error) {
    console.error('❌ Failed to create bin directory:', error);
    throw error;
  }
}

// Create the bin script
async function createBinScript(binDir) {
  const binPath = path.join(binDir, 'zero.js');
  
  const binContent = `#!/usr/bin/env node

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
`;

  try {
    await fs.writeFile(binPath, binContent, 'utf8');
    await fs.chmod(binPath, '755'); // Make executable
    console.log(`✅ Created bin script at ${binPath}`);
  } catch (error) {
    console.error('❌ Failed to create bin script:', error);
    throw error;
  }
}

// Main function
async function main() {
  try {
    console.log('📦 Creating Zero CLI bin script...');
    const binDir = await createBinDir();
    await createBinScript(binDir);
    console.log('✨ Bin script created successfully!');
  } catch (error) {
    console.error('❌ Failed to create bin script:', error);
    process.exit(1);
  }
}

main();