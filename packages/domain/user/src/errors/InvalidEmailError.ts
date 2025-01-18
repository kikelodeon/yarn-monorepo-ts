import { DomainError } from '@kikerepo/domain-common';

class InvalidEmailError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name += '[InvalidEmailError]';
  }
}
