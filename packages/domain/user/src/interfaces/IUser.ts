import { Email, Phone, HashedPassword } from "./../value-objects";

export interface IUser {
    password: HashedPassword;
    phone?: Phone;
    email: Email;
  }
  