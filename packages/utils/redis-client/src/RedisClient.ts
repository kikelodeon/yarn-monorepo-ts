import { createClient, RedisClientType } from 'redis';
import CircuitBreaker from 'opossum';

type RedisClientOptions = {
  host?: string;
  port?: number;
  password?: string;
  retries?: number;
  retryDelay?: number;
};

const fallbackStore: Record<string, string> = {};

class RedisClient {
  private client: RedisClientType;
  private retryOptions: { retries: number; delay: number };
  private circuitBreaker: CircuitBreaker;
  private isFallbackMode = false;

  constructor(options: RedisClientOptions = {}) {
    this.client = createClient({
      url: `redis://${options.host || 'localhost'}:${options.port || 6379}`,
      password: options.password,
    });

    this.retryOptions = {
      retries: options.retries || 5,
      delay: options.retryDelay || 1000,
    };

    this.circuitBreaker = new CircuitBreaker(() => this.ping(), {
      timeout: 3000,
      errorThresholdPercentage: 50,
      resetTimeout: 10000,
    });

    this.circuitBreaker.on('open', () => {
      console.warn('[RedisClient] Circuit breaker opened. Entering fallback mode.');
      this.isFallbackMode = true;
    });

    this.circuitBreaker.on('close', () => {
      console.info('[RedisClient] Circuit breaker closed. Exiting fallback mode.');
      this.isFallbackMode = false;
    });

    this.connectWithRetry().catch((err) => {
      console.error('[RedisClient] Failed to connect to Redis:', err);
    });
  }

  private async connectWithRetry(): Promise<void> {
    for (let attempt = 1; attempt <= this.retryOptions.retries; attempt++) {
      try {
        await this.client.connect();
        console.info('[RedisClient] Connected to Redis.');
        return;
      } catch (error) {
        console.error(`[RedisClient] Connection attempt ${attempt} failed:`, error);
        if (attempt < this.retryOptions.retries) {
          await new Promise((resolve) => setTimeout(resolve, this.retryOptions.delay * attempt));
        } else {
          console.error('[RedisClient] Could not connect to Redis after retries.');
          throw error;
        }
      }
    }
  }
  
  private async executeWithFallback<T>(
    operation: () => Promise<T>,
    fallbackKey: string,
    fallbackValue?: T
  ): Promise<T | undefined> {
    if (this.isFallbackMode) {
      console.warn(`[RedisClient] Fallback mode active. Using in-memory store for key: ${fallbackKey}`);
      return fallbackValue ?? (fallbackStore[fallbackKey] as T | undefined);
    }
  
    try {
      // Cast the result of `fire` to the desired type
      return (await this.circuitBreaker.fire(operation)) as T;
    } catch (error) {
      console.error('[RedisClient] Command failed. Falling back to in-memory store:', error);
      return fallbackValue ?? (fallbackStore[fallbackKey] as T | undefined);
    }
  }
  
  
  public async get(key: string): Promise<string | null> {
    return this.executeWithFallback(() => this.client.get(key), key) as Promise<string | null>;
  }

  public async set(key: string, value: string): Promise<void> {
    await this.executeWithFallback(() => this.client.set(key, value), key, value);
    fallbackStore[key] = value; // Update in-memory fallback store
  }

  public async ping(): Promise<string> {
    return this.client.ping();
  }

  public async healthCheck(): Promise<{ status: string; message: string }> {
    try {
      await this.ping();
      return { status: 'UP', message: 'Redis is connected.' };
    } catch {
      return { status: 'DOWN', message: 'Redis is not reachable.' };
    }
  }

  public async disconnect(): Promise<void> {
    await this.client.disconnect();
    console.info('[RedisClient] Disconnected from Redis.');
  }
}

export default RedisClient;
