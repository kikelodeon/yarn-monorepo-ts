import { generateUUIDv6 } from '@kikerepo/utils-uuid6';
export abstract class DomainEvent {
  public readonly occurredAt: Date;
  public readonly eventId: string;

  constructor() {
    this.occurredAt = new Date();
    this.eventId = generateUUIDv6();
  }

  abstract eventName(): string; // Each event should define its own name
}
