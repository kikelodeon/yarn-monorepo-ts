import { DomainEvent } from '@kikerepo/common-domain';

export class SessionUpdatedEvent extends DomainEvent {
  constructor(
    public readonly sessionId: string,
    public readonly fingerprint: string,
    public readonly accessToken?: string // Optional phone
  ) {
    super();
  }

  eventName(): string {
    return 'SessionUpdatedEvent';
  }
}
