// src/application/user/errors/EmailAlreadyInUseError.ts
import { ValidationError } from '@kikerepo/contracts-common'; // Import the ValidationError from contracts

export class EmailAlreadyInUseError extends ValidationError {
  constructor(email: string) {
    // Create a detailed validation error for the email
    const validationErrors = {
      email: [`The email ${email} is already in use`],
    };

    // Call the parent constructor to set the message and validation errors
    super(validationErrors, { email });
  }
}
