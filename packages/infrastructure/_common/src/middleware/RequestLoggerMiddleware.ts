
import { Request, Response, NextFunction } from 'express';

/**
 * Logs every incoming HTTP request.
 */
export const RequestLoggerMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
};
