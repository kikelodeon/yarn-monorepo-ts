// packages/shared/src/domain/aggregateRoots/AggregateRoot.ts

import { Entity } from '../entities/Entity';
import { ValueObject } from '../valueObjects/ValueObject';
import { DomainEvent } from '../events/DomainEvent';

export abstract class AggregateRoot<TId extends ValueObject<string>> extends Entity<TId> {
  private readonly _domainEvents: DomainEvent[] = [];

  /**
   * Adds a new domain event to the aggregate.
   * @param event The domain event to add.
   */
  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  /**
   * Returns all domain events emitted by this aggregate.
   * @returns A copy of the list of domain events.
   */
  public get domainEvents(): DomainEvent[] {
    return [...this._domainEvents];
  }

  /**
   * Clears all domain events from the aggregate.
   */
  public clearDomainEvents(): void {
    this._domainEvents.length = 0;
  }
}
