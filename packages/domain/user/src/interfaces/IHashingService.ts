import { InputPassword } from "../value-objects";
import { HashedPassword } from "../value-objects/HashedPassword";

// domain/services/IHashingService.ts
export interface IHashingService {
  hash(password: InputPassword): Promise<HashedPassword>;
  verify(hashedPassword: HashedPassword, password: InputPassword): Promise<boolean>;
}