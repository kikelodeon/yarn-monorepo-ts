// services/service-authentication/src/bootstrap/container.ts

import 'reflect-metadata';
import {
  Container 
} from 'inversify';

import {
  IUserRepository, IUserRepositoryToken,
  IHashingService, IHashingServiceToken
} from '@kikerepo/domain-authentication';

import {
   UserRepository,
   Argon2HashingService, 
   connectPrisma, 
   AuthenticationService, 
   AuthenticationServiceToken
} from '@kikerepo/infrastructure-authentication';

import { 
  RegisterCommandHandler, 
  RegisterCommandHandlerToken, 
  LoginQueryHandler, 
  LoginQueryHandlerToken 
}from '@kikerepo/application-authentication';

import {
   UserController, 
   UserControllerToken 
} from '../controllers';

const container = new Container();

// Bindear el repositorio (singleton)
container.bind<IUserRepository>(IUserRepositoryToken).to(UserRepository).inSingletonScope();

// Bindear el servicio de hashing (singleton)
container.bind<IHashingService>(IHashingServiceToken).to(Argon2HashingService).inSingletonScope();

// Bindear los handlers (por defecto, transient)
container.bind<RegisterCommandHandler>(RegisterCommandHandlerToken).to(RegisterCommandHandler);
container.bind<LoginQueryHandler>(LoginQueryHandlerToken).to(LoginQueryHandler);

// Bindear el AuthenticationService (inyectando los handlers necesarios)
container.bind<AuthenticationService>(AuthenticationServiceToken).toDynamicValue((context) => {
  const loginHandler = context.container.get<LoginQueryHandler>(LoginQueryHandlerToken);
  const registerHandler = context.container.get<RegisterCommandHandler>(RegisterCommandHandlerToken);
  return new AuthenticationService(loginHandler, registerHandler);
});

// Bindear el UserController (asegúrate de usar el mismo símbolo)
container.bind<UserController>(UserControllerToken).to(UserController);

export async function buildContainer(): Promise<void> {
  await connectPrisma();
}

export { container };
