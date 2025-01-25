// src/application/user/commands/RegisterCommand.ts
import { IsEmail, IsString, IsOptional, Length } from 'class-validator';

import { IsStrongPassword,IsPhoneNumber } from '../validators';
export class RegisterCommand {
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsString()
  @IsStrongPassword()
  password: string;

  @IsOptional()
  @IsString()
  @IsPhoneNumber()
  phone?: string;

  constructor(email: string, password: string, phone?: string) {
    this.email = email;
    this.password = password;
    this.phone = phone;
  }
}
