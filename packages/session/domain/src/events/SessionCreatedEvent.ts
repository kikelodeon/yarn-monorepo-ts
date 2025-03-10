import { DomainEvent } from '@kikerepo/common-domain';

export class SessionCreatedEvent extends DomainEvent {
  constructor(
    public readonly sessionId: string,
    public readonly fingerprint: string,
    public readonly accessToken?: string // Optional phone
  ) {
    super();
  }

  eventName(): string {
    return 'SessionCreatedEvent';
  }
}
