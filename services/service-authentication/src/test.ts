import { createClient } from 'redis';
import { PrismaClient } from '@prisma/client';
import { Kafka } from 'kafkajs';

async function testConnections() {
  console.log('🔄 Iniciando prueba de conexiones...\n');

  // PostgreSQL
  try {
    const prisma = new PrismaClient();
    await prisma.$connect();
    console.log('✅ PostgreSQL conectado correctamente\n');
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error conectando a PostgreSQL:', error);
  }

  // Redis
  try {
    const redis = createClient({
      password: process.env.REDIS_PASSWORD,
      socket: {
        host: 'redis',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    });

    redis.on('error', err => console.error('❌ Redis error:', err));
    await redis.connect();
    console.log('✅ Redis conectado correctamente\n');
    await redis.disconnect();
  } catch (error) {
    console.error('❌ Error conectando a Redis:', error);
  }

  // Kafka
  try {
    const kafka = new Kafka({
      clientId: 'auth-service',
      brokers: ['kafka:9092'], // Ojo: esto asume que el contenedor Kafka se llama 'kafka'
    });

    const admin = kafka.admin();
    await admin.connect();
    console.log('✅ Kafka conectado correctamente\n');
    await admin.disconnect();
  } catch (error) {
    console.error('❌ Error conectando a Kafka:', error);
  }

  console.log('🔚 Prueba de conexiones terminada.');
}

testConnections();
