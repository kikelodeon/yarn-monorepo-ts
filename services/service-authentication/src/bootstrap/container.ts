// services/service-authentication/src/bootstrap/container.ts
import 'reflect-metadata'; // Importar siempre al inicio
import { Container } from 'inversify';
import {
  IUserRepository,
  IUserRepositoryToken,
  IHashingService,
  IHashingServiceToken,
} from '@kikerepo/domain-user';
import {
  UserRepository,
  Argon2HashingService,
  connectPrisma,
} from '@kikerepo/infrastructure-user';
import {
  RegisterCommandHandler,
  RegisterCommandHandlerToken,
  LoginQueryHandler,
  LoginQueryHandlerToken
} from '@kikerepo/application-user';

import { UserController, UserControllerToken } from '../controllers/UserController';
import { AuthenticationService,AuthenticationServiceToken } from '@kikerepo/infrastructure-user/src/authentication/AuthenticationService';

// Crear el contenedor
const container = new Container();

// --- Bindings con ámbito definido ---

// Repositorio: Como suele manejar la conexión y es único, lo configuramos como singleton.
container
  .bind<IUserRepository>(IUserRepositoryToken)
  .to(UserRepository)
  .inSingletonScope();

// Servicio de hashing: También se configura como singleton.
container
  .bind<IHashingService>(IHashingServiceToken)
  .to(Argon2HashingService)
  .inSingletonScope();

// Handler de registro: Si bien es stateless, en este caso se puede dejar en el scope por defecto (transient).
container
  .bind<RegisterCommandHandler>(RegisterCommandHandlerToken)
  .to(RegisterCommandHandler);

  container.bind<LoginQueryHandler>(LoginQueryHandlerToken)
  .to(LoginQueryHandler);

// Enlazar el AuthenticationService. Este servicio se encarga de mapear internamente la request y la respuesta.
container.bind<AuthenticationService>(AuthenticationServiceToken).toDynamicValue((context) => {
  const loginHandler = context.container.get<LoginQueryHandler>(LoginQueryHandlerToken);
  const registerHandler = context.container.get<RegisterCommandHandler>(RegisterCommandHandlerToken);
  return new AuthenticationService(loginHandler, registerHandler);
});

// Controlador: Normalmente se instancia por petición, por lo que puede quedar como transient.
container
  .bind<UserController>(UserControllerToken)
  .to(UserController);

// --- Función de inicialización del contenedor ---
/**
 * Función asíncrona para inicializar el contenedor y conectar Prisma.
 */
export async function buildContainer(): Promise<void> {
  await connectPrisma();
}

// Exportamos el contenedor para poder utilizarlo en otros módulos
export { container };
