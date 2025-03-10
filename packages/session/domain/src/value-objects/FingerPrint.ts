// packages/domain/user/src/value-objects/AccessToken.ts

import { ValueObject } from '@kikerepo/common-domain';

export class FingerPrint extends ValueObject<string> {
  constructor(fingerprint: string) {
    super(fingerprint);
  }
  
  // Puedes agregar métodos adicionales, por ejemplo, para obtener la expiración, etc.
}
