// packages/authentication/application/src/events/HttpRequestData.ts

/**
 * Datos del request necesarios para generar un fingerprint robusto.
 * Se incluye el deviceId y otros headers relevantes, pero no la IP.
 */
export interface HttpRequestData {
    deviceId?: string;
    userAgent: string;
    acceptLanguage?: string;
    acceptEncoding?: string;
    secChUa?: string;
    secChUaPlatform?: string;
    secChUaMobile?: string;
    referer?: string;
  }
  