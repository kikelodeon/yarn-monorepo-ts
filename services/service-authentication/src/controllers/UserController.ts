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

export const UserControllerToken = Symbol('UserControllerToken');

@injectable()
export class UserController {
  constructor(
    @inject(RegisterCommandHandlerToken)
    private readonly registerCommandHandler: RegisterCommandHandler
  ) { }

  public register = async (
    req: Request<{}, {}, RegisterRequest>,
    res: Response<RegisterResponse>,
    next: NextFunction
  ): Promise<void> => {
    try {
      // 1) Extract raw strings from the request
      const command: RegisterCommand = RegisterRequestToRegisterCommandMapper.toCommand(req.body);

      // 2) Handle the command via the injected RegisterCommandHandler
      const result: RegisterResult | Error = await this.registerCommandHandler.handle(command);
      if(result instanceof Error) {
        next(result);
        return;
      }

      // 3) Map the result to a JSON-friendly DTO
      const response: RegisterResponse = RegisterResultToRegisterResponseMapper.toResponse(result);

      // 4) Send 201 Created
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };
}
