// packages/session/domain/src/value-objects/Location.ts

import { ValueObject } from '@kikerepo/common-domain';

export interface GeoData {
  country?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
}

/**
 * Value Object que representa la ubicación basada en la IP y datos de geolocalización.
 */
export class Location extends ValueObject<{ ip: string; geoData?: GeoData }> {
  constructor(ip: string, geoData?: GeoData) {
    super({ ip, geoData });
  }

  get ip(): string {
    return this.value.ip;
  }

  get geoData(): GeoData | undefined {
    return this.value.geoData;
  }
}
