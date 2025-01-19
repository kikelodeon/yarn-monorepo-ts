// infrastructure-user/src/persistence/UserRepository.ts
import { IUserRepository } from '@kikerepo/domain-user';
import { User } from '@kikerepo/domain-user';
import { UserModel } from './UserModel';
import { toDomain, toPersistence } from './UserMapper'; 

export class UserRepository implements IUserRepository {
  /**
   * Recibe la entidad de dominio, la convierte a persistencia y hace upsert
   */
  async save(user: User): Promise<void> {
    const userDoc = await UserModel.findOne({ id: user.id.value });

    if (userDoc) {
      // Actualizar user existente
      const newProps = toPersistence(user); 
      userDoc.email = newProps.email;
      userDoc.password = newProps.password;
      userDoc.phone = newProps.phone;
      await userDoc.save();
    } else {
      // Crear nuevo
      const newProps = toPersistence(user);
      const newUserDoc = new UserModel(newProps);
      await newUserDoc.save();
    }
  }

  /**
   * Encuentra por ID
   */
  async findById(id: string): Promise<User | null> {
    const userDoc = await UserModel.findOne({ id });
    if (!userDoc) return null;
    return toDomain(userDoc);
  }

  /**
   * Encuentra por email
   */
  async findByEmail(email: string): Promise<User | null> {
    const userDoc = await UserModel.findOne({ email });
    if (!userDoc) return null;
    return toDomain(userDoc);
  }
}
