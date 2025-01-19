export class UserRegisterCommand {
    constructor(public readonly email: string, public readonly password: string, public readonly phone?: string) { }
}
