// packages/common/infrastructure/prismaClient.ts
import { PrismaClient as Pc } from '@prisma/client';
import { logger } from '../logging';

class PrismaClient {
  private static _instance: PrismaClient;
  private client: Pc;

  private constructor() {
    this.client = new Pc();
  }

  public static init(): void {
    if (!this._instance) {
      this._instance = new PrismaClient();
    }
  }

  public static get ins(): PrismaClient {
    if (!this._instance) {
      PrismaClient.init();
    }
    return this._instance;
  }

  get prisma(): Pc {
    return this.client;
  }

  async connect(): Promise<void> {
    try {
      await this.client.$connect();
      logger.info('[PrismaClient] Connected to PostgreSQL');
    } catch (error) {
      logger.error('[PrismaClient] Connection error:', error);
      process.exit(1);
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.client.$disconnect();
      logger.info('[PrismaClient] Disconnected from PostgreSQL');
    } catch (error) {
      logger.error('[PrismaClient] Disconnection error:', error);
    }
  }

  async healthCheck(): Promise<{ status: 'UP' | 'DOWN'; message?: string; latencyMs?: number }> {
    const start = Date.now();
    try {
      await this.client.$queryRaw`SELECT 1`;
      const latency = Date.now() - start;
      logger.info(`[PrismaClient] Health check: UP (${latency}ms)`);
      return { status: 'UP', latencyMs: latency };
    } catch (error: any) {
      const latency = Date.now() - start;
      const message = error?.message ?? 'Unknown error';
      logger.error(`[PrismaClient] Health check: DOWN - ${message} (${latency}ms)`);
      return { status: 'DOWN', message, latencyMs: latency };
    }
  }
  
}

export { PrismaClient };
