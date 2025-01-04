import { User } from '@prisma/client';
import { UserWeb } from './dto/user.dto';
import { UserDomain } from './domain/user.entity';

export class UserMap {
  static toWeb(user: UserDomain): UserWeb {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

  static toDomain(user: User): UserDomain {
    return new UserDomain({
      id: user.id,
      email: user.email,
      name: user.name,
      password_hash: user.password,
      created_at: user.created_at,
      updated_at: user.updated_at,
    }).setRefreshToken(user.refresh_token);
  }

  static toPrisma(user: UserDomain): User {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      password: user.password,
      refresh_token: user.refresh_token,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }
}
