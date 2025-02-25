// packages/application/user/src/mappers/LoginResultToLoginResponseMapper.ts

import { LoginResult } from '../results';
import { LoginResponse } from '@kikerepo/contracts-authentication';

/**
 * Mapper para transformar el resultado del dominio (LoginResult)
 * a un DTO que se usará como respuesta en el endpoint de login.
 */
export class LoginResultToLoginResponseMapper {
  static toResponse(result: LoginResult): LoginResponse {
    return new LoginResponse(
      result.accessToken.value,   // Extrae el string del AccessToken
      result.refreshToken.value,  // Extrae el string del RefreshToken
      result.userId.value         // Extrae el valor del UserId
    );
  }
}
