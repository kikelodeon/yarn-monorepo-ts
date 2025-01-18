import { ValueObject } from '@kikerepo/domain-common';


export class Phone extends ValueObject<string> {
  constructor(phone: string) {
    super(phone);
    if (!this.isValidPhone(phone)) {
      throw new Error('Invalid phone number.');
    }
  }

  private isValidPhone(phone: string): boolean {
    return /^\+?[1-9]\d{1,14}$/.test(phone); // E.164 international phone number format
  }
}
