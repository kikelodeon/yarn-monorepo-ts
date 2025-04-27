// packages/common-domain/src/DomainEventPayload.ts
import { ValueObject } from '../ValueObject';
import { DomainEvent } from '../DomainEvent';

/**
 * Value Object representing the serialized payload of a Domain Event.
 * Provides method to reconstruct the original DomainEvent instance.
 */
export class FallbackEventPayload extends ValueObject<Record<string, any>> {
  /**
   * @param payload A JSON-serializable object representing event data
   * @throws if payload is null or not an object
   * @remarks This payload will be stored in the database as a JSON field.
   */
  constructor(payload: Record<string, any>) {
    if (payload === null || typeof payload !== 'object' || Array.isArray(payload)) {
      throw new Error(
        `Invalid DomainEventPayload: must be a non-null object, received ${typeof payload}`
      );
    }
    super(payload);
  }

  /**
   * Reconstructs a DomainEvent instance using a factory method from the event class.
   * @param ctor The DomainEvent subclass with a static 'fromPrimitives' method
   * @returns An instance of the specific DomainEvent
   */
  public toDomainEvent<T extends DomainEvent>(
    ctor: { fromPrimitives(data: Record<string, any>): T }
  ): T {
    if (typeof ctor.fromPrimitives !== 'function') {
      throw new Error(
        'DomainEvent constructor must implement static fromPrimitives(data)'
      );
    }
    return ctor.fromPrimitives(this.value);
  }

  /**
   * Returns the raw payload object.
   */
  public toObject(): Record<string, any> {
    // deep clone to prevent mutation
    return JSON.parse(JSON.stringify(this.value));
  }

  /**
   * Returns a value suitable for storing in a Prisma JSON column.
   */
  public toPrismaJson(): Record<string, any> {
    return this.toObject();
  }

  /**
   * Serializes the payload to JSON string.
   */
  public toJSON(): string {
    return JSON.stringify(this.value);
  }
}
