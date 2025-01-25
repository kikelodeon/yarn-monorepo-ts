import { UserId,Email } from "@kikerepo/domain-user";

// src/application/user/results/UserRegisterResult.ts
export class UserRegisterResult {
  userId: UserId;
  email: Email;

  constructor(userId: UserId, email: Email) {
    this.userId = userId;
    this.email = email;
  }
}
