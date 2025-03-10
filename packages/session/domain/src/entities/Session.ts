// packages/session/domain/src/entities/Session.ts

import { AggregateRoot } from '@kikerepo/common-domain';
import { SessionId,Location,FingerPrint } from '../value-objects';
import { AccessToken } from '@kikerepo/authentication-domain';
export class Session extends AggregateRoot<SessionId> {
  private _userId: string;
  private _accessToken: AccessToken;
  private _fingerPrint: FingerPrint;
  private _locations: Location[];

  private constructor(
    id: SessionId,
    userId: string,
    accessToken: AccessToken,
    fingerPrint: FingerPrint,
    locations: Location[]
  ) {
    super(id);
    this._userId = userId;
    this._accessToken = accessToken;
    this._fingerPrint = fingerPrint;
    this._locations = locations;
    this.validate();
  }

  public static createUnique(
    userId: string,
    accessToken: AccessToken,
    fingerPrint: FingerPrint,
    initialLocation?: Location
  ): Session {
    const sessionId = new SessionId();
    const locations = initialLocation ? [initialLocation] : [];
    return new Session(sessionId, userId, accessToken, fingerPrint, locations);
  }

  private validate(): void {
    if (!this._userId) throw new Error('El userId es requerido');
    if (!this._accessToken) throw new Error('El accessToken es requerido');
    if (!this._fingerPrint) throw new Error('El fingerprint es requerido');
  }

  
  get userId(): string {
    return this._userId;
  }
  get accessToken(): AccessToken {
    return this._accessToken;
  }
  get fingerPrint(): FingerPrint {
    return this._fingerPrint;
  }
  get locations(): Location[] {
    return this._locations;
  }

  // Permite agregar una nueva ubicación si se detecta un cambio de IP
  public addLocation(location: Location): void {
    this._locations.push(location);
  }
}
