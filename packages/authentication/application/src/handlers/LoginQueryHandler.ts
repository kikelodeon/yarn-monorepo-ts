// packages/application/user/src/handlers/LoginQueryHandler.ts

import { injectable, inject } from 'inversify';
import { LoginQuery } from '../queries/LoginQuery';
import { IUserRepository, IUserRepositoryToken, IHashingService, IHashingServiceToken } from '@kikerepo/domain-authentication';
import { generateAccessToken, generateRefreshToken } from '@kikerepo/infrastructure-authentication/src/authentication/Token';
import { LoginResult } from '../results/LoginResult';
import { LoginCredentialsError } from '../errors';

export const LoginQueryHandlerToken = Symbol('LoginQueryHandlerToken');

@injectable()
export class LoginQueryHandler {
  constructor(
    @inject(IUserRepositoryToken) private readonly userRepository: IUserRepository,
    @inject(IHashingServiceToken) private readonly hashingService: IHashingService,
  ) {}

  public async handle(query: LoginQuery): Promise<LoginResult | Error> {
    // Buscar al usuario por email.
    const user = await this.userRepository.findByEmail(query.email.value);
    if (!user) {
      return new LoginCredentialsError(); //Generic error for not found user (security prevention)
    }

    // Verificar la contraseña.
    const isValid = await this.hashingService.verify(user.password, query.password);
    if (!isValid) {
      return new LoginCredentialsError(); //Generic error for not found user (security prevention)
    }

    // Generar tokens usando nuestras funciones que retornan Value Objects.
    const accessToken = generateAccessToken(user.id.value);   // Devuelve un AccessToken
    const refreshToken = generateRefreshToken(user.id.value);   // Devuelve un RefreshToken

    // Devolver el resultado del login encapsulando el userId y los tokens.
    return new LoginResult(user.id, accessToken, refreshToken);
  }
}
