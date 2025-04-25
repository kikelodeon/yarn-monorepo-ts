// packages/session/infrastructure/src/persistance/SessionRepository.ts
import { PrismaClient } from '@kikerepo/common-infrastructure'; // Importa la instancia de prismaClient
import { Session } from '@kikerepo/session-domain';

export interface ISessionRepository {
  save(session: Session): Promise<void>;
  // Otros métodos: findByUserId, update, etc.
}

export class SessionRepository implements ISessionRepository {
  async save(session: Session): Promise<void> {
    await PrismaClient.ins.prisma.session.upsert({
      where: { id: session.id.value },
      update: {
        accessToken: session.accessToken.value,
        fingerprint: session.fingerPrint.value,
      },
      create: {
        id: session.id.value,
        userId: session.id.value,  // Ajusta si el userId debe venir de otro lugar
        accessToken: session.accessToken.value,
        fingerprint: session.fingerPrint.value,
      },
    });
  }
}
