// services/service-authentication/src/index.ts

import 'reflect-metadata';
import dotenv from 'dotenv';
import express from 'express';
import { buildContainer, container } from './bootstrap/container';
import { CreateUserRoutes } from './routes'; // Importamos la función, no el controlador directamente
import { UserControllerToken } from './controllers';

dotenv.config();

async function startServer() {
  // Aseguramos la inicialización completa (por ejemplo, conexión a la base de datos)
  await buildContainer();

  // Obtenemos el controlador del contenedor (ya inicializado)
  const userController = container.get<any>(UserControllerToken); // o con el tipo correcto

  // Creamos las rutas pasando el controlador
  const userRoutes = CreateUserRoutes(userController);

  const app = express();
  app.use(express.json());
  app.use('/users', userRoutes);

  const port = process.env.APP_PORT || 3000;
  app.listen(port, () => console.log(`[Auth] Listening on port ${port}`));
}

startServer().catch((err) => {
  console.error('[Auth] Startup error:', err);
  process.exit(1);
});
