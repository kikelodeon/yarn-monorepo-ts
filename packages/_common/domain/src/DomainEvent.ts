import { generateUUIDv6 } from '@kikerepo/utils-uuid6';
export abstract class DomainEvent {
  public readonly occurredAt: Date;
  public readonly id: string;

  constructor() {
    this.occurredAt = new Date();
    this.id = generateUUIDv6();
  }
  abstract toJson(): string; // Each event should define its own name
  abstract eventName(): string; // Each event should define its own name
}
