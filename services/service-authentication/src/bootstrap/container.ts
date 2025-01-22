// services/service-authentication/src/bootstrap/container.ts

import 'reflect-metadata';
import { container } from 'tsyringe';
import { registerInfrastructure } from '@kikerepo/infrastructure-user';
import { UserService } from '../services/UserService';
import { connectPrisma } from '@kikerepo/infrastructure-user';
// Función para construir el contenedor de dependencias
export async function buildContainer() {
  // 1) Conectar Prisma
  await connectPrisma();

  // 2) Registrar infraestructura (repositorios, etc.)
  registerInfrastructure(container);

  // 3) Registrar servicios
  container.register<UserService>(UserService, {
    useClass: UserService,
  });

  return container;
}

export { container };
