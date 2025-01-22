import { Email,InputPassword } from "@kikerepo/domain-user";

export class UserLoginQuery {
    constructor(public readonly email: Email, public readonly password: InputPassword ) {}
  }
  