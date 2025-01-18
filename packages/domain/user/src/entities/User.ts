import { AggregateRoot } from '@kikerepo/domain-common';
import { UserId } from '../value-objects/UserId';
import { Email } from '../value-objects/Email';
import { Password } from '../value-objects/Password';
import { Phone } from '../value-objects/Phone';

export class User extends AggregateRoot<UserId> {
  constructor(
     id: UserId,
    private _email: Email,
    private _password: Password,
    private _phone?: Phone
  ) {
    super(id);
    this.validate();
  }

  private validate() {
    if (!this._email || !this._password) {
      throw new Error('Email and Password are required for a User');
    }
  }

  get email(): Email {
    return this._email;
  }

  get phone(): Phone | undefined {
    return this._phone;
  }
}
