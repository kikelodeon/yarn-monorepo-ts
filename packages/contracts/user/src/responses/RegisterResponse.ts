// src/application/user/commands/UserRegisterResponse.ts
export class RegisterResponse {
  userId: string;
  email: string;

  constructor(userId: string, email: string) {
    this.userId = userId;
    this.email = email;
  }
}
