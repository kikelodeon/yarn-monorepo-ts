import { UserId,Email } from "@kikerepo/domain-user";

export class RegisterResult {
  userId: UserId;
  email: Email;

  constructor(userId: UserId, email: Email) {
    this.userId = userId;
    this.email = email;
  }
}
