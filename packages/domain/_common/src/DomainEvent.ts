export abstract class DomainEvent {
  public readonly occurredAt: Date;
  public readonly eventId: string;

  constructor() {
    this.occurredAt = new Date();
    this.eventId = DomainEvent.generateId();
  }

  private static generateId(): string {
    // Generate a unique identifier for the event (can be UUID or similar)
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  abstract eventName(): string; // Each event should define its own name
}
