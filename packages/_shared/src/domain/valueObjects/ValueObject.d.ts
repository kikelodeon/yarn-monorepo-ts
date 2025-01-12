/**
 * Base class for all Value Objects.
 * Ensures immutability and provides equality logic.
 */
export declare abstract class ValueObject<T> {
    protected readonly props: T;
    constructor(props: T);
    /**
     * Returns the properties of the Value Object.
     */
    getProps(): T;
    /**
     * Checks equality with another Value Object.
     * @param vo - The other Value Object to compare with.
     * @returns `true` if equal, `false` otherwise.
     */
    equals(vo?: ValueObject<T>): boolean;
}
//# sourceMappingURL=ValueObject.d.ts.map