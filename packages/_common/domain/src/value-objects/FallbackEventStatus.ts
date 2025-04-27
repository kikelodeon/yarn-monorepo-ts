// packages/common-domain/src/DomainEventStatus.ts
import { ValueObject } from '../ValueObject';

/**
 * Enum for domain event processing status.
 */
export enum FallbackEventStatusEnum {
  PENDING = 'PENDING',
  PROCESSED = 'PROCESSED',
  FAILED = 'FAILED',
}

/**
 * Value Object representing the status of a Domain Event.
 */
export class FallbackEventStatus extends ValueObject<FallbackEventStatusEnum> {
  constructor(status: FallbackEventStatusEnum = FallbackEventStatusEnum.PENDING) {
    super(status);
  }

  /**
   * Factory to create from string, with validation.
   */
  public static fromString(status: string): FallbackEventStatus {
    if (!Object.values(FallbackEventStatusEnum).includes(status as FallbackEventStatusEnum)) {
      throw new Error(`Invalid DomainEventStatus: ${status}`);
    }
    return new FallbackEventStatus(status as FallbackEventStatusEnum);
  }
 
  /**
   * Return the raw enum value.
   */
  public toString(): string {
    return this.value;
  }
}
