import { UserId } from "../valueObjects/UserId";

export interface IUser {
    id: UserId;           // UUID v6
    name: string;
    email: string;
    
    // Define any methods or behaviors if necessary
    updateEmail(newEmail: string): void;
    updateName(newName: string): void;
  }
  