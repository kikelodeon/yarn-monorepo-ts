// src/bootstrap/container.ts

import 'reflect-metadata';
import { container } from 'tsyringe';
import { IDatabaseConnector, MongoConnector } from '@kikerepo/infrastructure-common';
import { registerUserInfrastructure } from '@kikerepo/infrastructure-user';
import { UserService } from '../services/UserService';
import { requireEnv } from '@kikerepo/utils-env';

export function buildContainer() {
  // Lee variables de entorno
  const dbHost = requireEnv('DB_HOST');
  const dbPort = requireEnv('DB_PORT');
  const dbUser = requireEnv('DB_USER');
  const dbPassword = requireEnv('DB_PASSWORD');

  // Construye el URI de Mongo
  const mongoUri = `mongodb://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/service-authentication?authSource=admin`;

  // 1) Registrar la dependencia para conectar a la base de datos
  container.register<IDatabaseConnector>('IDatabaseConnector', {
    useValue: new MongoConnector(mongoUri),
  });

  // 2) Registrar la infraestructura de usuario
  registerUserInfrastructure(container);

  // 3) Registrar el servicio de usuario
  container.register<UserService>(UserService, {
    useClass: UserService,
  });

  return container;
}

export { container };
