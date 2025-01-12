import { BaseError } from './BaseError';

export class NotFoundError extends BaseError {
  constructor(description: string) {
    super('NotFoundError', 404, true, description);
  }
}
