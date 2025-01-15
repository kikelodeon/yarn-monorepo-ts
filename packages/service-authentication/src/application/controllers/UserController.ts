import { UserService } from '../../infrastructure/services/UserService';
import { Request, Response, NextFunction } from 'express';
import { IUser } from '@kikerepo/lib/domain/interfaces/IUser';

import { ValidationError,NotFoundError } from '@kikerepo/lib/errors';
export class UserController {
  constructor(private userService: UserService) {}

  public async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id;

      if (!userId) {
        throw new ValidationError('User ID is required', ['id is missing']);
      }

      const user: IUser | null = await this.userService.findById(userId);

      if (!user) {
        throw new NotFoundError(`User with ID ${userId} not found`);
      }

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  // Additional controller methods can be added here
}
