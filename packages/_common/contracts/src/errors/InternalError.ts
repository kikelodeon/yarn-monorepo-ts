import { BaseError } from './BaseError';

export class InternalError extends BaseError {
  constructor(message: string = 'An internal server error occurred', context?: any) {
    super(message, 500, 'INTERNAL_ERROR', context); // Llamamos al constructor de BaseError
  }
}
