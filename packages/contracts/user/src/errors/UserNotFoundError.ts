
import { BaseError } from '@kikerepo/contracts-common';

export class UserNotFoundError extends BaseError {
  constructor() {
    super('User not found', 404); // HTTP 404 Not Found
  }

  toJSON() {
    return {
      message: this.message,
      code: 'USER_NOT_FOUND',
      statusCode: this.statusCode,
    };
  }
}