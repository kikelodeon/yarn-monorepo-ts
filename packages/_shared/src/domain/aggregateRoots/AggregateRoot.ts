// packages/shared/src/domain/aggregateRoots/AggregateRoot.ts

import { Entity } from '../entities/Entity';
import { ValueObject } from '../valueObjects/ValueObject';
export abstract class AggregateRoot<TId extends ValueObject<string>> extends Entity<TId> {
  // Additional behaviors specific to Aggregate Roots can be added here
}
