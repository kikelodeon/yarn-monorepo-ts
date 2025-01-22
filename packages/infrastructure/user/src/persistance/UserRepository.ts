import { Email, IUserRepository, Password, Phone, UserId } from '@kikerepo/domain-user';
import { User } from '@kikerepo/domain-user';
import { prisma } from './UserDatabase';

export class UserRepository implements IUserRepository {
  async save(user: User): Promise<void> {
    await prisma.user.upsert({
      where: { id: user.id.value },
      update: {
        email: user.email.value,
        password: user.password.value,
        phone: user.phone?.value,
      },
      create: {
        id: user.id.value,
        email: user.email.value,
        password: user.password.value,
        phone: user.phone?.value,
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    const userRecord = await prisma.user.findUnique({
      where: { id },
    });

    if (!userRecord) return null;

    // Convertir el registro de la DB a la entidad de dominio
    return  User.map(
      userRecord.id,
      userRecord.email,
      userRecord.password,
      userRecord.phone,
      userRecord.createdAt,
      userRecord.deletedAt);

  }

  async findByEmail(email: string): Promise<User | null> {
    const userRecord = await prisma.user.findUnique({
      where: { email },
    });

    if (!userRecord) return null;

    // Convertir el registro de la DB a la entidad de dominio
    return  User.map(
      userRecord.id,
      userRecord.email,
      userRecord.password,
      userRecord.phone,
      userRecord.createdAt,
      userRecord.deletedAt);
  }
}
