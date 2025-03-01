// src/crypto/auth/index.ts

/**
 * HMAC-based authentication module for Zero library
 * Exports cryptographic primitives for zero-knowledge authentication
 */

// Export HMAC-based authentication functions and types
export {
    deriveHmacKey,
    verifyHmacKey,
    createHmacProof,
    verifyHmacProof,
    HmacKeyOptions
  } from './hmac.js';