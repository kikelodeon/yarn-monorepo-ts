import { AggregateRoot, UserId, Email,Password,Phone, UserCreatedEvent, IUser } from '@kikerepo/lib/domain';


export class User extends AggregateRoot<UserId> implements IUser{
  private readonly _email: Email;
  private readonly _password: Password;
  private readonly _phone?: Phone;

  constructor(id: UserId, email: Email, password: Password, phone?: Phone) {
    super(id);
    this._email = email;
    this._password = password;
    this._phone = phone;

    // Emit domain event upon creation
    this.addDomainEvent(new UserCreatedEvent(id.value, email.value, phone?.value));
  }

 // Expose email via a getter
 get email(): Email {
  return this._email;
}

// Expose password via a getter
get password(): Password {
  return this._password;
}

// Expose phone via a getter
get phone(): Phone | undefined {
  return this._phone;
}
}
