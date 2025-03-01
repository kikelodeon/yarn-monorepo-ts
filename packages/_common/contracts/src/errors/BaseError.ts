export abstract class BaseError extends Error {
  public readonly statusCode: number;
  public readonly timestamp: string;
  public readonly errorCode: string;
  public readonly context?: any;

  constructor(
    message: string,
    statusCode: number,
    errorCode: string,
    context?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.timestamp = new Date().toISOString(); // Marca de tiempo en formato ISO
    this.context = context; // Información adicional si es necesario

    // Asegurarse de que el nombre del error esté configurado correctamente
    this.name = this.constructor.name;

    // Este método permite la correcta herencia del stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // Método para serializar el error en formato JSON
  public toJSON() {
    return {
      message: this.message,
      code: this.errorCode,
      statusCode: this.statusCode,
      timestamp: this.timestamp,
      context: this.context,
    };
  }
}
