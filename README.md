# Zero: Zero-Knowledge Proof Library

A TypeScript implementation of Zero-Knowledge Proofs for Node.js, providing secure identity and authentication mechanisms.

## Features

- **Secure Identity Management**: Create, verify, and derive secure identities
- **Zero-Knowledge Proofs**: Generate and verify proofs without revealing underlying data
- **Command Line Interface**: Powerful CLI for all operations
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Secure Memory Handling**: Protection against memory-based attacks
- **Cryptographic Primitives**: Strong cryptographic foundations

## Installation

```bash
npm install @obinexuscomputing/zero
```

## Quick Start

### JavaScript/TypeScript Usage

```typescript
import { ZeroContext, createId, verifyId } from '@obinexuscomputing/zero';

// Initialize context
const context = ZeroContext.create();

// Create an identity
const id = createId(context, {
  keys: ['name', 'email'],
  values: ['John Doe', 'john@example.com']
});

// Verify the identity
const isValid = verifyId(context, id, key, {
  keys: ['name', 'email'],
  values: ['John Doe', 'john@example.com']
});

console.log(isValid); // true
```

### CLI Usage

```bash
# Create an identity from input data
zero create -i identity.json -o id.zid

# Verify an identity against input data
zero verify -i identity.json -k id.zid

# Derive a purpose-specific identity
zero derive -i base.zid -p "authentication" -o auth.zid

# Generate a challenge for proof
zero challenge -o challenge.bin

# Create a zero-knowledge proof
zero prove -i id.zid -c challenge.bin -o proof.bin

# Verify a proof
zero verify-proof -i proof.bin -c challenge.bin -d id.zid
```

## API Documentation

### Core Classes

- `ZeroContext`: Central context for all operations
- `ZeroMap`: Encoding map for character mapping operations
- `ZeroError`: Error handling with detailed information

### Identity Operations

- `createId()`: Generate a secure identity from input data
- `verifyId()`: Verify an identity against input data
- `deriveId()`: Create a derived identity for specific purposes
- `idToString()`: Convert an identity to string representation
- `idFromString()`: Parse a string back to an identity object

### Zero-Knowledge Proof Operations

- `generateChallenge()`: Create a secure challenge
- `createProof()`: Generate a proof for an identity
- `verifyProof()`: Verify a proof against a challenge and identity

### Key Management

- `createKey()`: Generate a verification key for an identity
- `verifyKey()`: Verify a key against an identity
- `renewKey()`: Extend the expiration of a key
- `revokeKey()`: Create a key revocation record

## Security

This library implements several security measures:

- **Constant-time operations** to prevent timing attacks
- **Secure memory wiping** to prevent data leakage
- **Buffer overflow detection** using canary values
- **Strong cryptographic primitives** with appropriate parameters

## Development

```bash
# Clone the repository
git clone https://github.com/obinexus/node-zero.git
cd node-zero

# Install dependencies
npm install

# Build the library
npm run build

# Run tests
npm test

# Run linting
npm run lint

# Generate documentation
npm run docs
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Based on academic research in zero-knowledge proof systems
- Implements the Schnorr identification protocol
- Designed with security and privacy as primary concerns