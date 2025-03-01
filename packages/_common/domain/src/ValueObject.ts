export abstract class ValueObject<T> {
  private readonly _value: T;

  constructor(value: T) {
    if (value === null || value === undefined) {
      throw new Error('ValueObject cannot be null or undefined');
    }
    this._value = Object.freeze(value); // Make the value immutable
  }

  /**
   * Gets the encapsulated value.
   */
  get value(): T {
    return this._value;
  }

  /**
   * Checks equality between two value objects.
   * @param other - The other value object to compare.
   * @returns True if the values are equal, false otherwise.
   */
  public equals(other: ValueObject<T>): boolean {
    if (other === null || other === undefined) {
      return false;
    }

    return JSON.stringify(this._value) === JSON.stringify(other.value);
  }

  /**
   * Converts the value to a string.
   * @returns The string representation of the encapsulated value.
   */
  public toString(): string {
    return String(this._value);
  }
}
