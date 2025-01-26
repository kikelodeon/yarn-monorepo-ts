// services/service-authentication/src/bootstrap/container.ts
import { Container } from 'inversify';
import {
  IUserRepositoryToken,
  IHashingServiceToken,
  IUserRepository,
  IHashingService,
} from '@kikerepo/domain-user';
import {
  UserRepository,
  Argon2HashingService,
  // 1) Import connectPrisma
  connectPrisma,
} from '@kikerepo/infrastructure-user';
import {
  RegisterCommandHandler,
  RegisterCommandHandlerToken,
} from '@kikerepo/application-user';
import { UserController, UserControllerToken } from '../controllers/UserController';

const container = new Container();

// -- Bind interfaces to implementations
container.bind<IUserRepository>(IUserRepositoryToken).to(UserRepository);
container.bind<IHashingService>(IHashingServiceToken).to(Argon2HashingService);

// -- Bind your CommandHandler
container.bind<RegisterCommandHandler>(RegisterCommandHandlerToken).to(RegisterCommandHandler);

// -- Bind your Controller
container.bind<UserController>(UserControllerToken).to(UserController);

/**
 * Async function for container initialization + Prisma connection.
 */
export async function buildContainer(): Promise<void> {
  // 2) Connect Prisma before returning
  await connectPrisma();
}

// Export the container as well:
export { container };
