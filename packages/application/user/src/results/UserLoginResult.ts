export class UserLoginResult {
    constructor(
      public readonly success: boolean,
      public readonly userId?: string,
      public readonly token?: string
    ) {}
  }
  