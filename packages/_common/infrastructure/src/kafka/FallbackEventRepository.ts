import { logger } from '../logging';
import { PrismaClient } from '../prisma';

import {
  IFallbackEventRepository,
  FallbackEventStatusEnum,
  FallbackEvent,
} from '@kikerepo/common-domain';

export class FallbackEventRepository implements IFallbackEventRepository {
  constructor(private readonly prisma = PrismaClient.ins.prisma) {}

  async save(event: FallbackEvent): Promise<void> {
    logger.debug(`[FallbackEventRepository] Saving event ${event.id.value}`);
    await this.prisma.fallbackEvent.upsert({
      where: { id: event.id.value },
      create: {
        id: event.id.value,
        name: event.name.value,
        payload: event.payload.value,
        status: event.status.value,
        retries: event.retries.value,
        createdAt: event.creationDate?.value,
      },
      update: {
        payload: event.payload.value,
        status: event.status.value,
        retries: event.retries.value,
      },
    });
    logger.info(`[FallbackEventRepository] Event ${event.id.value} saved/upserted with status=${event.status.value}`);
  }

  async findPending(limit = 100): Promise<FallbackEvent[]> {
    logger.debug(`[FallbackEventRepository] Finding up to ${limit} pending events`);
    const rows = await this.prisma.fallbackEvent.findMany({
      where: { status: FallbackEventStatusEnum.PENDING },
      orderBy: { createdAt: 'asc' },
      take: limit,
    });
    logger.info(`[FallbackEventRepository] Retrieved ${rows.length} pending events`);

    return rows.map(row => {
      const ev = FallbackEvent.rehydrate({
        id: row.id,
        name: row.name,
        payload: row.payload as Record<string, any>,
        status: row.status,
        retries: row.retries,
        creationDate: row.createdAt,
        deletionDate: row.updatedAt ?? undefined,
      });
      logger.debug(`[FallbackEventRepository] Rehydrated event ${ev.id.value} with retries=${ev.retries.value}`);
      return ev;
    });
  }

  async markProcessed(id: string): Promise<void> {
    logger.debug(`[FallbackEventRepository] Marking event ${id} as PROCESSED`);
    await this.prisma.fallbackEvent.update({
      where: { id },
      data: { status: FallbackEventStatusEnum.PROCESSED },
    });
    logger.info(`[FallbackEventRepository] Event ${id} marked as PROCESSED`);
  }

  async incrementRetries(id: string): Promise<void> {
    logger.debug(`[FallbackEventRepository] Incrementing retries for event ${id}`);
    await this.prisma.fallbackEvent.update({
      where: { id },
      data: { retries: { increment: 1 } },
    });
    logger.warn(`[FallbackEventRepository] Retries incremented for event ${id}`);
  }
}
