import { ValueObject } from '@kikerepo/common-domain';


export class InputPassword extends ValueObject<string> {
  constructor(password: string) {
    super(password);
  }
}
