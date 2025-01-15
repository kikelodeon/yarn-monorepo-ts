// packages/service-authentication/src/domain/entities/User.ts

import { AggregateRoot } from '@kikerepo/lib/domain/aggregateRoots/AggregateRoot';
import { UserId } from '@kikerepo/lib/domain/valueObjects/UserId';
/**
 * User Entity representing an authenticated user in the system.
 */
export class User extends AggregateRoot<UserId> {
  private _name: string;
  private _email: string;

  /**
   * Constructs a new User.
   * @param id - The unique identifier for the User.
   * @param name - The name of the User.
   * @param email - The email address of the User.
   */
  constructor(id: UserId, name: string, email: string) {
    super(id);
    this._name = name;
    this._email = email;
  }

  // Getters
  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  /**
   * Updates the email address of the User.
   * @param newEmail - The new email address.
   */
  updateEmail(newEmail: string): void {
    // Add validation or business rules here
    this._email = newEmail;
  }

  /**
   * Updates the name of the User.
   * @param newName - The new name.
   */
  updateName(newName: string): void {
    // Add validation or business rules here
    this._name = newName;
  }

  // Additional domain-specific methods can be added here
}
