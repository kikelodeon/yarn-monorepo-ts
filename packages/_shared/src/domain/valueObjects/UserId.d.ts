import { ValueObject } from './ValueObject';
/**
 * Value Object representing the ID of a User Entity.
 */
export declare class UserId extends ValueObject<string> {
    /**
     * Constructs a new UserId.
     * @param id - Optional. If not provided, a new UUID v6 is generated.
     */
    constructor(id?: string);
    /**
     * Returns the string representation of the UserId.
     */
    toString(): string;
    /**
     * Static factory method to create a UserId from a string.
     * Useful for reconstructing UserId from persistence layers.
     * @param id - The ID string.
     * @returns A new UserId instance.
     */
    static fromString(id: string): UserId;
}
//# sourceMappingURL=UserId.d.ts.map