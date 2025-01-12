// packages/shared/src/errors/typeGuards.ts

import { BaseError } from './BaseError';

export function isValidationError(error: BaseError): error is BaseError & { errors: string[] } {
  return 'errors' in error && Array.isArray(error.errors);
}
