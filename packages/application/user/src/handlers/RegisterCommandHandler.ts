import { injectable, inject } from 'inversify';
import { IUserRepository, IUserRepositoryToken, IHashingService, IHashingServiceToken } from '@kikerepo/domain-user';
import { User } from '@kikerepo/domain-user';
import { EmailAlreadyInUseError } from '../errors';
import { RegisterCommand } from '../commands/RegisterCommand';
import { RegisterResult } from '../results/RegisterResult';
import { logger } from '@kikerepo/infrastructure-common'; // <--- Importa tu logger
export const RegisterCommandHandlerToken = Symbol('RegisterCommandHandlerToken');

@injectable()
export class RegisterCommandHandler {
  constructor(
    @inject(IUserRepositoryToken) private userRepository: IUserRepository,
    @inject(IHashingServiceToken) private hashingService: IHashingService
  ) {}

  public async handle(command: RegisterCommand): Promise<RegisterResult | Error> {
    logger.info('[RegisterCommandHandler] Handling register command', { email: command.email.value });

    const existingUser = await this.userRepository.findByEmail(command.email.value);
    if (existingUser) {
      logger.warn('[RegisterCommandHandler] Email already in use', { email: command.email.value });
      return new EmailAlreadyInUseError(command.email.value);
    }

    const hashedpassword = await this.hashingService.hash(command.password);
    const user = User.createUnique(command.email, hashedpassword, command.phone);
    await this.userRepository.save(user);

    logger.info('[RegisterCommandHandler] User registered successfully', { userId: user.id.value });
    return new RegisterResult(user.id, user.email);
  }
}
