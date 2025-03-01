import { ValueObject } from '@kikerepo/common-domain';


export class HashedPassword extends ValueObject<string> {
  // Private constructor to prevent direct instantiation
  public constructor(hashedPassword: string) {
    super(hashedPassword);
  }
}
