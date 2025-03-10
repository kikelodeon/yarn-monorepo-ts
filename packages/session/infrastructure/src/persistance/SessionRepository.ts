// packages/session/infrastructure/src/persistance/SessionRepository.ts
import { prisma } from '@kikerepo/common-infrastructure';
import { Session } from '@kikerepo/session-domain';

export interface ISessionRepository {
  save(session: Session): Promise<void>;
  // Otros métodos: findByUserId, update, etc.
}

export class SessionRepository implements ISessionRepository {
  async save(session: Session): Promise<void> {
    await prisma.session.upsert({
      where: { id: session.id.value },
      update: {
        accessToken: session.accessToken.value,
        fingerprint: session.fingerPrint.value,
      },
      create: {
        id: session.id.value,
        userId: session.id.value,  // O el userId obtenido del evento
        accessToken: session.accessToken.value,
        fingerprint: session.fingerPrint.value,
      },
    });
  }
}
