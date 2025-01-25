// src/application/queries/LoginQuery.ts

import { IsEmail, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Email,InputPassword } from "@kikerepo/domain-user";
import { IsStrongPassword } from '../validators';

/**
 * Represents a login query in the CQRS pattern.
 */
export class LoginQuery {
  @IsEmail()
  @ValidateNested()
  @Type(() => Email)
  public readonly email: Email;

  @IsStrongPassword()
  @ValidateNested()
  @Type(() => InputPassword)
  public readonly password: InputPassword;

  constructor(email: Email, password: InputPassword) {
    this.email = email;
    this.password = password;
  }
}