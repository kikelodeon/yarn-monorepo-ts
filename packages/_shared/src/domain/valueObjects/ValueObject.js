"use strict";
// packages/shared/src/domain/valueObjects/ValueObject.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValueObject = void 0;
/**
 * Base class for all Value Objects.
 * Ensures immutability and provides equality logic.
 */
class ValueObject {
    constructor(props) {
        this.props = props;
        Object.freeze(this); // Ensures immutability
    }
    /**
     * Returns the properties of the Value Object.
     */
    getProps() {
        return this.props;
    }
    /**
     * Checks equality with another Value Object.
     * @param vo - The other Value Object to compare with.
     * @returns `true` if equal, `false` otherwise.
     */
    equals(vo) {
        if (vo === null || vo === undefined) {
            return false;
        }
        if (vo.constructor !== this.constructor) {
            return false;
        }
        return JSON.stringify(vo.getProps()) === JSON.stringify(this.getProps());
    }
}
exports.ValueObject = ValueObject;
