export class ExpirationDate {
    private readonly _value: Date;
  
    constructor(date?: Date) {
      this._value = date ? new Date(date) : new Date();
      this.validate();
    }
  
    private validate() {
      if (!(this._value instanceof Date) || isNaN(this._value.getTime())) {
        throw new Error('Invalid expiration Date.');
      }
  
      const now = new Date();
      if (this._value <now) {
        throw new Error('Expiration date cannot be in the past.');
      }
    }
  
    get value(): Date {
      return new Date(this._value);
    }
  
    equals(other: ExpirationDate): boolean {
      return this._value.getTime() === other._value.getTime();
    }
  
    toString(): string {
      return this._value.toISOString();
    }
  }
  