import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/prisma/prisma.service';
import { IUsersRepository } from './interfaces/users.repository.interface';
import { UserMap } from './user.map';
import { UserDomain } from './domain/user.entity';
import { User } from '@prisma/client';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(user: UserDomain): Promise<UserDomain> {
    const user_prisma: User = UserMap.toPrisma(user);
    const resp = await this.prismaService.user.create({
      data: user_prisma,
    });
    return UserMap.toDomain(resp);
  }

  async update(user: UserDomain): Promise<UserDomain> {
    const user_prisma: User = UserMap.toPrisma(user);
    const resp = await this.prismaService.user.update({
      where: { id: user.id },
      data: user_prisma,
    });
    return UserMap.toDomain(resp);
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.user.delete({ where: { id } });
  }

  async findOneByEmail(email: string): Promise<UserDomain | null> {
    const resp = await this.prismaService.user.findUnique({ where: { email } });

    if (!resp) return null;

    return UserMap.toDomain(resp);
  }

  async findById(id: string): Promise<UserDomain | null> {
    const resp = await this.prismaService.user.findUnique({ where: { id } });

    if (!resp) return null;
    return UserMap.toDomain(resp);
  }

  async updateRefreshToken(
    userId: string,
    newToken: string,
  ): Promise<UserDomain> {
    const user = await this.prismaService.user.update({
      where: { id: userId },
      data: {
        refresh_token: newToken,
        updated_at: new Date(),
      },
    });

    return UserMap.toDomain(user);
  }
}
