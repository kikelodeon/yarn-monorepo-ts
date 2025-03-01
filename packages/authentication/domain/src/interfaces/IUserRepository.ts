import { User } from '../entities/User';

// 1) Declare a unique Symbol to represent the repository token.
export const IUserRepositoryToken = Symbol('IUserRepository');

// 2) Define the interface itself.
export interface IUserRepository {
  save(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
}
