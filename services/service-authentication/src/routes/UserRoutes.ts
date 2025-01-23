import { Router, Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';

import {
  UserLoginRequest,
  UserRegisterRequest,
  UserRegisterResponse,
  UserLoginResponse
} from '@kikerepo/contracts-user';

import { UserService } from '../services/UserService';
import { UserRegisterCommand } from '@kikerepo/application-user';
import { Email, InputPassword, Phone } from '@kikerepo/domain-user';

export const UserRoutes = Router();

/**
 * POST /login
 */
UserRoutes.post(
  '/login',
  async (
    req: Request<{}, {}, UserLoginRequest>,
    res: Response<UserLoginResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, password } = req.body;
      // Lógica de login
      res.status(200).json({ token: 'fake-jwt-token' });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /register
 */
UserRoutes.post(
  '/register',
  async (
    req: Request<{}, {}, UserRegisterRequest & { phone?: string }>, // Extendemos para phone
    res: Response<UserRegisterResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, password, phone } = req.body;

      // Obtenemos UserService via contenedor
      const userService = container.resolve(UserService);

      // Creamos comando y llamamos al servicio
      const registerCommand = new UserRegisterCommand(new Email(email), new InputPassword(password), phone ? new Phone(phone) : undefined);
      await userService.registerUser(registerCommand);

      // Devolvemos la respuesta
      const response: UserRegisterResponse = {
        token: 'fake-register-jwt-token'
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
);
