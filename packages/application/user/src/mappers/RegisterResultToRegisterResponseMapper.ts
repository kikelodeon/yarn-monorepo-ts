// src/application/user/mappers/UserRegisterResultToResponseMapper.ts
import { RegisterResult as RegisterResult } from '../results/RegisterResult';  // Assuming this is the result class
import { RegisterResponse } from '@kikerepo/contracts-user';   // Assuming this is the response DTO

export class RegisterResultToRegisterResponseMapper {
  static toResponse(result: RegisterResult): RegisterResponse {
    // Map UserRegisterResult to UserRegisterResponse
    return new RegisterResponse(
      result.userId.value, // Convert UserId (value object) to string
      result.email.value          // Directly pass email as it’s a simple value
    );
  }
}
