import { BaseError } from './BaseError';

export class NotFoundError extends BaseError {
  constructor(message: string = 'The resource was not found.', context?: any) {
    super(message, 404, 'NOT FOUND', context); // Llamamos al constructor de BaseError
  }
}
