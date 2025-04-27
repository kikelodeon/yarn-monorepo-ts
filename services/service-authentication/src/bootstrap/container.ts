// services/service-authentication/src/bootstrap/container.ts

import 'reflect-metadata';
import { Container } from 'inversify';

import {
  IUserRepository,
  IUserRepositoryToken,
  IHashingService,
  IHashingServiceToken,
} from '@kikerepo/authentication-domain';

import {
  UserRepository,
  Argon2HashingService,
  AuthenticationService,
  AuthenticationServiceToken,
} from '@kikerepo/authentication-infrastructure';

import {
  RegisterCommandHandler,
  RegisterCommandHandlerToken,
  LoginQueryHandler,
  LoginQueryHandlerToken,
} from '@kikerepo/authentication-application';

import { UserController, UserControllerToken } from '../controllers';

import { logger } from '@kikerepo/common-infrastructure';
import { initializeInfrastructureClients } from './initClients';

const container = new Container();

// 1) (request–scoped)

container
  .bind<IUserRepository>(IUserRepositoryToken)
  .to(UserRepository)
  .inRequestScope(); //inSingletonScope ??

// 2) (singletons)


container
  .bind<IHashingService>(IHashingServiceToken)
  .to(Argon2HashingService)
  .inSingletonScope();

// 3) Handlers (transient by default)
container
  .bind<RegisterCommandHandler>(RegisterCommandHandlerToken)
  .to(RegisterCommandHandler);

container
  .bind<LoginQueryHandler>(LoginQueryHandlerToken)
  .to(LoginQueryHandler);

// 4) AuthenticationService – now with 3 injected dependencies
container
  .bind<AuthenticationService>(AuthenticationServiceToken)
  .toDynamicValue((ctx) => {

    const registerHandler = ctx.container.get<RegisterCommandHandler>(RegisterCommandHandlerToken);
    const loginHandler = ctx.container.get<LoginQueryHandler>(LoginQueryHandlerToken);
    return new AuthenticationService(  loginHandler,registerHandler);
  })
  // Scope it as you see fit; request-scoped ensures a fresh UoW per request
  .inRequestScope();

// 5) Controller
container
  .bind<UserController>(UserControllerToken)
  .to(UserController)
  .inSingletonScope();

export async function buildContainer(): Promise<void> {
  logger.debug('[Container] Initializing infrastructure clients...');
  await initializeInfrastructureClients();
  logger.info('[Container] Infrastructure initialized ✅');
}

export { container };
