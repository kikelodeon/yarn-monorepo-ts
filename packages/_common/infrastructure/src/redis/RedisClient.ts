// packages/common/infrastructure/redisClient.ts
import { createClient, RedisClientType } from '@redis/client';

export interface RedisClientConfig {
  host?: string;
  port?: number;
  password?: string;
  url?: string;
}

class RedisClientSingleton {
  private static _instance: RedisClientSingleton;
  private client: RedisClientType;
  private timeoutMs = 2_000;
  private constructor(config: RedisClientConfig = {}) {
    const {
      url,
      host = '127.0.0.1',
      port = 6379,
      password,
    } = config;

    // pick one style of connection options
    const options = url
      ? { url }
      : { socket: { host, port }, password };

    this.client = createClient(options);

    this.client.on('error', (err) =>
      console.error('[RedisClient] Error', err)
    );
  }

  public static init(config: RedisClientConfig): void {
    if (!this._instance) {
      this._instance = new RedisClientSingleton(config);
    }
  }

  public static get ins(): RedisClientSingleton {
    if (!this._instance) {
      throw new Error('[RedisClient] Must call init(config) first');
    }
    return this._instance;
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
      console.info('[RedisClient] Connected to Redis.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('[RedisClient] Failed to connect:', message);
    }
  }

  async disconnect(): Promise<void> {
    await this.client.disconnect();
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string): Promise<void> {
    await this.client.set(key, value);
  }

  async healthCheck(): Promise<{ status: 'UP' | 'DOWN'; 
    message?: string; 
    latencyMs?: number }> {
const key = `__healthcheck:${Date.now()}`;
const start = Date.now();

const withTimeout = <T>(action: Promise<T>, name: string): Promise<T> =>
Promise.race([
action,
new Promise<T>((_, reject) =>
setTimeout(() => reject(new Error(`${name} timed out after ${this.timeoutMs}ms`)), 
this.timeoutMs)
),
]);

try {
const pong = await withTimeout(this.client.ping(), 'Redis PING');
if (pong !== 'PONG') {
throw new Error(`Unexpected PING response: ${pong}`);
}
const latency = Date.now() - start;
console.log(`[RedisClient] Health check: UP (${latency}ms)`);
return { status: 'UP', latencyMs: latency };

} catch (err) {
const message = (err as Error).message;
console.error('[RedisClient] Health check: DOWN', message);
return { status: 'DOWN', message };
}
}
}
export { RedisClientSingleton as RedisClient };
