import { DomainEvent } from '@kikerepo/common-domain';

export class UserCreatedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly phone?: string ,// Optional phone
    public readonly creationDate?: Date // Optional phone
  ) {
    super();
  }
  toJson  (): string {
    return  JSON.stringify(this);
  }
  eventName(): string {
    return 'UserCreatedEvent';
  }
}
