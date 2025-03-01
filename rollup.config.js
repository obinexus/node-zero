import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import alias from '@rollup/plugin-alias';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path aliases from tsconfig.json
const pathAliases = {
  '@': path.resolve(__dirname, 'src'),
  '@cli': path.resolve(__dirname, 'src/cli'),
  '@utils': path.resolve(__dirname, 'src/utils'),
  '@context': path.resolve(__dirname, 'src/context'),
  '@crypto': path.resolve(__dirname, 'src/crypto'),
  '@encoding': path.resolve(__dirname, 'src/encoding'),
  '@errors': path.resolve(__dirname, 'src/errors'),
  '@types': path.resolve(__dirname, 'src/types')
};

// External dependencies that shouldn't be bundled
const external = [
  'crypto',
  'path',
  'fs',
  'fs/promises',
  'url',
  'util',
  'chalk',
  'commander',
  'inquirer',
  'ora',
  'table'
];

// Common plugins configuration
const createPlugins = (format, declarations = true) => [
  alias({
    entries: Object.entries(pathAliases).map(([find, replacement]) => ({
      find,
      replacement
    }))
  }),
  resolve({
    preferBuiltins: true,
    extensions: ['.ts', '.js', '.json']
  }),
  commonjs(),
  json(),
  typescript({
    tsconfig: './tsconfig.json',
    sourceMap: true,
    declaration: declarations,
    declarationDir: declarations ? `dist/${format}/types` : undefined,
    outDir: null,
    compilerOptions: {
      module: format === 'cjs' ? 'CommonJS' : 'ESNext',
      moduleResolution: 'node'
    }
  })
];

// Check for format from environment variable
const format = process.env.FORMAT || 'esm';

let config;

// ESM build configuration
if (format === 'esm') {
  config = {
    input: 'src/index.ts',
    output: {
      dir: 'dist/esm',
      format: 'es',
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: 'src'
    },
    external,
    plugins: createPlugins('esm')
  };
}

// CJS build configuration
if (format === 'cjs') {
  config = {
    input: 'src/index.ts',
    output: {
      dir: 'dist/cjs',
      format: 'cjs',
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: 'src',
      exports: 'named',
      // Add .cjs extension for CommonJS files
      entryFileNames: '[name].cjs'
    },
    external,
    plugins: createPlugins('cjs')
  };
}

// CLI build configuration
if (format === 'cli') {
  config = {
    input: 'src/cli/cli.ts',
    output: {
      dir: 'dist/cli',
      format: 'es',
      sourcemap: true
    },
    external,
    plugins: createPlugins('cli')
  };
}

export default config;