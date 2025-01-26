// infrastructure/services/Argon2HashingService.ts
import { IHashingService ,HashedPassword, InputPassword } from '@kikerepo/domain-user';
import argon2 from 'argon2';
import { injectable } from 'inversify';
@injectable()

export class Argon2HashingService implements IHashingService {
  async hash(password: InputPassword): Promise<HashedPassword> {
    var hash = await argon2.hash(password.value, { type: argon2.argon2id });
    return new HashedPassword(hash);
  }

  async verify(hashedPassword: HashedPassword, inputPassword: InputPassword): Promise<boolean> {
    return argon2.verify(hashedPassword.value, inputPassword.value);
  }
}