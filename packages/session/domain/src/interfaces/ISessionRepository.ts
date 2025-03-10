import { Session } from '../entities/Session';

export const ISessionRepositoryToken = Symbol('ISessionRepository');

export interface ISessionRepository {
  save(session: Session): Promise<void>;
  // Puedes agregar otros métodos (find, update, delete, etc.)
}
