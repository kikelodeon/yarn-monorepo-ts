import { AggregateRoot, UserId, Email,Password,Phone, UserCreatedEvent } from '@kikerepo/lib/domain';


export class User extends AggregateRoot<UserId> {
  private readonly email: Email;
  private readonly password: Password;
  private readonly phone?: Phone;

  constructor(id: UserId, email: Email, password: Password, phone?: Phone) {
    super(id);
    this.email = email;
    this.password = password;
    this.phone = phone;

    // Emit domain event upon creation
    this.addDomainEvent(new UserCreatedEvent(id.value, email.value, phone?.value));
  }

  public getEmail(): Email {
    return this.email;
  }

  public getPassword(): Password {
    return this.password;
  }

  public getPhone(): Phone | undefined {
    return this.phone;
  }
}
