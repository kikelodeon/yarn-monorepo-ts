import { createClient, RedisClientType } from '@redis/client';

export interface RedisClientConfig {
  host?: string;
  port?: number;
  password?: string;
  url?: string; // Optional for full Redis connection URL
}

export class RedisClient {
  private client: RedisClientType;

  constructor(private config: RedisClientConfig = {}) {
    const { host = '127.0.0.1', port = 6379, password= "mama-redis-1234", url } = config;

    if (url) {
      this.client = createClient({ url });
    } else {
      this.client = createClient({
        socket: { host, port },
        password,
      });
    }
  }

  public async connect(): Promise<void> {
    try {
      await this.client.connect();
      console.info('[RedisClient] Connected to Redis.');
    } catch (error) {
      console.error('[RedisClient] Failed to connect to Redis:', error);
    }
  }

  public async disconnect(): Promise<void> {
    await this.client.disconnect();
    console.info('[RedisClient] Disconnected from Redis.');
  }

  public async set(key: string, value: string): Promise<void> {
    await this.client.set(key, value);
  }

  public async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }
  public async healthCheck(): Promise<{ status: string; message?: string }> {
    try {
      const response = await this.client.ping();
      if (response === 'PONG') {
        return { status: 'UP' };
      } else {
        return { status: 'DOWN', message: 'Unexpected response from Redis.' };
      }
    } catch (error) {
      let message = 'An unknown error occurred';
      if (error instanceof Error) {
        message = error.message; // Narrow the type to Error
      }
      return { status: 'DOWN', message };
    }
  }
}
