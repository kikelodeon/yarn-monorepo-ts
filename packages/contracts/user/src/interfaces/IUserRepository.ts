import { IUserDTO } from './IUserDTO';

/**
 * Interface for User Repository
 */
export interface IUserRepository {
  save(user: IUserDTO): Promise<void>;
  findById(id: string): Promise<IUserDTO | null>;
}
