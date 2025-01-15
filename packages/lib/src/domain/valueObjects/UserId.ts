// packages/shared/src/domain/valueObjects/UserId.ts

import { ValueObject } from './ValueObject';
import { generateUUIDv6 } from '../../utils'

/**
 * Value Object representing the ID of a User Entity.
 */
export class UserId extends ValueObject<string> {
  /**
   * Constructs a new UserId.
   * @param id - Optional. If not provided, a new UUID v6 is generated.
   */
  constructor(id?: string) {
    super(id ?? generateUUIDv6());
  }

  /**
   * Returns the string representation of the UserId.
   */
  public toString(): string {
    return this.props;
  }

  /**
   * Static factory method to create a UserId from a string.
   * Useful for reconstructing UserId from persistence layers.
   * @param id - The ID string.
   * @returns A new UserId instance.
   */
  public static fromString(id: string): UserId {
    // You can add validation here if necessary
    return new UserId(id);
  }
}
