import { Request, Response, NextFunction } from 'express';
import { logger } from '../logging/logger';

export const RequestLoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.info(`[${req.method}] ${req.url}`, { ip: req.ip });
  next();
};
