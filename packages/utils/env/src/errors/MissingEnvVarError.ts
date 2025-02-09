// packages/utils-env/src/errors/MissingEnvVarError.ts

export class MissingEnvVarError extends Error {
    constructor(varName: string) {
      super(`Missing environment variable: ${varName}`);
      this.name = 'MissingEnvVarError';
    }
  }
  