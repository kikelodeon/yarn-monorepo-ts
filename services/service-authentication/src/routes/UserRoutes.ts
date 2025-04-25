// services/service-authentication/src/routes/UserRoutes.ts

import { Router, Request, Response, NextFunction } from 'express';
import { ErrorHandlerMiddleware, ValidationMiddleware } from '@kikerepo/common-application';
import { NotFoundError } from '@kikerepo/common-contracts';

import { LoginQuery, RegisterCommand } from '@kikerepo/authentication-application';

import { healthCheck } from './healthCheck';

// Aquí no importamos container ni resolvemos el controlador.
// Simplemente exportamos una función que recibe el controlador ya instanciado.
export function CreateUserRoutes(userController: { 
  login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  register: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}): Router {
  const router = Router();

  // Ruta de registro
  router.post(
    '/register',
    ValidationMiddleware(RegisterCommand),
    userController.register.bind(userController)
  );

  // Ruta de login
  router.post(
    '/login',
    ValidationMiddleware(LoginQuery),
    userController.login.bind(userController)
  );
  
    // Ruta de health
  router.get('/health', async (_req, res) => {
    healthCheck(_req, res);
  });
  
  // 404 Handler para rutas no definidas
  router.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json(new NotFoundError());
  });

  
  // Middleware de manejo de errores
  router.use(ErrorHandlerMiddleware);

  return router;
}
