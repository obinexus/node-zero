# @obinexuscomputing/zero CLI Usage Guide

This guide demonstrates how to use the Zero command-line interface (CLI) for identity management and zero-knowledge proof operations.

## Installation

```bash
# Install globally from npm
npm install -g @obinexuscomputing/zero

# Or install locally
npm install @obinexuscomputing/zero

# Run directly after local installation
npx zero

# Or if built from source
node ./dist/bin/cli.js
```

## Basic Commands

### 1. Creating a New Zero ID

Create a new identity from input data:

```bash
# Create from JSON file
zero create -i identity.json -o id.zid

# With specific hash algorithm
zero create -i identity.json -o id.zid -a sha512

# With custom salt length
zero create -i identity.json -o id.zid -s 48

# With different output format
zero create -i identity.json -o id.zid -f json
```

Example identity.json:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "timestamp": "2025-02-23T12:00:00Z"
}
```

### 2. Verifying an ID

Verify an ID against input data:

```bash
# Basic verification
zero verify -i identity.json -k id.zid

# Verify with separate ID file
zero verify -i identity.json -k key.zid -d id.zid

# Verbose verification
zero verify -i identity.json -k id.zid -v
```

### 3. Deriving IDs

Generate purpose-specific derived IDs:

```bash
# Create derived ID for authentication
zero derive -i base.zid -p "auth" -o auth.zid

# Create derived ID with specific algorithm
zero derive -i base.zid -p "payment" -o payment.zid -a pbkdf2-sha512
```

### 4. Zero-Knowledge Proof Operations

Generate and verify zero-knowledge proofs:

```bash
# Generate a challenge
zero challenge -o challenge.bin

# Create a proof
zero prove -i id.zid -c challenge.bin -o proof.bin

# Verify a proof
zero verify-proof -i proof.bin -c challenge.bin -d id.zid
```

### 5. Information

Display library and CLI information:

```bash
# Show version and capabilities
zero info

# Show help
zero help
```

## Command Options

### Global Options

- `-v, --verbose`: Enable verbose output
- `-V, --version`: Show version information
- `-h, --help`: Show help information

### Create Command Options

- `-i, --input <file>`: Input data file
- `-o, --output <file>`: Output file for ID/key
- `-s, --salt <size>`: Salt length in bytes (default: 32)
- `-a, --algorithm <algo>`: Hash algorithm (sha256, sha384, sha512)
- `-f, --format <format>`: Output format (text, json, binary)

### Verify Command Options

- `-i, --input <file>`: Input data file
- `-k, --key <file>`: Key file for verification
- `-d, --id <file>`: ID file for verification

### Derive Command Options

- `-i, --input <file>`: Input ID file
- `-p, --purpose <str>`: Purpose string for derived ID
- `-o, --output <file>`: Output file for derived ID
- `-a, --algorithm <algo>`: KDF algorithm (pbkdf2-sha256, pbkdf2-sha512, scrypt)
- `-f, --format <format>`: Output format (text, json, binary)

### Challenge Command Options

- `-o, --output <file>`: Output file for challenge
- `-s, --size <size>`: Challenge size in bytes (default: 32)

### Prove Command Options

- `-i, --input <file>`: Input ID file
- `-c, --challenge <file>`: Challenge file for ZKP
- `-o, --output <file>`: Output file for proof
- `-k, --key <file>`: Key file (optional)

### Verify-Proof Command Options

- `-i, --input <file>`: Proof file
- `-c, --challenge <file>`: Challenge file used for proof
- `-d, --id <file>`: ID file for verification

## File Formats

### Text Format (Default)

```text
# ZeroID
version: 1
hash: a1b2c3d4e5f6...
salt: 98765432...
```

### JSON Format

```json
{
  "version": 1,
  "hash": "a1b2c3d4e5f6...",
  "salt": "98765432...",
  "key": {
    "hash": "f6e5d4c3b2a1...",
    "timestamp": 1708675200000
  }
}
```

### Binary Format

Most compact format, suitable for storage and transmission. Use with `-f binary` option.

## Interactive Mode

When running commands without required parameters in an interactive terminal, the CLI will prompt for missing information:

```bash
$ zero create
? Enter input data file path: identity.json
? Enter output file path (or leave empty for console output): id.zid
? Select hash algorithm: SHA-512
```

## Examples

### Complete Identity Workflow

1. Create input data:
```bash
echo '{
  "name": "Alice Smith",
  "dob": "1990-01-01",
  "id_number": "ABC123456"
}' > identity.json
```

2. Create ID:
```bash
zero create -i identity.json -o alice.zid -a sha512
```

3. Generate challenge:
```bash
zero challenge -o auth_challenge.bin
```

4. Create proof:
```bash
zero prove -i alice.zid -c auth_challenge.bin -o auth_proof.bin
```

5. Verify proof:
```bash
zero verify-proof -i auth_proof.bin -c auth_challenge.bin -d alice.zid
```

### Derived Identity for Authentication

1. Create base ID:
```bash
zero create -i identity.json -o base.zid
```

2. Derive authentication ID:
```bash
zero derive -i base.zid -p "authentication" -o auth.zid
```

3. Verify derived ID:
```bash
zero verify -i identity.json -k auth.zid
```

## Error Handling

The CLI provides detailed error messages with context:

```
Error: Failed to read input data from identity.json: Unexpected token in JSON at position 42
```

Common error types include:
- Invalid arguments
- File I/O errors
- Cryptographic failures
- Verification failures
- Buffer size issues

## Security Considerations

1. Input files should be protected and securely deleted when no longer needed
2. Use appropriate file permissions for output files (e.g., `chmod 600`)
3. Keep challenge and proof files private
4. Use secure channels for file transmission
5. Regularly rotate derived IDs for sensitive applications

## Best Practices

1. Use purpose-specific derived IDs instead of sharing the base ID
2. Verify IDs immediately after creation
3. Keep base IDs secure and offline when possible
4. Use verbose mode for debugging
5. Maintain secure backups of important IDs
6. Document purpose strings for derived IDs
7. Use strong input data with multiple fields
8. Check the `info` command to verify current settings

## Troubleshooting

Common issues and solutions:

1. "Invalid format" error:
   - Check input file format
   - Verify JSON syntax
   - Ensure UTF-8 encoding

2. "File not found" error:
   - Verify file paths
   - Check file permissions
   - Ensure correct working directory

3. "Verification failed" error:
   - Check input data matches original
   - Verify correct key file
   - Ensure ID file integrity

4. "Buffer too small" error:
   - Increase salt size
   - Check input file size

## Integration with Node.js

You can also use the library programmatically in your Node.js applications:

```javascript
import { ZeroContext, createId, verifyId, generateChallenge } from '@obinexuscomputing/zero';

// Initialize the library
const context = ZeroContext.create();

// Create an ID
const id = createId(context, data);

// Generate a challenge
const challenge = generateChallenge(context, 32);

// Verify an ID
const isValid = verifyId(context, id, key, data);
```

## Building from Source

If you want to build the CLI from source:

```bash
# Clone the repository
git clone https://github.com/obinexuscomputing/zero.git
cd zero

# Install dependencies
npm install

# Build the package
npm run build

# Run the CLI
node ./dist/bin/cli.js
```

## Version Information

You can check the version and capabilities of your installation:

```bash
zero info
```

This shows:
- CLI version
- Library version
- Protocol version
- Supported hash algorithms
- Supported KDF algorithms

## Package Structure


The package follows a modular structure:

```
@obinexuscomputing/zero/
├── dist/
│   ├── bin/        # CLI executables
│   ├── cjs/        # CommonJS modules
│   ├── esm/        # ES modules
│   └── types/      # TypeScript declarations
├── src/
│   ├── bin/        # CLI source code
│   ├── context/    # Context management
│   ├── crypto/     # Cryptographic operations
│   ├── encoding/   # ID encoding/decoding
│   ├── errors/     # Error handling
│   ├── types/      # TypeScript types
│   └── utils/      # Utility functions
```

## License and Acknowledgments

The @obinexuscomputing/zero package is developed by OBINexus Computing and is available under its license terms.

For more information, visit the project repository.