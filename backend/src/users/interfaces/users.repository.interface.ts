import { UserDomain } from '../domain/user.entity';

export interface IUsersRepository {
  create(user: UserDomain): Promise<UserDomain>;
  update(user: UserDomain): Promise<UserDomain>;
  delete(id: string): Promise<void>;
  findOneByEmail(email: string): Promise<UserDomain | null>;
  findById(id: string): Promise<UserDomain | null>;
  updateRefreshToken(userId: string, newToken: string): Promise<UserDomain>;
}
