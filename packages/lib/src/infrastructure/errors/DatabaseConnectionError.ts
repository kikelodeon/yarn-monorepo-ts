// packages/shared/src/infrastructure/errors/DatabaseConnectionError.ts

import { BaseError } from '../../errors/BaseError';

export class DatabaseConnectionError extends BaseError {
  constructor(description: string) {
    super('DatabaseConnectionError', 500, false, description);
  }
}
