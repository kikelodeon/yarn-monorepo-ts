// packages/contracts/common/src/errors/ValidationError.ts
import { BaseError } from './BaseError';

export class ValidationError extends BaseError {
  public readonly validationErrors: Record<string, string[]>;

  constructor(validationErrors: Record<string, string[]>) {
    super('One or more validation errors occurred.', 400);
    this.validationErrors = validationErrors;
  }

  /**
   * Converts the ValidationError into a JSON-serializable format.
   */
  toJSON(): {
    message: string;
    code: string;
    statusCode: number;
    validationErrors: Record<string, string[]>;
  } {
    return {
      message: this.message,
      code: 'VALIDATION_ERROR', // Add a static error code for ValidationError
      statusCode: this.statusCode,
      validationErrors: this.validationErrors,
    };
  }
}
