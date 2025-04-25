// services/service-authentication/src/bootstrap/initClients.ts
import {
  PrismaClient,
  KafkaClient,
  RedisClient
} from '@kikerepo/common-infrastructure';

import { requireEnv } from '@kikerepo/utils-env';
export async function initializeInfrastructureClients(): Promise<void> {
  // Prisma
  await PrismaClient.ins.connect();

  // Redis
  await RedisClient.init({
    host: requireEnv('REDIS_HOST'),
    port: Number(requireEnv('REDIS_PORT')),
    password: requireEnv('REDIS_PASSWORD'),
  });

  await RedisClient.ins.connect();

  // Kafka
  await KafkaClient.init({
   
    brokers: requireEnv('KAFKA_BROKERS').split(','),
    clientId: requireEnv('KAFKA_CLIENT_ID'),
    ssl: requireEnv('KAFKA_USE_SSL') === 'true',
    sasl: {
      mechanism: requireEnv('KAFKA_SASL_MECHANISM') as any, // e.g. "plain"
      username: requireEnv('KAFKA_SASL_USERNAME'),
      password: requireEnv('KAFKA_SASL_PASSWORD'),
    },
    logLevel: requireEnv('KAFKA_LOG_LEVEL') as any,    // ← set your desired KafkaJS log level here
  });

  await KafkaClient.ins.connect();
}