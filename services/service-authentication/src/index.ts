// services/service-authentication/src/index.ts
import 'reflect-metadata';
import dotenv from 'dotenv';
import express from 'express';
import { buildContainer, container } from './bootstrap/container';
import { userRoutes } from './routes/UserRoutes';

dotenv.config();

async function startServer() {
  // 1) Build container -> connect Prisma
  await buildContainer();

  // 2) Create Express server
  const app = express();
  app.use(express.json());

  // 3) Mount routes
  app.use('/users', userRoutes);

  // 4) Listen
  const port = process.env.APP_PORT || 3000;
  app.listen(port, () => console.log(`[Auth] Listening on port ${port}`));
}

startServer().catch((err) => {
  console.error('[Auth] Startup error:', err);
  process.exit(1);
});
