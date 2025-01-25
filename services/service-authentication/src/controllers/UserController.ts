// src/presentation/controllers/UserController.ts
import { Request, Response, NextFunction } from 'express';
import { RegisterCommandHandler ,RegisterResultToRegisterResponseMapper } from '@kikerepo/application-user';
import { RegisterRequest,RegisterResponse as RegisterResponse } from '@kikerepo/contracts-user';
import { UserRepository } from '@kikerepo/infrastructure-user';
import { ValidationBehaviour } from '@kikerepo/application-common';
import { ValidationError } from '@kikerepo/contracts-common';

export class UserController {
  private registerCommandHandler: RegisterCommandHandler;

  constructor() {
    const userRepository = new UserRepository(); // Instantiate repository
    const validationService = new ValidationBehaviour(); // Instantiate ValidationService
    this.registerCommandHandler = new RegisterCommandHandler(userRepository, validationService); // Inject into the handler
  }

  /**
   * Handle the user registration request.
   * @param req - The request object.
   * @param res - The response object.
   * @param next - The next middleware function.
   */
  public register = async (
    req: Request<{}, {}, RegisterRequest>, // Request object with UserRegisterRequest
    res: Response<RegisterResponse>, // Response object with UserRegisterResponse
    next: NextFunction
  ): Promise<void> => {
    try {
      // Call the RegisterCommandHandler to process the registration
      const result = await this.registerCommandHandler.handle(req.body);

      // Map the UserRegisterResult to UserRegisterResponse using the mapper
      const response = RegisterResultToRegisterResponseMapper.toResponse(result);

      // Return the registration result
      res.status(201).json(response); // Send the mapped response
    } catch (error) {
      next(error); // Pass the error to the error handler middleware
    }
  };
}
