// packages/common/infrastructure/kafkaClient.ts
import { Kafka, Producer, Consumer, logLevel as LogLevel, SASLOptions } from 'kafkajs';

export interface KafkaClientConfig {
  brokers: string[];
  clientId: string;
  consumerGroupId?: string;
  useProducerOnly?: boolean;
  useConsumerOnly?: boolean;
  logLevel?: 'NOTHING' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  ssl?: boolean;
  sasl?: SASLOptions;
}

class KafkaClientSingleton {
  private static _instance: KafkaClientSingleton;
  private kafka: Kafka;
  public producer?: Producer;
  public consumer?: Consumer;

  private constructor(config: KafkaClientConfig) {
    this.kafka = new Kafka({
      clientId: config.clientId,
      brokers: config.brokers,
      ssl: config.ssl ?? false,
      sasl: config.sasl,
      logLevel:
        config.logLevel === 'NOTHING' ? LogLevel.NOTHING :
        config.logLevel === 'DEBUG'   ? LogLevel.DEBUG   :
        config.logLevel === 'WARN'    ? LogLevel.WARN    :
        config.logLevel === 'ERROR'   ? LogLevel.ERROR   :
        LogLevel.INFO,
    });

    if (!config.useConsumerOnly) {
      this.producer = this.kafka.producer();
    }
    if (!config.useProducerOnly) {
      this.consumer = this.kafka.consumer({
        groupId: config.consumerGroupId ?? `${config.clientId}-group`,
      });
    }
  }

  /** Initialize singleton (call once at startup) */
  public static init(config: KafkaClientConfig): void {
    if (!this._instance) {
      this._instance = new KafkaClientSingleton(config);
    }
  }

  /** Retrieve the one instance */
  public static get ins(): KafkaClientSingleton {
    if (!this._instance) {
      throw new Error('[KafkaClient] Must call init(config) first');
    }
    return this._instance;
  }

  /** Connect producer & consumer in parallel */
  public async connect(): Promise<void> {
    const tasks: Promise<any>[] = [];
    if (this.producer) tasks.push(this.producer.connect());
    if (this.consumer) tasks.push(this.consumer.connect());
    await Promise.all(tasks).then(() => {console.log('[KafkaClient] Connected to Kafka')});
  }

  /** Disconnect producer & consumer in parallel */
  public async disconnect(): Promise<void> {
    const tasks: Promise<any>[] = [];
    if (this.producer) tasks.push(this.producer.disconnect());
    if (this.consumer) tasks.push(this.consumer.disconnect());
    await Promise.all(tasks);
  }

  /**
   * Health check: simply connect() → [optional metadata] → disconnect()
   * Measures round-trip latency, and returns UP or DOWN.
   *
   * If you really want to probe the broker metadata, set
   * KAFKA_HEALTH_CHECK_FULL=true in your env.
   */
  public async healthCheck(): Promise<{ status: 'UP' | 'DOWN'; message?: string; latencyMs?: number }> {
    const timeoutMs = 5_000;
    const start = Date.now();

    const withTimeout = <T>(action: Promise<T>, name: string): Promise<T> =>
      Promise.race([
        action,
        new Promise<T>((_, reject) =>
          setTimeout(() => reject(new Error(`${name} timed out after ${timeoutMs}ms`)), timeoutMs)
        ),
      ]);
    const admin = this.kafka.admin();
    try {
      // 1) connect producer+consumer
      await withTimeout(admin.connect(), 'KafkaClient.connect');

      // 2) optional metadata probe
      if (process.env.KAFKA_HEALTH_CHECK_FULL === 'true') {
        const admin = this.kafka.admin();
        await withTimeout(admin.connect(), 'Kafka admin.connect');
        await withTimeout(admin.fetchTopicMetadata(), 'Kafka admin.fetchTopicMetadata');
        await admin.disconnect();
      }

      // 3) clean disconnect
      await withTimeout(admin.disconnect(), 'KafkaClient.disconnect');

      const latency = Date.now() - start;
      console.log(`[KafkaClient] Health check: UP (${latency}ms)`);
      return { status: 'UP', latencyMs: latency };
    } catch (err) {
      const latency = Date.now() - start;
      const message = (err as Error).message;
      console.error(`[KafkaClient] Health check: DOWN - ${message} (${latency}ms)`);
      // best effort cleanup
      try { await admin.disconnect(); } catch {}
      return { status: 'DOWN', message, latencyMs: latency };
    }
  }
}

export { KafkaClientSingleton as KafkaClient };
