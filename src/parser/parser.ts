/**
 * Comprehensive parser for Zero library file formats
 * 
 * Handles parsing of ZID, key, proof, and other Zero library file types
 */

import { ParserOptions, ParseMode, FileFormat, Tokenizer } from "./types/index.js";


/**
 * File format types for Zero data
 */
export enum FileFormat {
  TEXT = 'text',
  JSON = 'json',
  BINARY = 'binary'
}

/**
 * Output data structure combining ID and key
 */
export interface OutputData {
  id: IZeroId;
  key?: IZeroKey;
}

/**
 * Zero File Parser
 * Handles parsing of different Zero library file formats
 */
export class ZeroParser {
  /**
   * Parser configuration options
   */
  private options: ParserOptions;
  
  /**
   * Tokenizer for breaking down input
   */
  private tokenizer: Tokenizer;
  
    /**
   * Creates a new Zero file parser
   * 
   * @param options - Parser configuration options
   */
  constructor(options: Partial<ParserOptions> = {}) {
    this.options = {
      format: FileFormat.TEXT,
      mode: ParseMode.STRICT,
      encoding: 'utf8',
      skipUnknownFields: false,
      validateChecksums: true,
      maxFileSize: 10 * 1024 * 1024, // 10 MB default
      ...options
    };
  }

  /**
   * Identifies the format of the input data
   * 
   * @param input - Input data
   * @returns Detected file format
   */
  public identifyFormat(input: Buffer | string): FileFormat {
    // If it's a buffer, check for binary format
    if (Buffer.isBuffer(input)) {
      // Check for binary format markers
      if (input.length >= 4) {
        // Check for common binary signatures
        const firstFourBytes = input.readUInt32BE(0);
        
        // Specific binary format signature for Zero library
        // This signature is a magic number specific to Zero library binary files
        if ((firstFourBytes & 0xFFFF0000) === 0x5A4B0000) { // 'ZK' magic number
          return FileFormat.BINARY;
        }
        
        // Additional binary format checks could be added here
        // For example, checking specific header structures
      }
      
      // Convert to string for further checks
      const str = input.toString('utf8', 0, Math.min(100, input.length));
      return this.identifyFormatFromString(str);
    } else {
      return this.identifyFormatFromString(input as string);
    }
  }

  /**
   * Identifies the format from a string sample
   * 
   * @param input - Input string
   * @returns Detected file format
   */
  private identifyFormatFromString(input: string): FileFormat {
    // Trim and limit input for processing
    const trimmedInput = input.trim().slice(0, 500).toLowerCase();

    // Prioritized format detection checks
    
    // 1. JSON Format Detection
    // More robust JSON detection with multiple checks
    if (
      (trimmedInput.startsWith('{') && trimmedInput.includes('"') && trimmedInput.includes(':') && trimmedInput.endsWith('}')) ||
      (trimmedInput.startsWith('[') && trimmedInput.includes('{') && trimmedInput.includes(':') && trimmedInput.endsWith(']'))
    ) {
      try {
        // Attempt to parse as JSON to validate
        JSON.parse(trimmedInput);
        return FileFormat.JSON;
      } catch {
        // If parsing fails, it's not valid JSON
      }
    }
    
    // 2. Base64 Format Detection
    // More strict Base64 validation
    if (
      /^[A-Za-z0-9+/=]+$/.test(trimmedInput) && 
      trimmedInput.length % 4 === 0 && 
      trimmedInput.replace(/=/g, '').length % 4 === 0
    ) {
      try {
        // Attempt to decode to validate
        Buffer.from(trimmedInput, 'base64');
        return FileFormat.BASE64;
      } catch {
        // If decoding fails, it's not valid Base64
      }
    }
    
    // 3. Compressed Format Detection
    // Check for common compression format signatures
    if (
      trimmedInput.startsWith('PK') ||  // ZIP
      trimmedInput.startsWith('Rar!') ||  // RAR
      trimmedInput.startsWith('H4sI')  // GZIP base64 encoded
    ) {
      return FileFormat.COMPRESSED;
    }
    
    // 4. Default to TEXT format
    // Ensure it's a readable text format
    if (/^[a-zA-Z0-9:.,\s\n\r]+$/.test(trimmedInput)) {
      return FileFormat.TEXT;
    }
    
    // Fallback to binary if no clear text format is detected
    return FileFormat.BINARY;
  }

}
