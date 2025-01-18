
import { ValueObject } from '@kikerepo/domain-common';
import { generateUUIDv6 } from '@kikerepo/utils-uuid6';

/**
 * Value Object representing the ID of a Session Entity.
 */
export class SessionId extends ValueObject<string> {
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
