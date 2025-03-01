// packages/domain/user/src/value-objects/AccessToken.ts

import { ValueObject } from '@kikerepo/common-domain';

export class AccessToken extends ValueObject<string> {
  constructor(token: string) {
    // Aquí podrías agregar validaciones, por ejemplo, verificar si el token
    // cumple con un formato JWT (opcional, según tus necesidades)
    if (!token || typeof token !== 'string') {
      throw new Error('Access token must be a non-empty string.');
    }
    super(token);
  }
  
  // Puedes agregar métodos adicionales, por ejemplo, para obtener la expiración, etc.
}
