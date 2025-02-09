/**
 * Error lanzado cuando falla la verificación del token.
 */
export class TokenVerificationError extends Error {
  constructor(message?: string) {
    super(message || "Invalid or expired token");
    this.name = 'TokenVerificationError';
  }
}