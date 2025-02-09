// packages/contracts/user/src/responses/LoginResponse.ts

/**
 * DTO que representa la respuesta de un login exitoso.
 */
export class LoginResponse {
  public readonly accessToken: string;
  public readonly refreshToken: string;
  public readonly userId: string;

  constructor(accessToken: string, refreshToken: string, userId: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.userId = userId;
  }
}
