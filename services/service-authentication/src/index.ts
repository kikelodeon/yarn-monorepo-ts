import 'reflect-metadata';
import dotenv from 'dotenv';
import express from 'express';
import { buildContainer } from './bootstrap/container';
import { dbLoad } from './bootstrap/dbLoad';
import { UserRoutes } from './routes/UserRoutes';

dotenv.config();

async function startServer() {
  // Construir (registrar) el contenedor de dependencias
  buildContainer();

  // Conectar la base de datos
  await dbLoad();

  // Iniciar Express
  const app = express();
  app.use(express.json());

  // Rutas para /users
  app.use('/users', UserRoutes);

  // Puesto a escuchar
  const port = process.env.APP_PORT || 3000;
  app.listen(port, () => console.log(`[Auth] listening on port ${port}`));
}

startServer().catch((err) => {
  console.error('[Auth] startup error:', err);
  process.exit(1);
});
