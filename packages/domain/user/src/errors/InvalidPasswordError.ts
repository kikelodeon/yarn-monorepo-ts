import { DomainError } from '@kikerepo/domain-common';

class InvalidPasswordError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name += '[InvalidPasswordError]';
  }
}
