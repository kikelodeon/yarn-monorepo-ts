/**
 * Error lanzado cuando falla la generación del token.
 */
export class TokenGenerationError extends Error {
    constructor(message?: string) {
      super(message || "Failed to generate token");
      this.name = 'TokenGenerationError';
    }
  }
  