// packages/shared/src/domain/valueObjects/AggregateRootId.ts
import { ValueObject } from './ValueObject';
// Replace with your actual UUID v6 generator
import { generateUUIDv6 } from '@kikerepo/utils-uuid6';

export class AggregateRootId extends ValueObject<string> {
  constructor(value?: string) {
    super(value ? value : generateUUIDv6());
  }
  toString(): string {
    throw new Error('Method not implemented.');
  }
}
