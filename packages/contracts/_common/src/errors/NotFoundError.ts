import { BaseError } from './BaseError';

export class NotFoundError extends BaseError {
  constructor(message: string = 'An internal server error occurred', context?: any) {
    super(message, 404, 'NOUT FOUND', context); // Llamamos al constructor de BaseError
  }
}
