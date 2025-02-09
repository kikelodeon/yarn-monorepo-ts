// packages/utils-env/src/requireEnv.ts

import { MissingEnvVarError } from './errors/MissingEnvVarError';

export function requireEnv(varName: string): string {
  const value = process.env[varName];
  if (!value) {
    throw new MissingEnvVarError(varName);
  }
  return value;
}
