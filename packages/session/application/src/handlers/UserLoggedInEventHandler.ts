// packages/session/application/src/handlers/UserLoggedInEventHandler.ts
import { injectable, inject } from 'inversify';
import { UserLoggedInEvent } from '@kikerepo/authentication-application';
import { Session, ISessionRepository, ISessionRepositoryToken } from '@kikerepo/session-domain';
import { FingerPrintFactory } from '../factories/FingerPrintFactory';
import { Location } from '@kikerepo/session-domain/src/value-objects/Location';

@injectable()
export class UserLoggedInEventHandler {
  constructor(
    @inject(ISessionRepositoryToken) private readonly sessionRepo: ISessionRepository
  ) {}

  public async handle(event: UserLoggedInEvent, ip: string, geoData?: { country?: string; region?: string; city?: string; latitude?: number; longitude?: number }): Promise<void> {
    // Generar el fingerprint a partir de los datos del request
    const fingerprint = FingerPrintFactory.build(event.httpRequestData);

    // Crear un objeto Location a partir de la IP y, opcionalmente, datos de geolocalización.
    const location = new Location(ip, geoData);

    // Crear la sesión. Si es un login nuevo, se crea con la ubicación inicial;
    // TODO: Si es un login existente, se actualiza con la ubicación actual.
    //TODO: Si es un login nuevo, se crea con la ubicación inicial;
    const session = Session.createUnique(
      event.userId.value, // Suponiendo que userId es un Value Object
      event.accessToken,  // Ya es AccessToken
      fingerprint,
      location
    );

    // Persistir la sesión usando el repositorio.
    await this.sessionRepo.save(session);
  }
}
