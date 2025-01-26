// RegisterCommandHandler.ts

import { injectable, inject } from 'inversify';
import { IUserRepository, IUserRepositoryToken, IHashingService, IHashingServiceToken } from '@kikerepo/domain-user';
import { User } from '@kikerepo/domain-user';
import { EmailAlreadyInUseError } from '../errors';
import { RegisterCommand } from '../commands/RegisterCommand';
import { RegisterResult } from '../results/RegisterResult';

// 1) Declare a unique Symbol right at the top
export const RegisterCommandHandlerToken = Symbol('RegisterCommandHandlerToken');

@injectable()
export class RegisterCommandHandler {
  constructor(
    // If you want to inject them by token:
    @inject(IUserRepositoryToken) private userRepository: IUserRepository,
    @inject(IHashingServiceToken) private hashingService: IHashingService
    // Possibly more dependencies, like a ValidationBehaviour token, etc.
  ) {}

  public async handle( command: RegisterCommand): Promise<RegisterResult| Error> {
    
    // 1) Check if user already exists
    const existingUser = await this.userRepository.findByEmail(command.email.value);
    if (existingUser) {
      return new EmailAlreadyInUseError(command.email.value);
    }

    // 2) Create domain entity
    const hashedpassword = await this.hashingService.hash(command.password);
    const user = User.createUnique(command.email,hashedpassword, command.phone);

    // 3) Save
    await this.userRepository.save(user);

    return new RegisterResult(user.id, user.email);
  }
}
