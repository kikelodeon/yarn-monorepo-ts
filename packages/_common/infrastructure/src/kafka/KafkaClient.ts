import { Kafka, Producer, Consumer, logLevel as LogLevel, SASLOptions, ProducerRecord, Admin } from 'kafkajs';
import CircuitBreaker from 'opossum';
import { FallbackEventRepository } from './FallbackEventRepository';
import {
  FallbackEvent,
  FallbackEventName,
  FallbackEventPayload,
} from '@kikerepo/common-domain';
import { logger } from '../logging';

// Configuración para creación de topics
export interface TopicConfig {
  topic: string;
  numPartitions: number;
  replicationFactor: number;
  configEntries?: { name: string; value: string }[];
}

// Configuración para suscripción de consumer
export interface SubscriptionConfig {
  topic: string;
  fromBeginning?: boolean;
}

// Opciones de inicialización de KafkaClient
export interface KafkaClientConfig {
  brokers: string[];
  clientId: string;
  consumerGroupId?: string;
  useProducerOnly?: boolean;
  useConsumerOnly?: boolean;
  logLevel?: 'NOTHING' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  ssl?: boolean;
  sasl?: SASLOptions;
  // Parámetros de flushBuffer (pueden provenir de env)
  flushBatchSize?: number;
  flushRetryDelayMs?: number;
}

// Opciones para flushBuffer
export interface FlushOptions {
  batchSize?: number;      // nº de eventos a buscar cada vez
  retryDelayMs?: number;   // milisegundos a esperar tras un fallo
}

export class KafkaClientSingleton {
  private static _instance: KafkaClientSingleton;
  private kafka: Kafka;
  public producer?: Producer;
  public consumer?: Consumer;
  private admin: Admin;
  private repository = new FallbackEventRepository();
  private publishBreaker: CircuitBreaker<[ProducerRecord], any>;
  private buffering = false;
  private serviceName: string;
  private flushBatchSize: number;
  private flushRetryDelayMs: number;

  private constructor(config: KafkaClientConfig) {
    this.serviceName = config.clientId;
    this.flushBatchSize = config.flushBatchSize ?? 100;
    this.flushRetryDelayMs = config.flushRetryDelayMs ?? 5000;

    logger.debug(`[KafkaClient] Initializing client for '${this.serviceName}' with brokers ${config.brokers}`, {
      flushBatchSize: this.flushBatchSize,
      flushRetryDelayMs: this.flushRetryDelayMs
    });

    this.kafka = new Kafka({
      clientId: config.clientId,
      brokers: config.brokers,
      ssl: config.ssl ?? false,
      sasl: config.sasl,
      logLevel: config.logLevel ? LogLevel[config.logLevel] : LogLevel.INFO,
    });

    if (!config.useConsumerOnly) {
      this.producer = this.kafka.producer({
        allowAutoTopicCreation: false,
        idempotent: true,
        retry: { retries: 1, initialRetryTime: 300, factor: 2 },
      });
      logger.debug('[KafkaClient] Producer initialized');
    }

    const groupId = config.consumerGroupId ?? `${config.clientId}-group`;
    if (!config.useProducerOnly) {
      this.consumer = this.kafka.consumer({ groupId });
      logger.debug(`[KafkaClient] Consumer initialized with group '${groupId}'`);
    }

    this.admin = this.kafka.admin();
    logger.debug('[KafkaClient] Admin client initialized');

    const sendAction = (record: ProducerRecord) => {
      if (!this.producer) {
        return Promise.reject(new Error('Producer not initialized'));
      }
      logger.debug(`[KafkaClient] Sending record to topic '${record.topic}'...`);
      return this.producer.send(record);
    };

    this.publishBreaker = new CircuitBreaker(sendAction, {
      timeout: 5000,
      errorThresholdPercentage: 50,
      resetTimeout: 30000,
    });

    this.publishBreaker.on('open', () => {
      this.buffering = true;
      logger.warn('[KafkaClient] Circuit OPEN — buffering publishes');
    });
    this.publishBreaker.on('halfOpen', async () => {
      logger.info('[KafkaClient] Circuit HALF-OPEN — flushing buffer');
      await this.flushBuffer();
    });
    this.publishBreaker.on('close', () => {
      this.buffering = false;
      logger.info('[KafkaClient] Circuit CLOSED — resuming publishes');
    });
  }

  public static init(config: KafkaClientConfig): void {
    if (!this._instance) {
      this._instance = new KafkaClientSingleton(config);
      logger.info('[KafkaClient] Singleton instance created');
    }
  }

  public static get ins(): KafkaClientSingleton {
    if (!this._instance) {
      throw new Error('[KafkaClient] Must call init(config) first');
    }
    return this._instance;
  }

  /**
   * Conecta producer, consumer, crea topics y suscribe.
   */
  public async connect(
    topicsToCreate: TopicConfig[] = [],
    subscriptions: SubscriptionConfig[] = []
  ): Promise<void> {
    logger.info('[KafkaClient] Starting connect sequence');

    // 1) Crear topics con AdminClient (idempotente)
    if (topicsToCreate.length) {
      logger.info('[KafkaClient] Checking existing topics for creation');
      await this.admin.connect();
      const metadata = await this.admin.fetchTopicMetadata();
      const existing = metadata.topics.map(t => t.name);
      const toCreate = topicsToCreate.filter(t => !existing.includes(t.topic));

      if (toCreate.length) {
        logger.info('[KafkaClient] Creating new topics:', JSON.stringify(toCreate));
        try {
          const created = await this.admin.createTopics({
            topics: toCreate.map(t => ({
              topic: t.topic,
              numPartitions: t.numPartitions,
              replicationFactor: t.replicationFactor,
              configEntries: t.configEntries,
            })),
            waitForLeaders: true,
          });
          if (created) {
            logger.info('[KafkaClient] Topics created successfully');
          } else {
            logger.warn('[KafkaClient] No topics were created');
          }
        } catch (err: any) {
          logger.warn('[KafkaClient] Error creating topics (ignored):', { error: err.message });
        }
      } else {
        logger.info('[KafkaClient] All topics already exist, skipping creation');
      }
      await this.admin.disconnect();
    }

    // 2) Conectar producer y consumer
    const tasks: Promise<any>[] = [];
    if (this.producer) {
      tasks.push(
        this.producer.connect().then(() => logger.info('[KafkaClient] Producer connected'))
      );
    }
    if (this.consumer) {
      tasks.push(
        this.consumer.connect().then(() => logger.info('[KafkaClient] Consumer connected'))
      );
    }
    await Promise.all(tasks);
    logger.info('[KafkaClient] Connected');

    // 3) Suscribir consumer a topics
    if (this.consumer) {
      for (const s of subscriptions) {
        logger.info(
          `[KafkaClient] Subscribing to topic '${s.topic}', fromBeginning=${s.fromBeginning}`
        );
        await this.consumer.subscribe({ topic: s.topic, fromBeginning: !!s.fromBeginning });
      }
      logger.info('[KafkaClient] Subscriptions completed');
    }

    // 4) Flushear buffer y cerrar circuito
    try {
      logger.info('[KafkaClient] Draining buffer');
      await this.flushBuffer();
      this.publishBreaker.close();
      logger.info('[KafkaClient] Buffer drained on connect — circuit CLOSED');
    } catch (err: any) {
      this.publishBreaker.open();
      logger.warn('[KafkaClient] Buffer drain failed — circuit OPEN', { error: err.message });
    }
  }

  public async publish(record: ProducerRecord): Promise<void> {
    if (this.buffering) {
      logger.warn('[KafkaClient] Buffering mode active — saving to fallback', { topic: record.topic });
      await this.bufferRecord(record);
      return;
    }

    try {
      await this.publishBreaker.fire(record);
      logger.debug('[KafkaClient] Record published successfully', { topic: record.topic });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      logger.error(`[KafkaClient] publish failed, buffering: ${msg}`, { topic: record.topic });
      await this.bufferRecord(record);
    }
  }

  private async bufferRecord(record: ProducerRecord): Promise<void> {
    const message = record.messages[0];
    const raw = message.value?.toString() ?? '{}';
    const payload = JSON.parse(raw);
    const fallback = FallbackEvent.createUnique(
      new FallbackEventName(record.topic),
      new FallbackEventPayload(payload)
    );
    await this.repository.save(fallback);
    logger.info('[KafkaClient] Record buffered to fallback repository', {
      topic: record.topic,
      eventId: fallback.id.value,
    });
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Envía en bloques de eventos pendientes, reintentando TODO el bloque si falla cualquiera de ellos.
   * @param options.batchSize    Tamaño de cada búsqueda (por defecto: flushBatchSize del config)
   * @param options.retryDelayMs Retraso tras un fallo de cualquier evento (por defecto: flushRetryDelayMs del config)
   */
  public async flushBuffer(options: FlushOptions = {}): Promise<void> {
    if (!this.producer) return;
    const batchSize    = options.batchSize ?? this.flushBatchSize;
    const retryDelayMs = options.retryDelayMs ?? this.flushRetryDelayMs;

    logger.info('[KafkaClient] start flushBuffer loop', { batchSize, retryDelayMs });

    outer: while (true) {
      const pending = await this.repository.findPending(batchSize);
      logger.debug('[KafkaClient] Found pending events', { count: pending.length });
      if (!pending.length) break;

      for (const evt of pending) {
        try {
          logger.debug('[KafkaClient] Flushing fallback event', { eventId: evt.id.value });
          await this.producer.send({
            topic: evt.name.value,
            messages: [{ key: evt.id.value, value: JSON.stringify(evt.payload.value) }],
          });
          await this.repository.markProcessed(evt.id.value);
          logger.info('[KafkaClient] Flushed fallback event', { eventId: evt.id.value });
        } catch (err: any) {
          await this.repository.incrementRetries(evt.id.value);
          logger.warn('[KafkaClient] flushBuffer failed – will retry batch', {
            eventId: evt.id.value,
            error: err.message,
          });
          logger.info('[KafkaClient] Waiting before retrying batch', { retryDelayMs });
          await this.delay(retryDelayMs);
          continue outer;  // vuelve a buscar el mismo bloque completo
        }
      }
    }

    logger.info('[KafkaClient] flushBuffer completed, no more pending events');
  }

  public async healthCheck(): Promise<{ status: 'UP' | 'DOWN'; message?: string; latencyMs?: number }> {
    const admin = this.kafka.admin();
    const timeoutMs = 5000;
    const start = Date.now();
    logger.debug('[KafkaClient] Running healthCheck');

    const withTimeout = <T>(action: Promise<T>, name: string) =>
      Promise.race([
        action,
        new Promise<T>((_, reject) =>
          setTimeout(() => reject(new Error(`${name} timed out`)), timeoutMs)
        ),
      ]);

    try {
      await withTimeout(admin.connect(), 'admin.connect');
      await withTimeout(admin.disconnect(), 'admin.disconnect');
      const latency = Date.now() - start;
      logger.info('[KafkaClient] Health check UP', { latencyMs: latency });
      return { status: 'UP', latencyMs: latency };
    } catch (err: any) {
      try { await admin.disconnect(); } catch {}
      const latency = Date.now() - start;
      logger.error('[KafkaClient] Health check DOWN', { error: err.message, latencyMs: latency });
      return { status: 'DOWN', message: err.message, latencyMs: latency };
    }
  }
}

export { KafkaClientSingleton as KafkaClient };