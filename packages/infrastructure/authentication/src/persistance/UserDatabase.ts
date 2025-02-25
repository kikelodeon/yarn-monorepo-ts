// services/service-authentication/src/bootstrap/prismaClient.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function connectPrisma(): Promise<void> {
  try {
    await prisma.$connect();
    console.log('[PrismaClient] Connected to PostgreSQL');
  } catch (error) {
    console.error('[PrismaClient] Connection error:', error);
    process.exit(1);
  }
}

export async function disconnectPrisma(): Promise<void> {
  try {
    await prisma.$disconnect();
    console.log('[PrismaClient] Disconnected from PostgreSQL');
  } catch (error) {
    console.error('[PrismaClient] Disconnection error:', error);
  }
}

export { prisma };
