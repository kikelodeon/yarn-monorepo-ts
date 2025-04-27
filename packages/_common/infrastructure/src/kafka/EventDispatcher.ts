// packages/common/infrastructure/DomainEventsDispatcher.ts
import { AggregateRoot } from '@kikerepo/common-domain';
import { KafkaClient } from './KafkaClient';
import { logger } from '../logging';

/**
 * Despacha todos los DomainEvents de un Aggregate y los limpia.
 */
export class EventDispatcher {
  static async dispatchAndClear(aggregate: AggregateRoot<any>) {
    const events = aggregate.domainEvents;
    if (!events.length) return;

    logger.info(
      `[DomainEventsDispatcher] Dispatching ${events.length} events for aggregate ${aggregate.id.value}`
    );

    for (const event of [...events]) {
      const msg = event.toJson();
      await KafkaClient.ins.publish({
        topic: event.eventName().toLowerCase(),
        messages: [{ key: event.id, value: JSON.stringify(msg) }],
      });
      logger.debug(
        `[DomainEventsDispatcher] Dispatched ${event.eventName()}(${event.id})`
      );
    }

    aggregate.clearDomainEvents();
    logger.info('[DomainEventsDispatcher] Cleared domain events');
  }
}