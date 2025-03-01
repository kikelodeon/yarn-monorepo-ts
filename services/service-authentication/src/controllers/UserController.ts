// services/service-authentication/src/controllers/UserController.ts

import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { logger } from '@kikerepo/common-infrastructure';
import { AuthenticationService,AuthenticationServiceToken  } from '@kikerepo/authentication-infrastructure';

export const UserControllerToken = Symbol('UserControllerToken');

@injectable()
export class UserController {
  constructor(
    @inject(AuthenticationServiceToken)
    private readonly authenticationService: AuthenticationService,
  ) {}

  public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Login endpoint called');
    try {
      // Se pasa el req.body directamente; el AuthenticationService se encarga de mapear internamente.
      const response = await this.authenticationService.login(req.body);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  public async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    logger.info('Register endpoint called');
    try {
      // Se delega en el servicio la transformación y el procesamiento.
      const response = await this.authenticationService.register(req.body);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
}
