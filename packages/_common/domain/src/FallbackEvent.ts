// packages/common-domain/src/FallbackEvent.ts
import { AggregateRoot } from './AggregateRoot';
import {
  CreationDate,
  DeletionDate,
  FallbackEventId,
  FallbackEventRetries,
  FallbackEventStatus,
  FallbackEventName,
  FallbackEventPayload,
} from './value-objects';

/**
 * Domain event used for buffering failed Kafka publishes.
 */
export class FallbackEvent extends AggregateRoot<FallbackEventId> {
  public readonly name: FallbackEventName;
  public readonly payload: FallbackEventPayload;
  public readonly status: FallbackEventStatus;
  public readonly retries: FallbackEventRetries;

  /**
   * Private constructor: use static factories to create or rehydrate.
   */
  private constructor(
    id: FallbackEventId,
    name: FallbackEventName,
    payload: FallbackEventPayload,
    status: FallbackEventStatus,
    retries: FallbackEventRetries,
    creationDate?: CreationDate,
    deletionDate?: DeletionDate,
  ) {
    super(id, creationDate, deletionDate);
    this.name = name;
    this.payload = payload;
    this.status = status;
    this.retries = retries;
  }

  /**
   * Factory to create a brand-new pending event.
   */
  public static createUnique(
    name: FallbackEventName,
    payload: FallbackEventPayload,
  ): FallbackEvent {
    const id = new FallbackEventId();
    const status = new FallbackEventStatus();           // defaults to PENDING
    const retries = new FallbackEventRetries();         // defaults to 0
    return new FallbackEvent(id, name, payload, status, retries, new CreationDate(), undefined);
  }

  /**
   * Rehydrate an event from persisted data.
   */
  public static rehydrate(
    raw: {
      id: string;
      name: string;
      payload: Record<string, any>;
      status: string;
      retries: number;
      creationDate: Date;
      deletionDate?: Date;
    }
  ): FallbackEvent {
    const id =  new FallbackEventId(raw.id);
    const name = new FallbackEventName(raw.name);
    const payload =  new FallbackEventPayload((raw.payload));
    const status = FallbackEventStatus.fromString(raw.status);
    const retries = FallbackEventRetries.fromNumber(raw.retries);
    const creationDate = new CreationDate(raw.creationDate);
    const deletionDate = raw.deletionDate ? new DeletionDate(raw.deletionDate) : undefined;
    return new FallbackEvent(id, name, payload, status, retries, creationDate, deletionDate);
  }

  /**
   * Convert domain event to primitives for persistence.
   */
  public toPrimitives(): Record<string, any> {
    return {
      id: this.id.value,
      name: this.name.toString(),
      payload: this.payload.toPrismaJson(),
    };
  }
}
