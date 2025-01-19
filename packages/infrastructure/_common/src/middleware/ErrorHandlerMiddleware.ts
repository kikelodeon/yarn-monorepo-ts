// packages/infrastructure/common/src/middleware/ErrorHandlerMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { BaseError, ValidationError } from '@kikerepo/contracts-common';
export const ErrorHandlerMiddleware = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    if (err instanceof ValidationError) {
      res.status(err.statusCode).json(err.toJSON());
    } else if (err instanceof BaseError) {
      res.status(err.statusCode).json({ code: err.statusCode, message: err.message });
    } else {
      res.status(500).json({ code: 'INTERNAL_SERVER_ERROR', message: 'Unexpected error occurred.' });
    }
  };
  