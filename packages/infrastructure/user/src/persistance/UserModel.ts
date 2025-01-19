import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUserDTO } from '@kikerepo/contracts-user';

/**
 * Mongoose Document for User
 */
export interface UserDocument extends Document {
  id: string;
  email: string;
  password: string;
  phone?: string;
}

/**
 * Mongoose Schema for User
 */
const UserSchema: Schema<UserDocument> = new Schema<UserDocument>({
  id: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: false },
});

export const UserModel: Model<UserDocument> = mongoose.model<UserDocument>('User', UserSchema);

/**
 * Convert Mongoose Document to DTO
 */
export const toDTO = (document: UserDocument): IUserDTO => ({
  id: document.id,
  email: document.email,
  password: document.password,
  phone: document.phone,
});
