/**
 * FileHandler.ts - Unified file handling for Zero CLI
 * 
 * This file provides robust file handling operations for reading and writing
 * Zero IDs and keys, with support for different file formats and careful error handling.
 */

import { IZeroId, IZeroKey } from "@/encoding/index.js";
import { ZeroErrorCode } from "@/errors/index.js";
import { ZeroError } from "@/errors/ZeroError.js";
import { FileFormat } from "@/parser/types/index.js";
import fs from 'fs/promises';
import path from 'path';
import { OutputData } from "../FileHandler.js";


/**
 * Unified file handling class for Zero CLI
 */
export class FileHandler {
  /**
   * Reads ID from file with format detection
   * 
   * @param filename - Path to ID file
   * @returns Promise resolving to IZeroId
   * @throws ZeroError if file cannot be read or parsed
   */
  public static async readId(filename: string): Promise<IZeroId> {
    try {
      const fileExt = path.extname(filename).toLowerCase();
      const content = await fs.readFile(filename);
      
      // Determine format from extension or content
      if (fileExt === '.json') {
        return this.parseJsonId(content.toString('utf8'));
      } else if (fileExt === '.bin' || this.isBinaryFormat(content)) {
        return this.parseBinaryId(content);
      } else {
        return this.parseTextId(content.toString('utf8'));
      }
    } catch (error) {
      if (error instanceof ZeroError) {
        throw error;
      }
      
      throw new ZeroError(
        ZeroErrorCode.IO_ERROR,
        `Failed to read ID from ${filename}`,
        { filename },
        error instanceof Error ? error : undefined
      );
    }
  }
  
  /**
   * Reads key from file with format detection
   * 
   * @param filename - Path to key file
   * @returns Promise resolving to IZeroKey
   * @throws ZeroError if file cannot be read or parsed
   */
  public static async readKey(filename: string): Promise<IZeroKey> {
    try {
      const fileExt = path.extname(filename).toLowerCase();
      const content = await fs.readFile(filename);
      
      // Determine format from extension or content
      if (fileExt === '.json') {
        return this.parseJsonKey(content.toString('utf8'));
      } else if (fileExt === '.bin' || this.isBinaryFormat(content)) {
        return this.parseBinaryKey(content);
      } else {
        return this.parseTextKey(content.toString('utf8'));
      }
    } catch (error) {
      if (error instanceof ZeroError) {
        throw error;
      }
      
      throw new ZeroError(
        ZeroErrorCode.IO_ERROR,
        `Failed to read key from ${filename}`,
        { filename },
        error instanceof Error ? error : undefined
      );
    }
  }
  
  /**
   * Reads both ID and key, properly handling different file arrangements:
   * - Combined file with both ID and key
   * - Separate ID file and key file (.key extension)
   * 
   * @param idFilename - Path to ID file
   * @param keyFilename - Optional path to key file (defaults to idFilename + '.key')
   * @returns Promise resolving to object with id and key properties
   * @throws ZeroError if files cannot be read or parsed
   */
  public static async readIdAndKey(
    idFilename: string,
    keyFilename?: string
  ): Promise<OutputData> {
    try {
      // Read ID first
      const id = await this.readId(idFilename);
      
      // Determine key file name if not explicitly provided
      const actualKeyFilename = keyFilename || `${idFilename}.key`;
      
      // Try to read key file, falling back to embedded key in ID file
      try {
        const key = await this.readKey(actualKeyFilename);
        return { id, key };
      } catch (keyError) {
        // If key file not found, check if ID file contains embedded key
        try {
          const idContent = await fs.readFile(idFilename, 'utf8');
          const key = this.extractKeyFromIdContent(idContent);
          if (key) {
            return { id, key };
          }
        } catch (extractError) {
          // Ignore extraction errors, will throw original key error below
        }
        
        // If key is required but not found, re-throw the original error
        throw keyError;
      }
    } catch (error) {
      if (error instanceof ZeroError) {
        throw error;
      }
      
      throw new ZeroError(
        ZeroErrorCode.IO_ERROR,
        `Failed to read ID/key pair`,
        { idFilename, keyFilename },
        error instanceof Error ? error : undefined
      );
    }
  }
  
  /**
   * Writes ID and optional key to files
   * 
   * @param filename - Base filename for output
   * @param data - ID and optional key data
   * @param format - Output format (default: text)
   * @returns Promise resolving when writing is complete
   * @throws ZeroError if files cannot be written
   */
  public static async writeOutput(
    filename: string,
    data: OutputData,
    format: FileFormat = FileFormat.TEXT
  ): Promise<void> {
    try {
      // Create directory if it doesn't exist
      await fs.mkdir(path.dirname(filename), { recursive: true });
      
      // Write ID file
      switch (format) {
        case FileFormat.JSON:
          await this.writeJsonId(filename, data.id);
          break;
        case FileFormat.BINARY:
          await this.writeBinaryId(filename, data.id);
          break;
        case FileFormat.TEXT:
        default:
          await this.writeTextId(filename, data.id);
          break;
      }
      
      // Write key file if present
      if (data.key) {
        const keyFilename = `${filename}.key`;
        
        switch (format) {
          case FileFormat.JSON:
            await this.writeJsonKey(keyFilename, data.key);
            break;
          case FileFormat.BINARY:
            await this.writeBinaryKey(keyFilename, data.key);
            break;
          case FileFormat.TEXT:
          default:
            await this.writeTextKey(keyFilename, data.key);
            break;
        }
      }
    } catch (error) {
      if (error instanceof ZeroError) {
        throw error;
      }
      
      throw new ZeroError(
        ZeroErrorCode.IO_ERROR,
        `Failed to write output to ${filename}`,
        { filename, format },
        error instanceof Error ? error : undefined
      );
    }
  }
  
  /**
   * Writes a binary buffer to file
   * 
   * @param filename - Path to output file
   * @param buffer - Buffer to write
   * @returns Promise resolving when writing is complete
   */
  public static async writeBuffer(filename: string, buffer: Buffer): Promise<void> {
    try {
      await fs.writeFile(filename, buffer);
    } catch (error) {
      throw new ZeroError(
        ZeroErrorCode.IO_ERROR,
        `Failed to write to file ${filename}`,
        { filename, bufferSize: buffer.length },
        error instanceof Error ? error : undefined
      );
    }
  }
  
  // === ID Parsing Methods ===
  
  /**
   * Parses ID from text format
   */
  private static parseTextId(content: string): IZeroId {
    const lines = content.split('\n');
    let version: number | undefined;
    let hash: Buffer | undefined;
    let salt: Buffer | undefined;
    
    for (const line of lines) {
      if (line.startsWith('#') || !line.trim()) continue;
      
      const colonIndex = line.indexOf(':');
      if (colonIndex === -1) continue;
      
      const key = line.substring(0, colonIndex).trim().toLowerCase();
      const value = line.substring(colonIndex + 1).trim();
      
      switch (key) {
        case 'version':
          version = parseInt(value, 10);
          break;
        case 'hash':
          hash = Buffer.from(value, 'hex');
          break;
        case 'salt':
          salt = Buffer.from(value, 'hex');
          break;
      }
    }
    
    if (version === undefined || !hash || !salt) {
      throw new ZeroError(
        ZeroErrorCode.INVALID_FORMAT,
        'Missing required ID fields in text format',
        { 
          hasVersion: version !== undefined,
          hasHash: !!hash,
          hasSalt: !!salt
        }
      );
    }
    
    return { version, hash, salt };
  }
  
  /**
   * Parses ID from JSON format
   */
  private static parseJsonId(content: string): IZeroId {
    try {
      const data = JSON.parse(content);
      
      // Check for ID in root or nested in id property
      const idData = data.id || data;
      
      if (!idData.version || !idData.hash || !idData.salt) {
        throw new ZeroError(
          ZeroErrorCode.INVALID_FORMAT,
          'Missing required ID fields in JSON',
          { 
            hasVersion: !!idData.version,
            hasHash: !!idData.hash,
            hasSalt: !!idData.salt
          }
        );
      }
      
      // Parse version as number, hash and salt from base64
      const version = parseInt(idData.version, 10);
      const hash = Buffer.from(idData.hash, 'base64');
      const salt = Buffer.from(idData.salt, 'base64');
      
      return { version, hash, salt };
    } catch (error) {
      if (error instanceof ZeroError) {
        throw error;
      }
      
      throw new ZeroError(
        ZeroErrorCode.INVALID_FORMAT,
        'Failed to parse JSON ID format',
        {},
        error instanceof Error ? error : undefined
      );
    }
  }
  
  /**
   * Parses ID from binary format
   */
  private static parseBinaryId(buffer: Buffer): IZeroId {
    try {
      // Binary format: [version(1)] [hash_size(4)] [hash(hash_size)] [salt_size(4)] [salt(salt_size)]
      if (buffer.length < 9) { // Minimum size: 1 + 4 + 0 + 4 + 0
        throw new ZeroError(
          ZeroErrorCode.INVALID_FORMAT,
          'Binary ID data too small',
          { bufferLength: buffer.length }
        );
      }
      
      let offset = 0;
      
      // Read version (1 byte)
      const version = buffer.readUInt8(offset);
      offset += 1;
      
      // Read hash size (4 bytes)
      const hashSize = buffer.readUInt32LE(offset);
      offset += 4;
      
      // Read hash (hashSize bytes)
      if (offset + hashSize > buffer.length) {
        throw new ZeroError(
          ZeroErrorCode.INVALID_FORMAT,
          'Buffer too small for hash',
          { hashSize, bufferLength: buffer.length, offset }
        );
      }
      const hash = Buffer.alloc(hashSize);
      buffer.copy(hash, 0, offset, offset + hashSize);
      offset += hashSize;
      
      // Read salt size (4 bytes)
      if (offset + 4 > buffer.length) {
        throw new ZeroError(
          ZeroErrorCode.INVALID_FORMAT,
          'Buffer too small for salt size',
          { bufferLength: buffer.length, offset }
        );
      }
      const saltSize = buffer.readUInt32LE(offset);
      offset += 4;
      
      // Read salt (saltSize bytes)
      if (offset + saltSize > buffer.length) {
        throw new ZeroError(
          ZeroErrorCode.INVALID_FORMAT,
          'Buffer too small for salt',
          { saltSize, bufferLength: buffer.length, offset }
        );
      }
      const salt = Buffer.alloc(saltSize);
      buffer.copy(salt, 0, offset, offset + saltSize);
      
      return { version, hash, salt };
    } catch (error) {
      if (error instanceof ZeroError) {
        throw error;
      }
      
      throw new ZeroError(
        ZeroErrorCode.INVALID_FORMAT,
        'Failed to parse binary ID format',
        {},
        error instanceof Error ? error : undefined
      );
    }
  }
  
  // === Key Parsing Methods ===
  
  /**
   * Parses key from text format
   */
  private static parseTextKey(content: string): IZeroKey {
    const lines = content.split('\n');
    let hash: Buffer | undefined;
    let timestamp: number | undefined;
    let expirationTime: number | undefined;
    
    for (const line of lines) {
      if (line.startsWith('#') || !line.trim()) continue;
      
      const [key, ...valueParts] = line.split(':');
      const value = valueParts.join(':').trim();
      
      switch (key.trim().toLowerCase()) {
        case 'hash':
          hash = Buffer.from(value, 'hex');
          break;
        case 'timestamp':
          timestamp = parseInt(value, 10);
          break;
        case 'expires':
        case 'expirationtime':
          if (value.toLowerCase() !== 'never' && value !== '0') {
            expirationTime = parseInt(value, 10);
          }
          break;
      }
    }
    
    if (!hash || !timestamp) {
      throw new ZeroError(
        ZeroErrorCode.INVALID_FORMAT,
        'Missing required key fields in text format',
        { 
          hasHash: !!hash,
          hasTimestamp: !!timestamp
        }
      );
    }
    
    return { hash, timestamp, expirationTime };
  }
  
  /**
   * Parses key from JSON format
   */
  private static parseJsonKey(content: string): IZeroKey {
    try {
      const data = JSON.parse(content);
      
      // Check for key in root or nested in key property
      const keyData = data.key || data;
      
      if (!keyData.hash || keyData.timestamp === undefined) {
        throw new ZeroError(
          ZeroErrorCode.INVALID_FORMAT,
          'Missing required key fields in JSON',
          { 
            hasHash: !!keyData.hash,
            hasTimestamp: keyData.timestamp !== undefined
          }
        );
      }
      
      // Parse fields
      const hash = Buffer.from(keyData.hash, 'base64');
      const timestamp = parseInt(keyData.timestamp, 10);
      const expirationTime = keyData.expirationTime ? parseInt(keyData.expirationTime, 10) : undefined;
      
      return { hash, timestamp, expirationTime };
    } catch (error) {
      if (error instanceof ZeroError) {
        throw error;
      }
      
      throw new ZeroError(
        ZeroErrorCode.INVALID_FORMAT,
        'Failed to parse JSON key format',
        {},
        error instanceof Error ? error : undefined
      );
    }
  }
  
  /**
   * Parses key from binary format
   */
  private static parseBinaryKey(buffer: Buffer): IZeroKey {
    try {
      // Binary format: [hash_size(4)] [hash(hash_size)] [timestamp(8)] [expiration(8)?]
      if (buffer.length < 12) { // Minimum size: 4 + 0 + 8
        throw new ZeroError(
          ZeroErrorCode.INVALID_FORMAT,
          'Binary key data too small',
          { bufferLength: buffer.length }
        );
      }
      
      let offset = 0;
      
      // Read hash size (4 bytes)
      const hashSize = buffer.readUInt32LE(offset);
      offset += 4;
      
      // Read hash (hashSize bytes)
      if (offset + hashSize > buffer.length) {
        throw new ZeroError(
          ZeroErrorCode.INVALID_FORMAT,
          'Buffer too small for hash',
          { hashSize, bufferLength: buffer.length, offset }
        );
      }
      const hash = Buffer.alloc(hashSize);
      buffer.copy(hash, 0, offset, offset + hashSize);
      offset += hashSize;
      
      // Read timestamp (8 bytes)
      if (offset + 8 > buffer.length) {
        throw new ZeroError(
          ZeroErrorCode.INVALID_FORMAT,
          'Buffer too small for timestamp',
          { bufferLength: buffer.length, offset }
        );
      }
      const timestamp = Number(buffer.readBigUInt64LE(offset));
      offset += 8;
      
      // Read expiration time if present (8 bytes)
      let expirationTime: number | undefined;
      if (offset + 8 <= buffer.length) {
        const expTimeValue = Number(buffer.readBigUInt64LE(offset));
        if (expTimeValue > 0) {
          expirationTime = expTimeValue;
        }
      }
      
      return { hash, timestamp, expirationTime };
    } catch (error) {
      if (error instanceof ZeroError) {
        throw error;
      }
      
      throw new ZeroError(
        ZeroErrorCode.INVALID_FORMAT,
        'Failed to parse binary key format',
        {},
        error instanceof Error ? error : undefined
      );
    }
  }
  
  // === Writing Methods ===
  
  /**
   * Writes ID in text format
   */
  private static async writeTextId(filename: string, id: IZeroId): Promise<void> {
    const content = [
      '# Zero Identity File',
      `version: ${id.version}`,
      `hash: ${id.hash.toString('hex')}`,
      `salt: ${id.salt.toString('hex')}`,
      '' // Add empty line at end of file
    ].join('\n');
    
    await fs.writeFile(filename, content, 'utf8');
  }
  
  /**
   * Writes ID in JSON format
   */
  private static async writeJsonId(filename: string, id: IZeroId): Promise<void> {
    const data = {
      version: id.version,
      hash: id.hash.toString('base64'),
      salt: id.salt.toString('base64'),
      created: new Date().toISOString()
    };
    
    await fs.writeFile(filename, JSON.stringify(data, null, 2), 'utf8');
  }
  
  /**
   * Writes ID in binary format
   */
  private static async writeBinaryId(filename: string, id: IZeroId): Promise<void> {
    // Binary format: [version(1)] [hash_size(4)] [hash(hash_size)] [salt_size(4)] [salt(salt_size)]
    const versionBuffer = Buffer.alloc(1);
    versionBuffer.writeUInt8(id.version);
    
    const hashSizeBuffer = Buffer.alloc(4);
    hashSizeBuffer.writeUInt32LE(id.hash.length);
    
    const saltSizeBuffer = Buffer.alloc(4);
    saltSizeBuffer.writeUInt32LE(id.salt.length);
    
    const buffer = Buffer.concat([
      versionBuffer,
      hashSizeBuffer,
      id.hash,
      saltSizeBuffer,
      id.salt
    ]);
    
    await fs.writeFile(filename, buffer);
  }
  
  /**
   * Writes key in text format
   */
  private static async writeTextKey(filename: string, key: IZeroKey): Promise<void> {
    const content = [
      '# Zero Key File',
      `hash: ${key.hash.toString('hex')}`,
      `timestamp: ${key.timestamp}`,
      key.expirationTime ? `expires: ${key.expirationTime}` : 'expires: never',
      '' // Add empty line at end of file
    ].join('\n');
    
    await fs.writeFile(filename, content, 'utf8');
  }
  
  /**
   * Writes key in JSON format
   */
  private static async writeJsonKey(filename: string, key: IZeroKey): Promise<void> {
    const data = {
      hash: key.hash.toString('base64'),
      timestamp: key.timestamp,
      expirationTime: key.expirationTime
    };
    
    await fs.writeFile(filename, JSON.stringify(data, null, 2), 'utf8');
  }
  
  /**
   * Writes key in binary format
   */
  private static async writeBinaryKey(filename: string, key: IZeroKey): Promise<void> {
    // Binary format: [hash_size(4)] [hash(hash_size)] [timestamp(8)] [expiration(8)?]
    const hashSizeBuffer = Buffer.alloc(4);
    hashSizeBuffer.writeUInt32LE(key.hash.length);
    
    const timestampBuffer = Buffer.alloc(8);
    timestampBuffer.writeBigUInt64LE(BigInt(key.timestamp));
    
    let expirationBuffer: Buffer | undefined;
    if (key.expirationTime) {
      expirationBuffer = Buffer.alloc(8);
      expirationBuffer.writeBigUInt64LE(BigInt(key.expirationTime));
    }
    
    const buffer = Buffer.concat([
      hashSizeBuffer,
      key.hash,
      timestampBuffer,
      ...(expirationBuffer ? [expirationBuffer] : [])
    ]);
    
    await fs.writeFile(filename, buffer);
  }
  
  // === Helper Methods ===
  
  /**
   * Extracts key data from ID file content if present
   */
  private static extractKeyFromIdContent(content: string): IZeroKey | null {
    const lines = content.split('\n');
    let hash: Buffer | undefined;
    let timestamp: number | undefined;
    let expirationTime: number | undefined;
    
    for (const line of lines) {
      if (line.startsWith('#') || !line.trim()) continue;
      
      if (line.trim().toLowerCase().startsWith('key:')) {
        // Key is embedded in the ID file
        const keyStr = line.substring(line.indexOf(':') + 1).trim();
        const parts = keyStr.split('.');
        
        if (parts.length >= 2) {
          try {
            // Common format: hash.timestamp.expiration
            hash = Buffer.from(parts[0], 'hex');
            timestamp = parseInt(parts[1], 10);
            
            if (parts.length >= 3 && parts[2] !== 'never') {
              expirationTime = parseInt(parts[2], 10);
            }
            
            if (hash && timestamp) {
              return { hash, timestamp, expirationTime };
            }
          } catch (err) {
            // Ignore parsing errors
          }
        }
      }
    }
    
    return null;
  }
  
  /**
   * Checks if buffer appears to be binary format
   */
  private static isBinaryFormat(buffer: Buffer): boolean {
    // Check for typical binary format indicators
    // In our format, first byte is version (usually 1)
    // followed by 4 bytes of hash size
    if (buffer.length >= 5) {
      const version = buffer.readUInt8(0);
      const hashSize = buffer.readUInt32LE(1);
      
      // Reasonable constraints for version and hash size
      return (version >= 1 && version <= 10) && 
             (hashSize >= 16 && hashSize <= 128) &&
             (buffer.length >= hashSize + 9); // +1 version, +4 hash size, +4 salt size
    }
    
    return false;
  }
}