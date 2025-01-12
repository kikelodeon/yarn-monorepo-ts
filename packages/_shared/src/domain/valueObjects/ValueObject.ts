// packages/shared/src/domain/valueObjects/ValueObject.ts

/**
 * Base class for all Value Objects.
 * Ensures immutability and provides equality logic.
 */
export abstract class ValueObject<T> {
    protected readonly props: T;
  
    constructor(props: T) {
      this.props = props;
      Object.freeze(this); // Ensures immutability
    }
  
    /**
     * Returns the properties of the Value Object.
     */
    public getProps(): T {
      return this.props;
    }
  
    /**
     * Checks equality with another Value Object.
     * @param vo - The other Value Object to compare with.
     * @returns `true` if equal, `false` otherwise.
     */
    public equals(vo?: ValueObject<T>): boolean {
      if (vo === null || vo === undefined) {
        return false;
      }
  
      if (vo.constructor !== this.constructor) {
        return false;
      }
  
      return JSON.stringify(vo.getProps()) === JSON.stringify(this.getProps());
    }
  }
  