import { FallbackEvent } from '../FallbackEvent';

// 1) Declare a unique Symbol to represent the repository token.
export const IFallbackEventRepositoryToken = Symbol('IFallbackEventRepository');

// 2) Define the interface itself.
export interface IFallbackEventRepository {
  save(event: FallbackEvent): Promise<void>;
  findPending(limit?: number): Promise<FallbackEvent[]>;
  markProcessed(id: string): Promise<void>;
  incrementRetries(id: string): Promise<void>;
}
