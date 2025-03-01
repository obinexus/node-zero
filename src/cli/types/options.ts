// src/cli/types/options.ts

/**
 * Common CLI command options
 */
export interface CommonOptions {
    verbose?: boolean;
  }
  
  /**
   * Output format options
   */
  export enum OutputFormat {
    TEXT = 'text',
    JSON = 'json',
    BINARY = 'binary'
  }