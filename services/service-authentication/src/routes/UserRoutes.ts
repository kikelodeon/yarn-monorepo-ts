// services/service-authentication/src/routes/UserRoutes.ts
import { Router, Request, Response, NextFunction } from 'express';
import { container } from '../bootstrap/container';
import { UserController, UserControllerToken } from '../controllers/UserController';
import { ErrorHandlerMiddleware, ValidationMiddleware } from '@kikerepo/application-common';
import { LoginQuery, RegisterCommand } from '@kikerepo/application-user';
import { LoginRequest } from '@kikerepo/contracts-user';
import { NotFoundError } from '@kikerepo/contracts-common';

const userRoutes = Router();
const userController = container.get<UserController>(UserControllerToken);

// Ruta de registro
userRoutes.post(
  '/register',
  ValidationMiddleware(RegisterCommand),
  userController.register.bind(userController)
);

// Ruta de login
userRoutes.post(
  '/login',
  ValidationMiddleware(LoginQuery), // O utiliza un DTO específico para login (LoginRequest)
  userController.login.bind(userController)
);

// 404 Handler para rutas no definidas
userRoutes.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json(new NotFoundError());
});

// Middleware de manejo de errores
userRoutes.use(ErrorHandlerMiddleware);

export { userRoutes };
