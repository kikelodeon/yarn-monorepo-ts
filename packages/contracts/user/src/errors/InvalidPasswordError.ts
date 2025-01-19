
import { BaseError, ValidationError } from '@kikerepo/contracts-common';

export class InvalidPasswordError extends ValidationError {
  constructor() {
    super({ password: ['Password must be at least 8 characters long.'] });
  }
}