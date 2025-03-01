import { ValidationError } from './ValidationError';

/**
 * Represents the result of a configuration validation
 */
export class ValidationResult {
  /**
   * List of validation errors
   */
  private _errors: ValidationError[] = [];

  /**
   * Indicates whether the validation was successful
   */
  get isValid(): boolean {
    return this._errors.length === 0;
  }

  /**
   * Gets all validation errors
   * 
   * @returns Array of validation errors
   */
  getErrors(): ValidationError[] {
    return [...this._errors];
  }

  /**
   * Checks if there are any validation errors
   * 
   * @returns True if there are errors, false otherwise
   */
  hasErrors(): boolean {
    return this._errors.length > 0;
  }

  /**
   * Adds a new validation error
   * 
   * @param path - The path to the invalid configuration property
   * @param message - Descriptive error message
   * @param code - Optional error code
   */
  addError(path: string, message: string, code?: string): void {
    this._errors.push(new ValidationError(path, message, code));
  }

  /**
   * Merges errors from another ValidationResult
   * 
   * @param otherResult - Another validation result to merge
   */
  merge(otherResult: ValidationResult): void {
    otherResult.getErrors().forEach(error => 
      this._errors.push(error)
    );
  }
}