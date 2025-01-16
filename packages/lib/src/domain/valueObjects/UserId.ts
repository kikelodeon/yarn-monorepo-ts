// packages/shared/src/domain/valueObjects/UserId.ts

import { ValueObject } from './ValueObject';
import { generateUUIDv6 } from '../../utils';

/**
 * Value Object representing the ID of a User Entity.
 */
export class UserId extends ValueObject<string> {
  constructor(id?: string) {
    super(id ? id : generateUUIDv6());

    if (!this.isValidUUID(this.value)) {
      throw new Error('Invalid UserId: Must be a valid UUID.');
    }
  }

  /**
   * Validates whether the provided ID is a valid UUID.
   * @param id - The ID to validate.
   * @returns True if the ID is valid, false otherwise.
   */
  private isValidUUID(id: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  }
}
