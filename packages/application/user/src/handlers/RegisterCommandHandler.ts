// src/application/user/handlers/RegisterCommandHandler.ts
import { RegisterCommand } from '../commands/RegisterCommand';
import { UserRegisterResult } from '../results/RegisterResult'; // Import the RegisterUserResult class
import { UserRepository } from '@kikerepo/infrastructure-user';
import { User } from '@kikerepo/domain-user'; // Your User entity class
import { ValidationBehaviour } from '@kikerepo/application-common'; // Import the ValidationService
import { ValidationError } from '@kikerepo/contracts-common'; // Custom error class
import { EmailAlreadyInUseError } from '../errors';

export class RegisterCommandHandler {
  private userRepository: UserRepository;
  private validationService: ValidationBehaviour; // Add ValidationService

  constructor(userRepository: UserRepository, validationService: ValidationBehaviour) {
    this.userRepository = userRepository;
    this.validationService = validationService; // Inject ValidationService
  }

  /**
   * Handle user registration, including validating the RegisterCommand and saving the user.
   * @param userRegisterRequest - The incoming registration data.
   * @returns The result of the registration process (UserRegisterResult).
   */
  async handle(userRegisterRequest: { email: string; password: string; phone?: string }): Promise<UserRegisterResult> {
    // Map the request to RegisterCommand
    const registerCommand = new RegisterCommand(
      userRegisterRequest.email,
      userRegisterRequest.password,
      userRegisterRequest.phone
    );

    // Use the ValidationService to validate the RegisterCommand instance
    await this.validationService.validate(registerCommand); // Validate the command using the common validation service

    // Check if the user already exists
    const existingUser = await this.userRepository.findByEmail(registerCommand.email);
    if (existingUser) {
      throw new EmailAlreadyInUseError(registerCommand.email);
    }

    // Create and save the user
    const newUser = User.createUnique(registerCommand.email, registerCommand.password, registerCommand.phone);
    await this.userRepository.save(newUser);

    // Return the result of the registration process (UserRegisterResult)
    return new UserRegisterResult(newUser.id, newUser.email);
  }
}
