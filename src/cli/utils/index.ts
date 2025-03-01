// src/cli/utils/index.ts

import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import { ZeroContext } from '@/context/ZeroContext.js';
import { idToString } from '@/encoding/id.js';
import { IZeroData, IZeroId, IZeroKey, isKeyExpired, keyToString } from '@/encoding/index.js';

/**
 * Reads input data from file
 * 
 * @param filename - Input file path
 * @returns Data structure for ID creation
 */
export async function readInputData(filename: string): Promise<IZeroData> {
  try {
    const fileContent = await fs.readFile(filename, 'utf8');
    let data: { [key: string]: string } = {};
    
    // Check file extension
    const ext = path.extname(filename).toLowerCase();
    
    if (ext === '.json') {
      // Parse JSON
      data = JSON.parse(fileContent);
    } else {
      // Parse key-value format (one per line)
      const lines = fileContent.split('\n');
      for (const line of lines) {
        if (line.trim() && !line.startsWith('#')) {
          const parts = line.split(':');
          if (parts.length >= 2) {
            const key = parts[0].trim();
            const value = parts.slice(1).join(':').trim();
            data[key] = value;
          }
        }
      }
    }
    
    // Convert to IZeroData format
    const keys: string[] = [];
    const values: string[] = [];
    
    for (const [key, value] of Object.entries(data)) {
      keys.push(key);
      values.push(value);
    }
    
    return { keys, values, count: keys.length };
  } catch (error) {
    throw new Error(`Failed to read input data from ${filename}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Displays ID information in the console
 * 
 * @param id - Zero ID to display
 * @param context - Zero context
 */
export function displayId(id: IZeroId, context: ZeroContext): void {
  console.log(chalk.bold('\nID Information:'));
  console.log(chalk.gray('----------------'));
  console.log(`${chalk.bold('Version:')} ${id.version}`);
  console.log(`${chalk.bold('Hash:')} ${id.hash.toString('hex')}`);
  console.log(`${chalk.bold('Salt:')} ${id.salt.toString('hex')}`);
  console.log(chalk.gray('----------------'));
  
  console.log(`\n${chalk.bold('ID String Representation:')}`);
  console.log(idToString(context, id));
}

/**
 * Displays ID and key information in the console
 * 
 * @param id - Zero ID to display
 * @param key - Zero key to display
 * @param context - Zero context
 */
export function displayIdAndKey(id: IZeroId, key: IZeroKey, context: ZeroContext): void {
  displayId(id, context);
  
  console.log(chalk.bold('\nKey Information:'));
  console.log(chalk.gray('----------------'));
  console.log(`${chalk.bold('Hash:')} ${key.hash.toString('hex')}`);
  console.log(`${chalk.bold('Created:')} ${new Date(key.timestamp).toISOString()}`);
  if (key.expirationTime) {
    console.log(`${chalk.bold('Expires:')} ${new Date(key.expirationTime).toISOString()}`);
    const expired = isKeyExpired(key);
    console.log(`${chalk.bold('Status:')} ${expired ? chalk.red('Expired') : chalk.green('Valid')}`);
  } else {
    console.log(`${chalk.bold('Expires:')} Never`);
    console.log(`${chalk.bold('Status:')} ${chalk.green('Valid')}`);
  }
  console.log(chalk.gray('----------------'));
  
  console.log(`\n${chalk.bold('Key String Representation:')}`);
  console.log(keyToString(context, key));
}