// packages/infrastructure-user/src/authentication/AuthenticationService.ts

import {
  LoginQueryHandler,
  RegisterCommandHandler,
  LoginResultToLoginResponseMapper,
  RegisterResultToRegisterResponseMapper,
  RegisterRequestToRegisterCommandMapper,
  LoginRequestToLoginQueryMapper
} from '@kikerepo/application-user';

import {
  LoginResponse,
  RegisterResponse,
  LoginRequest,
  RegisterRequest
} from '@kikerepo/contracts-user';

/**
 * Servicio de autenticación que integra las operaciones de login y registro.
 *
 * Este servicio se encarga de:
 * - Mapear los DTOs de request a objetos de dominio (LoginQuery o RegisterCommand).
 * - Ejecutar los casos de uso a través de los handlers (loginQueryHandler y registerCommandHandler).
 * - Mapear los resultados del dominio a DTOs de respuesta (LoginResponse y RegisterResponse).
 */
export const AuthenticationServiceToken = Symbol('AuthenticationServiceToken');
export class AuthenticationService {
  constructor(
    private readonly loginQueryHandler: LoginQueryHandler,
    private readonly registerCommandHandler: RegisterCommandHandler,
  ) {}

  /**
   * Procesa la operación de login.
   *
   * @param loginRequest - DTO que contiene las credenciales del usuario (email y password).
   * @returns Una promesa que se resuelve en un LoginResponse con accessToken, refreshToken y userId.
   * @throws Error en caso de que el login falle (por ejemplo, usuario no encontrado o credenciales inválidas).
   */
  public async login(loginRequest: LoginRequest): Promise<LoginResponse> {
    // Mapeamos la request a un objeto del dominio utilizando nuestros Value Objects.
    const loginQuery = LoginRequestToLoginQueryMapper.toQuery(loginRequest);
    // Ejecutamos la lógica de negocio mediante el handler de login.
    const loginResult = await this.loginQueryHandler.handle(loginQuery);
    if (loginResult instanceof Error) {
      throw loginResult;
    }

    // Mapeamos el resultado del dominio a un DTO de respuesta.
    return LoginResultToLoginResponseMapper.toResponse(loginResult);
  }

  /**
   * Procesa la operación de registro.
   *
   * @param registerRequest - DTO que contiene los datos para registrar al usuario (email, password, y opcionalmente phone).
   * @returns Una promesa que se resuelve en un RegisterResponse.
   * @throws Error en caso de que el registro falle.
   */
  public async register(registerRequest: RegisterRequest): Promise<RegisterResponse> {
    // Convertimos la request en un comando del dominio usando el mapper correspondiente.
    const registerCommand = RegisterRequestToRegisterCommandMapper.toCommand(registerRequest);

    // Ejecutamos la lógica de registro a través del handler.
    const registerResult = await this.registerCommandHandler.handle(registerCommand);
    if (registerResult instanceof Error) {
      throw registerResult;
    }

    // Mapeamos el resultado del dominio a un DTO de respuesta.
    return RegisterResultToRegisterResponseMapper.toResponse(registerResult);
  }
}
