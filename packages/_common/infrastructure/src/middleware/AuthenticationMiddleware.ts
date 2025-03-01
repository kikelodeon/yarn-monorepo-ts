import { Request, Response, NextFunction } from 'express';

/**
 * Middleware de autenticación que comprueba "Authorization: Bearer <token>".
 * Retorna un "Response" si hay error, o "void" si llama a next() sin devolver nada.
 */
export function AuthenticationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void | Response {
  // 1) Leer el header Authorization
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // 2) Verificar formato: "Bearer <token>"
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Invalid token format' });
  }

  const token = parts[1];

  // 3) Comprobar el token (tokenFake en este ejemplo)
  if (token !== 'tokenFake') {
    return res.status(401).json({ message: 'Invalid token' });
  }

  // 4) Si es válido, continuar con la ejecución
  next();
}
