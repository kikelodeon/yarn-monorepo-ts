
import { ValueObject } from '../ValueObject';
import { generateUUIDv6 } from '@kikerepo/utils-uuid6';

/**
 * Value Object representing the ID of a User Entity.
 */
export class FallbackEventId extends ValueObject<string> {
  constructor(id?: string) {
    super(id ? id : generateUUIDv6());
  }

}
