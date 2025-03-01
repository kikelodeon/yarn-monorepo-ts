import { ValueObject } from '@kikerepo/domain-common';


export class InputPassword extends ValueObject<string> {
  constructor(password: string) {
    super(password);
  }
}
