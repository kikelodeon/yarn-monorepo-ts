import { Email, Phone } from "../valueObjects";
import { UserId } from "../valueObjects/UserId";

export interface IUser {
    phone?: Phone;
    email: Email;

  }
  