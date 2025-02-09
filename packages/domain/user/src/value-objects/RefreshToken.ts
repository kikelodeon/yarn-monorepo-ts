// packages/domain/user/src/value-objects/RefreshToken.ts

import { ValueObject } from '@kikerepo/domain-common';

export class RefreshToken extends ValueObject<string> {
  constructor(token: string) {
    if (!token || typeof token !== 'string') {
      throw new Error('Refresh token must be a non-empty string.');
    }
    super(token);
  }
  
  // Métodos adicionales de comportamiento pueden agregarse aquí
}
