import { Request, Response, NextFunction } from 'express';
import { BaseError } from '@custom/shared/errors/BaseError';
import { ValidationError } from '@custom/shared/errors';
import { IErrorResponse } from '@custom/shared/errors';
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let customError: BaseError;

  if (err instanceof BaseError) {
    // If the error is a known BaseError, use it directly
    customError = err;
  } else {
    // For unknown errors, create a generic InternalServerError
    customError = new BaseError(
      'InternalServerError',
      500,
      false,
      'An unexpected error occurred'
    );
  }

  // Construct the error response
  const errorResponse: IErrorResponse = {
    status: customError.statusCode,
    message: customError.message,
  };

  // If the error has additional details, include them
  if (customError instanceof ValidationError) {
    errorResponse.errors = customError.errors;
  }

  res.status(customError.statusCode).json(errorResponse);
};
