
import { logger } from '../logging';
import { PrismaClient } from '../prisma';
import {
     IFallbackEventRepository ,
     FallbackEvent,
     FallbackEventStatusEnum,
} from '@kikerepo/common-domain';


export class FallbackEventRepository implements IFallbackEventRepository {
    constructor(private readonly prisma = PrismaClient.ins.prisma) {}
  
    async save(event: FallbackEvent): Promise<void> {
      await this.prisma.fallbackEvent.upsert({
        where: { id: event.id.value },
        create: {
          id:        event.id.value,
          eventType: event.name.value,
          payload:   event.payload.value,
          status:    event.status.value,
          retries:   event.retries.value,
          createdAt: event.creationDate?.value,
        },
        update: {
          // on existing record, update payload/status/retries
          payload: event.payload.value,
          status:  event.status.value,
          retries: event.retries.value,
        },
      });
    }
  
  
    async findPending(limit = 100): Promise<FallbackEvent[]> {
      // Use the generated Prisma model type for correct typing
      const rows: FallbackEvent[] = await this.prisma.fallbackEvent.findMany({
        where: { status: FallbackEventStatusEnum.PENDING },
        orderBy: { createdAt: 'asc' },
        take: limit,
      });
  
      return rows.map((r: FallbackEvent) =>  
      FallbackEvent.rehydrate({
          id:         r.id.value,
          name:       r.name.value,
          payload:    r.payload,
          status:     r.status.value,
          retries:    r.retries.value,
          creationDate:  r.creationDate.value,
          deletionDate:  r.deletionDate?.value,
        })
      );
    }
  
    async markProcessed(id: string): Promise<void> {
      await this.prisma.fallbackEvent.update({
        where: { id },
        data: { status: 'PROCESSED' },
      });
    }
  
    async incrementRetries(id: string): Promise<void> {
      await this.prisma.fallbackEvent.update({
        where: { id },
        data: { retries: { increment: 1 } },
      });
    }
  }