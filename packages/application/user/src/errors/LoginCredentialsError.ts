// src/application/user/errors/EmailAlreadyInUseError.ts
import { ConflictError } from '@kikerepo/contracts-common'; // Import the ValidationError from contracts

export class LoginCredentialsError extends ConflictError {
  constructor() {
    // Create a detailed validation error for the email
   super();
   this.message = 'Invalid login credentials';

    // Call the parent constructor to set the message and validation errors

  }
}
