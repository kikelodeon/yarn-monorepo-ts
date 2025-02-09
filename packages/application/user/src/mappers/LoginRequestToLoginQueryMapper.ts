// packages/application/user/src/mappers/LoginRequestToLoginQueryMapper.ts

import { LoginRequest } from '@kikerepo/contracts-user/src/requests/LoginRequest';
import { LoginQuery } from '../queries/LoginQuery';
import { Email, InputPassword } from '@kikerepo/domain-user';

/**
 * Mapper para transformar el DTO de request (LoginRequest)
 * en un objeto query (LoginQuery) que usará la lógica de dominio.
 */
export class LoginRequestToLoginQueryMapper {
  static toQuery(dto: LoginRequest): LoginQuery {
    const email = new Email(dto.email);
    const password = new InputPassword(dto.password);
    return new LoginQuery(email, password);
  }
}
