// packages/shared/src/errors/interfaces/IErrorResponse.ts

export interface IErrorResponse {
  status: number;
  message: string;
  errors?: string[];
}
