import { InputPassword } from "../value-objects";
import { HashedPassword } from "../value-objects/HashedPassword";
export const IHashingServiceToken = Symbol('IHashingService');

export interface IHashingService {
  hash(password: InputPassword): Promise<HashedPassword>;
  verify(hashedPassword: HashedPassword, password: InputPassword): Promise<boolean>;
}