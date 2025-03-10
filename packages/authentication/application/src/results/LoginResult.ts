// packages/application/user/src/results/LoginResult.ts

import { UserId ,AccessToken ,RefreshToken } from '@kikerepo/authentication-domain';

export class LoginResult {
  constructor(
    public readonly userId: UserId,
    public readonly accessToken: AccessToken,
    public readonly refreshToken: RefreshToken,
  ) {}
}
