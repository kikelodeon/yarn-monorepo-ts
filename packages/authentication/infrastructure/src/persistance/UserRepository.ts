import { IUserRepository} from '@kikerepo/authentication-domain';
import { User } from '@kikerepo/authentication-domain';
import { injectable } from 'inversify';
import { logger ,PrismaClient} from '@kikerepo/common-infrastructure'; // <--- Logger

@injectable()
export class UserRepository implements IUserRepository {
  async save(user: User): Promise<void> {
    logger.debug('[UserRepository] Saving user', { userId: user.id.value });
    await PrismaClient.ins.prisma.user.upsert({
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
    logger.debug('[UserRepository] Finding user by ID', { id });
    const userRecord = await PrismaClient.ins.prisma.user.findUnique({ where: { id } });
    if (!userRecord) {
      logger.debug('[UserRepository] No user found', { id });
      return null;
    }
    return User.map(
      userRecord.id,
      userRecord.email,
      userRecord.password,
      userRecord.phone,
      userRecord.createdAt,
      userRecord.deletedAt
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    logger.debug('[UserRepository] Finding user by email', { email });
    const userRecord = await PrismaClient.ins.prisma.user.findUnique({ where: { email } });
    if (!userRecord) {
      logger.debug('[UserRepository] No user found', { email });
      return null;
    }
    return User.map(
      userRecord.id,
      userRecord.email,
      userRecord.password,
      userRecord.phone,
      userRecord.createdAt,
      userRecord.deletedAt
    );
  }
}