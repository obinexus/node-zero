/**
 * Represents a specific validation error
 */
export class ValidationError {
    /**
     * Creates a new ValidationError instance
     * 
     * @param path - The path to the invalid configuration property
     * @param message - Descriptive error message
     * @param code - Optional error code for more specific error identification
     */
    constructor(
      public path: string,
      public message: string,
      public code?: string
    ) {}
  
    /**
     * Converts the validation error to a string representation
     * 
     * @returns A formatted error string
     */
    toString(): string {
      const codeStr = this.code ? `[${this.code}] ` : '';
      return `${codeStr}${this.path}: ${this.message}`;
    }
  }