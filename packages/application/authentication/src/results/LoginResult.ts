// packages/application/user/src/results/LoginResult.ts

import { UserId } from '@kikerepo/domain-authentication';
import { AccessToken, RefreshToken } from '@kikerepo/domain-authentication';

export class LoginResult {
  constructor(
    public readonly userId: UserId,
    public readonly accessToken: AccessToken,
    public readonly refreshToken: RefreshToken,
  ) {}
}
