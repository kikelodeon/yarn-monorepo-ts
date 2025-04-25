// services/service-session/src/bootstrap/container.ts
import 'reflect-metadata';
import { Container } from 'inversify';
import { ISessionRepository, ISessionRepositoryToken } from '@kikerepo/session-domain';
import { SessionRepository } from '@kikerepo/session-infrastructure';
import { UserLoggedInEventHandler } from '@kikerepo/session-application';
import { PrismaClient} from '@kikerepo/common-infrastructure';

const container = new Container();

// Bindear la implementación del repositorio de sesión en singleton
container.bind<ISessionRepository>(ISessionRepositoryToken).to(SessionRepository).inSingletonScope();

// Bindear el handler del evento de login
container.bind<UserLoggedInEventHandler>(UserLoggedInEventHandler).toSelf();


/**
 * Función de inicialización del contenedor.
 * Se conecta a la base de datos y ejecuta las migraciones de sesión.
 */
export async function buildContainer(): Promise<void> {
  await PrismaClient.ins.connect();
}

export { container };
