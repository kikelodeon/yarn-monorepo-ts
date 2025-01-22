import { User } from '@kikerepo/domain-user';
import { UserRegisterCommand, UserRegisterResult } from '@kikerepo/application-user';
import { UserRepository } from '@kikerepo/infrastructure-user';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async registerUser(command: UserRegisterCommand): Promise<UserRegisterResult> {
    const user = User.createUnique(command.email, command.password, command.phone);
    await this.userRepository.save(user);
    return new UserRegisterResult(user.id.value, true);
  }
}
