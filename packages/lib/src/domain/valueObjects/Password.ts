import { ValueObject } from './ValueObject';

export class Password extends ValueObject<string> {
  constructor(password: string) {
    super(password);
    if (!this.isValidPassword(password)) {
      throw new Error('Password must be at least 8 characters long.');
    }
  }

  private isValidPassword(password: string): boolean {
    return password.length >= 8;
  }
}
