// packages/common/infrastructure/kafkaClient.ts

import { Kafka, Producer, Consumer, logLevel as LogLevel, SASLOptions, ProducerRecord } from 'kafkajs';
import CircuitBreaker from 'opossum';
import { FallbackEventRepository } from './FallbackEventRepository';
import {
  FallbackEvent,
  FallbackEventName,
  FallbackEventPayload,
} from '@kikerepo/common-domain';
import { logger } from '../logging';

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

  private repository = new FallbackEventRepository();
  private publishBreaker: CircuitBreaker<[ProducerRecord], any>;
  private buffering = false;
  private serviceName: string;

  private constructor(config: KafkaClientConfig) {
    this.serviceName = config.clientId;
    this.kafka = new Kafka({
      clientId: config.clientId,
      brokers: config.brokers,
      ssl: config.ssl ?? false,
      sasl: config.sasl,
      logLevel: config.logLevel ? LogLevel[config.logLevel] : LogLevel.INFO,
    });

    if (!config.useConsumerOnly) {
      this.producer = this.kafka.producer({
        allowAutoTopicCreation: true,
        idempotent: true,
        maxInFlightRequests: 1,
        retry: {
          retries: Number.MAX_SAFE_INTEGER,
          initialRetryTime: 300,
          factor: 2,
        },
      });
    }

    if (!config.useProducerOnly) {
      this.consumer = this.kafka.consumer({
        groupId: config.consumerGroupId ?? `${config.clientId}-group`,
      });
    }

    const sendAction = (record: ProducerRecord) => {
      if (!this.producer) {
        return Promise.reject(new Error('Producer not initialized'));
      }
      return this.producer.send(record);
    };

    this.publishBreaker = new CircuitBreaker(sendAction, {
      timeout: 5000,
      errorThresholdPercentage: 1,
      resetTimeout: 30000,
      rollingCountTimeout: 300000,
      rollingCountBuckets: 1,
    });

    this.publishBreaker.on('open', () => {
      this.buffering = true;
      logger.warn('[KafkaCB] Circuit OPEN — all publishes buffered');
    });
    this.publishBreaker.on('halfOpen', async () => {
      logger.info('[KafkaCB] HALF-OPEN — draining buffer before Kafka test');
      try {
        await this.flushBuffer();
        this.publishBreaker.close();
        logger.info('[KafkaCB] Buffer drained & Kafka healthy — circuit CLOSED');
      } catch (err) {
        this.publishBreaker.open();
        logger.warn('[KafkaCB] Drain failed — circuit remains OPEN');
      }
    });
    this.publishBreaker.on('close', () => {
      this.buffering = false;
      logger.info('[KafkaCB] Circuit CLOSED — direct publishes resumed');
    });
  }

  public static init(config: KafkaClientConfig): void {
    if (!this._instance) {
      this._instance = new KafkaClientSingleton(config);
    }
  }

  public static get ins(): KafkaClientSingleton {
    if (!this._instance) {
      throw new Error('[KafkaClient] Must call init(config) first');
    }
    return this._instance;
  }

  public async connect(): Promise<void> {
    const tasks: Promise<any>[] = [];
    if (this.producer) tasks.push(this.producer.connect());
    if (this.consumer) tasks.push(this.consumer.connect());
    await Promise.all(tasks);
    logger.info('[KafkaClient] Connected');

    try {
      await this.flushBuffer();
      this.publishBreaker.close();
      logger.info('[KafkaClient] Buffer drained on connect — circuit CLOSED');
    } catch (err: unknown) {
      this.publishBreaker.open();
      logger.warn('[KafkaClient] Buffer drain on connect failed — circuit OPEN');
    }
  }

  public async disconnect(): Promise<void> {
    const tasks: Promise<any>[] = [];
    if (this.producer) tasks.push(this.producer.disconnect());
    if (this.consumer) tasks.push(this.consumer.disconnect());
    await Promise.all(tasks);
    logger.info('[KafkaClient] Disconnected');
  }

  public async publish(record: ProducerRecord): Promise<void> {
    if (this.buffering) {
      logger.warn('[KafkaClient] Buffering mode active — saving to fallback');
      return this.bufferRecord(record);
    }

    try {
      await this.publishBreaker.fire(record);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      logger.error(`[KafkaClient] Publish failed, buffering: ${msg}`);
      await this.bufferRecord(record);
    }
  }

  private async bufferRecord(record: ProducerRecord): Promise<void> {
    const msg = record.messages[0];
    const data = JSON.parse(msg.value?.toString() ?? '{}');
    const fallback = FallbackEvent.createUnique(
      new FallbackEventName(record.topic),
      new FallbackEventPayload(data)
    );
    await this.repository.save(fallback);
  }

  private async flushBuffer(): Promise<void> {
    if (!this.producer) return;
    while (true) {
      const pending = await this.repository.findPending(100);
      if (!pending.length) break;
      for (const evt of pending) {
        try {
          await this.producer.send({
            topic: evt.name.value,
            messages: [{ key: evt.id.value, value: JSON.stringify(evt.payload.value) }],
          });
          await this.repository.markProcessed(evt.id.value);
        } catch {
          await this.repository.incrementRetries(evt.id.value);
          throw new Error('Buffered event send failed');
        }
      }
    }
  }

  public async healthCheck(): Promise<{ status: 'UP'|'DOWN'; message?: string; latencyMs?: number }> {
    const timeoutMs = 5000;
    const start = Date.now();
    const admin = this.kafka.admin();
    const withTimeout = <T>(action: Promise<T>, name: string) =>
      Promise.race([
        action,
        new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`${name} timed out after ${timeoutMs}ms`)), timeoutMs)),
      ]);

    try {
      await withTimeout(admin.connect(), 'Kafka admin.connect');
      if (process.env.KAFKA_HEALTH_CHECK_FULL === 'true') {
        await withTimeout(admin.fetchTopicMetadata(), 'Kafka admin.fetchTopicMetadata');
      }
      await withTimeout(admin.disconnect(), 'Kafka admin.disconnect');
      return { status: 'UP', latencyMs: Date.now() - start };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      try { await admin.disconnect(); } catch {}
      return { status: 'DOWN', message: msg, latencyMs: Date.now() - start };
    }
  }
}

export { KafkaClientSingleton as KafkaClient };
