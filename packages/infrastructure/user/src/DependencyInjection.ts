// packages/infrastructure-user/src/index.ts
import {  DependencyContainer } from 'tsyringe';
import { IUserRepository } from '@kikerepo/domain-user';
import { UserRepository } from './persistance';

export function registerInfrastructure(c: DependencyContainer) {
  // Registramos el repo de usuario
  c.register<IUserRepository>('IUserRepository', {
    useClass: UserRepository
  });
  // Si tuviésemos mapeadores, factories, etc., también se registran aquí
}
