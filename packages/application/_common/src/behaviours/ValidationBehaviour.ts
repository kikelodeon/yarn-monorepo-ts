// src/application/common/services/ValidationService.ts
import { validate } from 'class-validator'; // validate function from class-validator
import { ValidationError } from '@kikerepo/contracts-common'; // Custom error class

export class ValidationBehaviour {
  /**
   * Validate an object based on class-validator decorators.
   * @param target - The object to validate (must be an instance of a class with class-validator decorators).
   * @throws ValidationError - If validation fails, an error is thrown with the formatted errors.
   */
  public async validate<T extends object>(target: T): Promise<void> {
    // Perform the validation using class-validator
    const validationErrors = await validate(target);

    if (validationErrors.length > 0) {
      // Map validation errors into Record<string, string[]>
      const formattedErrors: Record<string, string[]> = {};

      validationErrors.forEach((error) => {
        const property = error.property;
        const messages = error.constraints ? Object.values(error.constraints) : [];
        formattedErrors[property] = messages;
      });

      // Throw a formatted validation error
      throw new ValidationError(formattedErrors);
    }
  }
}
