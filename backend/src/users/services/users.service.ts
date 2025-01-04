import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IUsersRepository } from '../interfaces/users.repository.interface';
import { UserDomain } from '../domain/user.entity';
import { CreateUserRequest, UpdateUserRequest } from '../dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('IUsersRepository')
    private readonly usersRepository: IUsersRepository,
  ) {}

  async findOne(email: string): Promise<UserDomain | undefined> {
    return this.usersRepository.findOneByEmail(email);
  }

  async findById(id: string): Promise<UserDomain | undefined> {
    return this.usersRepository.findById(id);
  }

  async create(createUserDto: CreateUserRequest): Promise<UserDomain> {
    const user_exists = await this.usersRepository.findOneByEmail(
      createUserDto.email,
    );

    if (user_exists) {
      throw new BadRequestException('User already exists');
    }

    const user = new UserDomain({
      email: createUserDto.email,
      name: createUserDto.name,
    });
    user.setPassword(createUserDto.password);
    user.setRefreshToken(randomUUID());
    return this.usersRepository.create(user);
  }

  async update(id: string, user: UpdateUserRequest): Promise<UserDomain> {
    const user_exists = await this.usersRepository.findById(id);

    if (!user_exists) {
      throw new BadRequestException("User doesn't exist");
    }

    const new_user = new UserDomain({
      id: user_exists.id,
      email: user.email || user_exists.email,
      name: user.name || user_exists.name,
    });

    return this.usersRepository.update(new_user);
  }

  async delete(id: string): Promise<void> {
    const user_exists = await this.usersRepository.findById(id);

    if (!user_exists) {
      throw new BadRequestException("User doesn't exist");
    }

    return this.usersRepository.delete(id);
  }

  async validRefreshToken(
    userId: string,
    token: string,
  ): Promise<UserDomain | undefined> {
    const user = await this.usersRepository.findById(userId);

    if (!user || user.refresh_token !== token) return undefined;

    const newToken = randomUUID();
    return this.usersRepository.updateRefreshToken(userId, newToken);
  }
}
