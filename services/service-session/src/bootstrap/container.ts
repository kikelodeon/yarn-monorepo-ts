import { Container } from 'inversify';
import { ISessionRepository, ISessionRepositoryToken } from '@kikerepo/session-domain';
import { SessionRepository } from '@kikerepo/session-infrastructure';
import { UserLoggedInEventHandler } from '@kikerepo/session-application';

const container = new Container();

// Bindear la implementación del repositorio de sesión en singleton
container.bind<ISessionRepository>(ISessionRepositoryToken).to(SessionRepository).inSingletonScope();

// Bindear el handler del evento de login
container.bind<UserLoggedInEventHandler>(UserLoggedInEventHandler).toSelf();

// Exporta el contenedor para ser utilizado en la inicialización
export { container };
