// packages/session/application/src/factories/FingerPrintFactory.ts

import crypto from 'crypto';
import { HttpRequestData } from '@kikerepo/authentication-application';
import { FingerPrint } from '@kikerepo/session-domain';

export class FingerPrintFactory {
  public static build(httpData: HttpRequestData): FingerPrint {
    const {
      deviceId = '',
      userAgent,
      acceptLanguage = '',
      acceptEncoding = '',
      secChUa = '',
      secChUaPlatform = '',
      secChUaMobile = '',
      referer = '',
    } = httpData;

    // Concatenamos los datos para formar un string único
    const dataString = `${deviceId}|${userAgent}|${acceptLanguage}|${acceptEncoding}|${secChUa}|${secChUaPlatform}|${secChUaMobile}|${referer}`;

    // Generamos un hash SHA-256
    const hash = crypto.createHash('sha256').update(dataString).digest('hex');
    return new FingerPrint(hash);
  }
}
