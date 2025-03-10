// packages/authentication/application/src/events/UserLoggedInEvent.ts

import { HttpRequestData } from './HttpRequestData';
import { UserId, AccessToken } from '@kikerepo/authentication-domain';

/**
 * Evento que se dispara cuando un usuario inicia sesión exitosamente.
 * Contiene el UserId, el AccessToken generado y los datos del request necesarios para construir el fingerprint.
 */
export class UserLoggedInEvent {
  public readonly userId: UserId;
  public readonly accessToken: AccessToken;
  public readonly httpRequestData: HttpRequestData;
  public readonly timestamp: Date;

  /**
   * @param userId Identificador del usuario.
   * @param accessToken Token de acceso generado.
   * @param httpRequestData Datos del request (deviceId, user-agent, etc.) para construir el fingerprint.
   * @param timestamp Marca temporal del evento (opcional, por defecto se asigna la fecha actual).
   */
  constructor(
    userId: UserId,
    accessToken: AccessToken,
    httpRequestData: HttpRequestData,
    timestamp?: Date
  ) {
    this.userId = userId;
    this.accessToken = accessToken;
    this.httpRequestData = httpRequestData;
    this.timestamp = timestamp || new Date();
  }
}
