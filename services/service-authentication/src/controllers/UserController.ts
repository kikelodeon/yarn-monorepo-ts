// services/service-authentication/src/controllers/UserController.ts

import { Request, Response, NextFunction } from 'express';
import {
  RegisterCommandHandler,
  RegisterCommandHandlerToken,
  RegisterResultToRegisterResponseMapper,
  RegisterRequestToRegisterCommandMapper,
  RegisterCommand,
  RegisterResult
} from '@kikerepo/application-user';
import {
  RegisterRequest,
  RegisterResponse
} from '@kikerepo/contracts-user';
import { injectable, inject } from 'inversify';
import { logger } from '@kikerepo/infrastructure-common'; // <--- Logger

export const UserControllerToken = Symbol('UserControllerToken');
@injectable()
export class UserController {
  constructor(
    @inject(RegisterCommandHandlerToken) private readonly registerCommandHandler: RegisterCommandHandler
  ) {}

  public register = async (
    req: Request<{}, {}, RegisterRequest>,
    res: Response<RegisterResponse>,
    next: NextFunction
  ): Promise<void> => {
    logger.info('Register endpoint called');

    try {
      const command = RegisterRequestToRegisterCommandMapper.toCommand(req.body);
      const result = await this.registerCommandHandler.handle(command);

      if (result instanceof Error) {
        return next(result);
      }

      const response = RegisterResultToRegisterResponseMapper.toResponse(result);
      logger.info('User registered. Sending response');
      res.status(201).json(response);

    } catch (error) {
      next(error);
    }
  };
}