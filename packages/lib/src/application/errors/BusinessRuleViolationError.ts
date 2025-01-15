// packages/shared/src/errors/BaseError.ts

export class BaseError extends Error {
    public readonly name: string;
    public readonly statusCode: number;
    public readonly isOperational: boolean;
  
    constructor(name: string, statusCode: number, isOperational: boolean, description: string) {
      super(description);
  
      Object.setPrototypeOf(this, new.target.prototype); // Restore prototype chain
  
      this.name = name;
      this.statusCode = statusCode;
      this.isOperational = isOperational;
  
      Error.captureStackTrace(this);
    }
  }
  