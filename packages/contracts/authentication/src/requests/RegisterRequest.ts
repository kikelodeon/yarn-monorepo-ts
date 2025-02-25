export class RegisterRequest {
  email: string;
  password: string;
  phone?: string;

  constructor(email: string, password: string, phone?: string) {
    this.email = email;
    this.password = password;
    this.phone = phone;
  }
}
