import { ValueObject } from '@kikerepo/common-domain';

export class AccessToken extends ValueObject<string> {
  constructor(token: string) {
    super(token);
    // ✅ Solo verifica reglas básicas del dominio
    if (!token || typeof token !== 'string') {
      throw new Error('Invalid token format');
    }
  }
}