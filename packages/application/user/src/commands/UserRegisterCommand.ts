import { Email,InputPassword, Phone } from "@kikerepo/domain-user";

export class UserRegisterCommand {
    constructor(public readonly email: Email, public readonly password: InputPassword, public readonly phone?: Phone) { }
}
