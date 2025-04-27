// packages/common-domain/src/DomainEventName.ts
import { ValueObject } from '../ValueObject';

/**
 * Value Object representing the name of a Domain Event.
 */
export class FallbackEventName extends ValueObject<string> {
  /**
   * Create a new DomainEventName.
   * @param name The name of the domain event (e.g. 'UserCreatedEvent').
   * @throws Error if the name is empty or not a valid string identifier.
   */
  constructor(name: string) {
    if (typeof name !== 'string' || name.trim().length === 0) {
      throw new Error(`Invalid DomainEventName: "${name}"`);
    }
    super(name);
  }

  /**
   * Factory from raw string, trimming whitespace.
   */
  public static fromString(name: string): FallbackEventName {
    return new FallbackEventName(name.trim());
  }

  /**
   * Returns the event name.
   */
  public toString(): string {
    return this.value;
  }
}
