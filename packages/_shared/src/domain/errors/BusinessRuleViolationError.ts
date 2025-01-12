// packages/shared/src/domain/errors/BusinessRuleViolationError.ts

import { BaseError } from '../../errors/BaseError';

export class BusinessRuleViolationError extends BaseError {
  constructor(description: string) {
    super('BusinessRuleViolationError', 400, true, description);
  }
}
