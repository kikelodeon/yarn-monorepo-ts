// src/routes/UserRoutes.ts
import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { ErrorHandlerMiddleware } from '@kikerepo/application-common';

const userController = new UserController();

const userRoutes = Router();

/**
 * POST /register
 */
userRoutes.post(
  '/register',
  userController.register // Register user via the UserController
);

// Use the error handler middleware globally
userRoutes.use(ErrorHandlerMiddleware);

export { userRoutes };
