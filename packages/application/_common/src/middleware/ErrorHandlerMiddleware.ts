import { BaseError, InternalError, ValidationError } from '@kikerepo/contracts-common';
import { Request, Response, NextFunction } from 'express';

// Función para manejar la respuesta de errores
const handleErrorResponse = (err: BaseError, res: Response): void => {
  const { message, errorCode, statusCode, timestamp, context, stack } = err;

  // Control de entorno para ocultar detalles en producción
  const isProduction = process.env.NODE_ENV === 'production';

  // Si el entorno es producción, ocultamos detalles sensibles como el stack trace
  const errorResponse: any = {
    code: errorCode,
    message,
    statusCode,
    timestamp,
    context,
  };

  // En producción no se debe exponer el stack trace
  if (!isProduction && stack) {
    errorResponse.stack = stack;  // Agregamos el stack solo si no es producción
  }

  res.status(statusCode).json(errorResponse);
};

// Middleware para manejar errores
export const ErrorHandlerMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let context = {};

  // Si el error es de validación, manejamos el caso por separado
  if (err instanceof ValidationError) {
    context = {
      input: req.body,  // Aquí se incluyen los datos de la solicitud, si es relevante
      fieldErrors: err.validationErrors,  // Los errores de validación
    };
    return handleErrorResponse(err, res);
  }

  // Para cualquier otro error que sea instancia de BaseError, usamos la misma lógica
  if (err instanceof BaseError) {
    context = {
      requestBody: req.body,
      endpoint: req.url,
    };
    return handleErrorResponse(err, res);  // Llamamos a la función de manejo de errores para BaseError
  }

  // Para errores no controlados o cualquier otro tipo de error, lo manejamos como un error genérico
  const internalError = new InternalError();

  // Aquí agregamos el stack trace en el error interno para depuración
  internalError.stack = err.stack;

  // Si hay un error interno, puedes agregar más contexto si es necesario
  context = {
    environment: process.env.NODE_ENV,
    endpoint: req.url,
    requestBody: req.body,
  };

  return handleErrorResponse(internalError, res);  // Llamamos a la función para manejar el error interno
};
