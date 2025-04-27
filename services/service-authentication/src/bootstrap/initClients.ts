// services/service-authentication/src/bootstrap/initClients.ts

import {
  PrismaClient,
  KafkaClient,
  RedisClient,
  TopicConfig,
  SubscriptionConfig,
} from '@kikerepo/common-infrastructure';
import { requireEnv } from '@kikerepo/utils-env';

export async function initializeInfrastructureClients(): Promise<void> {
  // 1) Prisma
  await PrismaClient.ins.connect();

  // 2) Redis
  await RedisClient.init({
    host: requireEnv('REDIS_HOST'),
    port: Number(requireEnv('REDIS_PORT')),
    password: requireEnv('REDIS_PASSWORD'),
  });
  await RedisClient.ins.connect();

  // 3) Kafka: init singleton
  await KafkaClient.init({
    brokers: requireEnv('KAFKA_BROKERS').split(','),
    clientId: requireEnv('KAFKA_CLIENT_ID'),
    ssl: requireEnv('KAFKA_USE_SSL') === 'true',
    sasl: {
      mechanism: requireEnv('KAFKA_SASL_MECHANISM') as any, // e.g. "plain"
      username: requireEnv('KAFKA_SASL_USERNAME'),
      password: requireEnv('KAFKA_SASL_PASSWORD'),
    },
    logLevel: requireEnv('KAFKA_LOG_LEVEL') as any,    // e.g. "INFO"
  });

  // 4) Define los tópicos que quieres crear al inicio
  const topicsToCreate: TopicConfig[] = [
    {
      topic: 'user-events',
      numPartitions: 3,
      replicationFactor: 2,            // en prod al menos 2–3
      configEntries: [
        { name: 'cleanup.policy', value: 'compact' },
      ],
    },
    // añade más tópicos aquí si los necesitas...
  ];

  // 5) Define las suscripciones del consumer
  const subscriptions: SubscriptionConfig[] = [
    //{
    //  topic: 'user-events',
    //  fromBeginning: false,           // sólo nuevos mensajes
    //},
    // añade más suscripciones si tu servicio also consume otros tópicos...
  ];

  // 6) Conecta producer, consumer, crea tópicos y suscribe
  await KafkaClient.ins.connect(topicsToCreate, subscriptions);
}
