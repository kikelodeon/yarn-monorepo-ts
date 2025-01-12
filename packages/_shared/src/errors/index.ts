// packages/shared/src/errors/index.ts

export { BaseError } from './BaseError';
export { ValidationError } from './ValidationError';
export { NotFoundError } from './NotFoundError';
// Exporting interfaces if needed
export * from '../domain/errors';
export * from '../domain/interfaces';
export * from '../infrastructure/errors';