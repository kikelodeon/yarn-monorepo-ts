import { RegisterRequest } from '@kikerepo/contracts-user';
import { RegisterCommand } from '../commands';
import { Email, InputPassword, Phone } from '@kikerepo/domain-user';

export class RegisterRequestToRegisterCommandMapper {
  static toCommand(dto: RegisterRequest): RegisterCommand {
    const emailVO = new Email(dto.email);
    const passwordVO = new InputPassword(dto.password);
    const phoneVO = dto.phone ? new Phone(dto.phone) : undefined;
    return new RegisterCommand(emailVO, passwordVO, phoneVO);
  }
}
