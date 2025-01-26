// src/application/user/commands/RegisterCommand.ts
import { IsEmail, IsString, IsOptional, Length } from 'class-validator';

import { IsStrongPassword,IsPhoneNumber } from '../validators';
import { Email, InputPassword, Phone } from '@kikerepo/domain-user';
export class RegisterCommand {
  @IsEmail()
  email: Email;

  @IsString()
  @IsStrongPassword()
  password: InputPassword;

  @IsOptional()
  @IsString()
  @IsPhoneNumber()
  phone?: Phone;

  constructor(email: Email, password: InputPassword, phone?: Phone) {
    this.email = email;
    this.password = password;
    this.phone = phone;
  }
}
