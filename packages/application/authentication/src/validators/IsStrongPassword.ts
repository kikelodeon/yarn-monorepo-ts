// src/shared/validation/decorators/IsStrongPassword.ts
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsStrongPassword(
  minLength: number = 8,  // Default to 8 if not provided
  maxLength: number = 20, // Default to 20 if not provided
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isStrongPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        /**
         * Validate the password to ensure it meets the strong password criteria.
         * @param value - The password value to validate.
         * @param args - The validation arguments.
         * @returns `true` if the password meets the requirements, otherwise `false`.
         */
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;

          // Password validation regex with min and max length constraints
          const strongPasswordRegex = new RegExp(
            `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?#&])[A-Za-z\\d@$!%*?#&]{${minLength},${maxLength}}$`
          );

          return strongPasswordRegex.test(value);
        },

        /**
         * Default error message for password validation failure.
         * @param args - The validation arguments.
         * @returns A custom error message explaining the password criteria.
         */
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be between ${minLength} and ${maxLength} characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.`;
        },
      },
    });
  };
}
