// services/service-authentication/src/bootstrap/container.ts

import 'reflect-metadata';
import { Container } from 'inversify';
import {
  ISessionRepository,
  ISessionRepositoryToken,
} from '@kikerepo/session-domain';

import {
  SessionRepository,
  SessionService,
  SessionServiceToken,
} from '@kikerepo/session-infrastructure';

/*
import {
  OnLoginQueryHandler,
  LoginQueryHandlerToken,
} from '@kikerepo/authentication-application';
*/
import { SessionController, SessionControllerToken } from '../controllers';

import { logger } from '@kikerepo/common-infrastructure';
import { initializeInfrastructureClients } from './initClients';

const container = new Container();

// 1) (request–scoped)

container
  .bind<ISessionRepository>(ISessionRepositoryToken)
  .to(SessionRepository)
  .inRequestScope(); //inSingletonScope ??

// 2) (singletons)

/*
container
  .bind<IHashingService>(IHashingServiceToken)
  .to(Argon2HashingService)
  .inSingletonScope();
*/
// 3) Handlers (transient by default)
/*container
  .bind<RegisterCommandHandler>(RegisterCommandHandlerToken)
  .to(RegisterCommandHandler);

container
  .bind<LoginQueryHandler>(LoginQueryHandlerToken)
  .to(LoginQueryHandler);
*/
// 4) AuthenticationService – now with 3 injected dependencies
/*container
  .bind<SessionService>(SessionServiceToken)
  .toDynamicValue((ctx) => {

    const registerHandler = ctx.container.get<RegisterCommandHandler>(RegisterCommandHandlerToken);
    const loginHandler = ctx.container.get<LoginQueryHandler>(LoginQueryHandlerToken);
    return new AuthenticationService(  loginHandler,registerHandler);
  })
  // Scope it as you see fit; request-scoped ensures a fresh UoW per request
  .inRequestScope();*/

// 5) Controller
container
  .bind<SessionController>(SessionControllerToken)
  .to(SessionController)
  .inSingletonScope();

export async function buildContainer(): Promise<void> {
  logger.debug('[Container] Initializing infrastructure clients...');
  await initializeInfrastructureClients();
  logger.info('[Container] Infrastructure initialized ✅');
}

export { container };
