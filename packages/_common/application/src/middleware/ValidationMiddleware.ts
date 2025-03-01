// packages/infrastructure/_common/src/middleware/ValidationMiddleware.ts
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ValidationError } from '@kikerepo/contracts-common';

/**
 * Validation middleware for Express using class-transformer + class-validator.
 * 
 * @param dtoClass The DTO class to validate (must have class-validator decorators).
 * @returns A RequestHandler that validates req.body and either returns 400 or calls next().
 */
export function ValidationMiddleware(
  dtoClass: new (...args: any[]) => object
): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1) Transform the plain JSON body into an instance of dtoClass
      const dtoObject = plainToInstance(dtoClass, req.body);

      // 2) Validate the instance
      const errors = await validate(dtoObject);

      if (errors.length > 0) {
        // 3) If errors, format them
        const formatted: Record<string, string[]> = {};

        for (const err of errors) {
          const property = err.property;
          const constraints = err.constraints ? Object.values(err.constraints) : [];
          formatted[property] = constraints;
        }

        // 4) Respond with 400 and a ValidationError shape
        //    Note: Do NOT return the `Response` object; call `res.json(...)` then `return;`
        res.status(400).json(new ValidationError(formatted));
        return; // ensures TypeScript sees our function returning void
      }

      // 5) No errors: move on to the next middleware / route handler
      next();
    } catch (err) {
      // For unexpected errors, let your global ErrorHandlerMiddleware handle it
      next(err);
    }
  };
}
