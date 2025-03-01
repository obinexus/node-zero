// src/register.js
const path = require('path');
const moduleAlias = require('module-alias');

// Register module aliases
moduleAlias.addAliases({
  '@': path.join(__dirname, 'src'),
  '@bin': path.join(__dirname, 'bin'),
  '@utils': path.join(__dirname, 'src/utils'),
  '@context': path.join(__dirname, 'src/context'),
  '@crypto': path.join(__dirname, 'src/crypto'),
  '@encoding': path.join(__dirname, 'src/encoding'),
  '@errors': path.join(__dirname, 'src/errors'),
  '@types': path.join(__dirname, 'src/types')
});