import { DomainError } from '@kikerepo/domain-common';

export class RequiredPasswordError extends DomainError {
  constructor(message: string= 'Password is required') {
    super(message);
    this.name += '[RequiredPasswordError]';
  }
}
