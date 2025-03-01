import { ValueObject } from '@kikerepo/domain-common';


export class HashedPassword extends ValueObject<string> {
  // Private constructor to prevent direct instantiation
  public constructor(hashedPassword: string) {
    super(hashedPassword);
  }
}
