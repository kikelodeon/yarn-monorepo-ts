// packages/shared/src/domain/valueObjects/AggregateRootId.ts
import { ValueObject } from './ValueObject';
// Replace with your actual UUID v6 generator
import { generateUUIDv6 } from '../../utils'; 

export class AggregateRootId extends ValueObject<string> {
  constructor(id?: string) {
    super(id ? id : generateUUIDv6());
  }
  toString(): string {
    throw new Error('Method not implemented.');
  }
}
