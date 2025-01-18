
import { DomainEvent } from '@kikerepo/domain-common';

export class SessionStartedEvent extends DomainEvent {
  constructor(

  ) {
    super();
  }

  eventName(): string {
    return 'SessionStartedEvent';
  }
}
