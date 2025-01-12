"use strict";
// packages/shared/src/domain/valueObjects/UserId.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserId = void 0;
const ValueObject_1 = require("./ValueObject");
const utils_1 = require("../../utils");
/**
 * Value Object representing the ID of a User Entity.
 */
class UserId extends ValueObject_1.ValueObject {
    /**
     * Constructs a new UserId.
     * @param id - Optional. If not provided, a new UUID v6 is generated.
     */
    constructor(id) {
        super(id ?? (0, utils_1.generateUUIDv6)());
    }
    /**
     * Returns the string representation of the UserId.
     */
    toString() {
        return this.props;
    }
    /**
     * Static factory method to create a UserId from a string.
     * Useful for reconstructing UserId from persistence layers.
     * @param id - The ID string.
     * @returns A new UserId instance.
     */
    static fromString(id) {
        // You can add validation here if necessary
        return new UserId(id);
    }
}
exports.UserId = UserId;
