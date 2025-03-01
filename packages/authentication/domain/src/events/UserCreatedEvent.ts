import { DomainEvent } from '@kikerepo/common-domain';

export class UserCreatedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly phone?: string // Optional phone
  ) {
    super();
  }

  eventName(): string {
    return 'UserCreatedEvent';
  }
}
