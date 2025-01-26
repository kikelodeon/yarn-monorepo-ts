import { BaseError } from './BaseError';

export class ConflictError extends BaseError {
  constructor(message: string = 'An internal server error occurred', context?: any) {
    super(message, 409, 'CONFLICT', context); // Llamamos al constructor de BaseError
  }
}
