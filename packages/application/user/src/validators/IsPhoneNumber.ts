// src/shared/validation/decorators/IsPhoneNumber.ts
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

/**
 * Custom decorator to validate phone numbers, automatically extracting the country code.
 * @param validationOptions - Optional validation options.
 */
export function IsPhoneNumberCustom(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isPhoneNumberCustom',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        /**
         * Validates the phone number by parsing it and automatically detecting the country code.
         * @param value - The phone number string to validate.
         * @param args - Validation arguments.
         * @returns `true` if the phone number is valid, otherwise `false`.
         */
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;

          // Parse the phone number and automatically detect the country code
          const phoneNumber = parsePhoneNumberFromString(value);

          // Ensure phone number is valid
          return phoneNumber ? phoneNumber.isValid() : false;
        },

        /**
         * Default error message when the phone number is invalid.
         * @param args - The validation arguments.
         * @returns A message indicating the validation failure.
         */
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid phone number.`;
        },
      },
    });
  };
}
