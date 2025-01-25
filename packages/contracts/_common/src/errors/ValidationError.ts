import { BaseError } from './BaseError';

export class ValidationError extends BaseError {
  public readonly validationErrors: Record<string, string[]>;

  constructor(validationErrors: Record<string, string[]>, context?: any) {
    // Usamos el constructor de BaseError, agregamos un mensaje y el código de estado 400 para errores de validación
    super('One or more validation errors occurred.', 400, 'VALIDATION_ERROR', context);
    this.validationErrors = validationErrors;
  }

  /**
   * Converts the ValidationError into a JSON-serializable format.
   */
  toJSON() {
    return {
      message: this.message,
      code: this.errorCode,  // Usamos errorCode en lugar de un valor estático
      statusCode: this.statusCode,
      timestamp: this.timestamp,  // Agregamos el timestamp de la clase base
      validationErrors: this.validationErrors,
      context: this.context,  // Contexto adicional si se pasó
    };
  }
}
