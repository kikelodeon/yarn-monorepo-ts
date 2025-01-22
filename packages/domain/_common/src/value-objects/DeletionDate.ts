export class DeletionDate {
    private readonly _value: Date;
  
    constructor(date?: Date) {
      this._value = date ? new Date(date) : new Date();
      this.validate();
    }
  
    private validate() {
      if (!(this._value instanceof Date) || isNaN(this._value.getTime())) {
        throw new Error('Invalid deletion date.');
      }
  
      const now = new Date();
      if (this._value > now) {
        throw new Error('Creation date cannot be in the future.');
      }
    }
  
    get value(): Date {
      return new Date(this._value);
    }
  
    equals(other: DeletionDate): boolean {
      return this._value.getTime() === other._value.getTime();
    }
  
    toString(): string {
      return this._value.toISOString();
    }
  }
  