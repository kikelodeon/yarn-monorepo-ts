import { Email, Phone, Password } from "./../value-objects";

export interface IUser {
    password: Password;
    phone?: Phone;
    email: Email;
  }
  