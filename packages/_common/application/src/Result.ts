import { Either, left, right } from 'fp-ts/Either';

/**
 * Represents the outcome of an operation, which can be either an error or a success.
 */
export type Result<E, T> = Either<E, T>;

/**
 * Helper function to create a failure result.
 * @param error The error value.
 */
export const failure = <E, T = never>(error: E): Result<E, T> => left(error);

/**
 * Helper function to create a success result.
 * @param value The success value.
 */
export const success = <E = never, T = any>(value: T): Result<E, T> => right(value);
