import { DomainError } from '@kikerepo/domain-common';

export class RequiredEmailError extends DomainError {
  constructor(message: string = 'Email is required') {
    super(message);
    this.name += '[RequiredEmailError]';
  }
}
