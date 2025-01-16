// packages/shared/src/domain/valueObjects/UserId.ts

import { ValueObject } from './ValueObject';
export class Email extends ValueObject<string> {
  constructor(email: string) {
    super(email);
    if (!this.isValidEmail(email)) {
      throw new Error('Invalid email address');
    }
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}