import { BaseError } from './BaseError';

export class ValidationError extends BaseError {
  private _errors: string[];

  constructor(description: string, errors: string[]) {
    super('ValidationError', 400, true, description);
    this._errors = errors;
  }

  get errors(): string[] {
    return this._errors;
  }
}
