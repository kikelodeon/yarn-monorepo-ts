// packages/common-domain/src/DomainEventRetries.ts
import { ValueObject } from '../ValueObject';

/**
 * Value Object representing the retry count for a Domain Event.
 */
export class FallbackEventRetries extends ValueObject<number> {
  /**
   * Create a new DomainEventRetries.
   * @param retries Number of retries (default 0).
   * @throws Error if retries is not a non-negative integer.
   */
  constructor(retries: number = 0) {
    if (!Number.isInteger(retries) || retries < 0) {
      throw new Error(`Invalid retry count: ${retries}. Must be a non-negative integer.`);
    }
    super(retries);
  }

  /**
   * Factory to create from any number, enforcing validation.
   */
  public static fromNumber(retries: number): FallbackEventRetries {
    return new FallbackEventRetries(retries);
  }

  /**
   * Return the retry count as a number.
   */
  public toNumber(): number {
    return this.value;
  }

  /**
   * Increment the retry count by 1.
   * Returns a new DomainEventRetries instance.
   */
  public increment(): FallbackEventRetries {
    return new FallbackEventRetries(this.value + 1);
  }

  /**
   * String representation of the retry count.
   */
  public toString(): string {
    return this.value.toString();
  }
}
