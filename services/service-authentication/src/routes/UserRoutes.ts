// services/service-authentication/src/routes/UserRoutes.ts

import { Router, Request, Response, NextFunction } from 'express';
import { container } from '../bootstrap/container';
import { UserController, UserControllerToken } from '../controllers/UserController'; 
import { ErrorHandlerMiddleware, ValidationMiddleware } from '@kikerepo/application-common';
import { RegisterCommand } from '@kikerepo/application-user';
import { NotFoundError } from '@kikerepo/contracts-common';

const userRoutes = Router();

// Resolve the UserController from the container using the defined token
const userController = container.get<UserController>(UserControllerToken);

// Define the POST /register route with validation and controller handler
userRoutes.post(
  '/register',
  ValidationMiddleware(RegisterCommand),
  userController.register.bind(userController) // Ensure correct 'this' context
);

// Optional: Define other user-related routes here
// Example:
// userRoutes.post(
//   '/login',
//   ValidationMiddleware(LoginCommand),
//   userController.login.bind(userController)
// );

// 404 Handler for Undefined Routes within this Router
userRoutes.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json( new NotFoundError( ));
});

// Error Handling Middleware
userRoutes.use(ErrorHandlerMiddleware);

export { userRoutes };
