import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { UsersService } from '@src/users/services/users.service';
import { IUsersRepository } from '@src/users/interfaces/users.repository.interface';
import { UserDomain } from '@src/users/domain/user.entity';
import { CreateUserRequest, UpdateUserRequest } from '@src/users/dto/user.dto';
import { randomUUID } from 'crypto';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: jest.Mocked<IUsersRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'IUsersRepository',
          useValue: {
            findOneByEmail: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            updateRefreshToken: jest.fn(),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get('IUsersRepository');
  });

  describe('findOne', () => {
    it('should return a user when found', async () => {
      const email = 'test@example.com';
      const user = new UserDomain({ email, name: 'Test User' });
      usersRepository.findOneByEmail.mockResolvedValue(user);

      expect(await usersService.findOne(email)).toBe(user);
      expect(usersRepository.findOneByEmail).toHaveBeenCalledWith(email);
    });
  });

  describe('findById', () => {
    it('should return a user when found by ID', async () => {
      const id = 'user-id';
      const user = new UserDomain({
        id,
        email: 'test@example.com',
        name: 'Test User',
      });
      usersRepository.findById.mockResolvedValue(user);

      expect(await usersService.findById(id)).toBe(user);
      expect(usersRepository.findById).toHaveBeenCalledWith(id);
    });
  });

  describe('create', () => {
    it('should throw an error if the user already exists', async () => {
      const createUserDto: CreateUserRequest = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      };
      usersRepository.findOneByEmail.mockResolvedValue(
        new UserDomain({ email: createUserDto.email, name: 'Existing User' }),
      );

      await expect(usersService.create(createUserDto)).rejects.toThrow(
        new BadRequestException('User already exists'),
      );
    });

    it('should create a new user if the user does not exist', async () => {
      const createUserDto: CreateUserRequest = {
        email: 'new@example.com',
        name: 'New User',
        password: 'password123',
      };
      const newUser = new UserDomain({ ...createUserDto });
      usersRepository.findOneByEmail.mockResolvedValue(undefined);
      usersRepository.create.mockResolvedValue(newUser);

      const result = await usersService.create(createUserDto);
      expect(result).toBe(newUser);
      expect(usersRepository.create).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it("should throw an error if the user doesn't exist", async () => {
      const updateUserDto: UpdateUserRequest = { email: 'updated@example.com' };
      const id = 'non-existing-id';
      usersRepository.findById.mockResolvedValue(undefined);

      await expect(usersService.update(id, updateUserDto)).rejects.toThrow(
        new BadRequestException("User doesn't exist"),
      );
    });

    it('should update and return the updated user if the user exists', async () => {
      const existingUser = new UserDomain({
        id: 'user-id',
        email: 'test@example.com',
        name: 'Test User',
      });
      const updatedUser = new UserDomain({
        id: 'user-id',
        email: 'updated@example.com',
        name: 'Updated User',
      });
      usersRepository.findById.mockResolvedValue(existingUser);
      usersRepository.update.mockResolvedValue(updatedUser);

      const result = await usersService.update(existingUser.id, {
        email: 'updated@example.com',
        name: 'Updated User',
      });
      expect(result).toBe(updatedUser);
    });
  });

  describe('delete', () => {
    it("should throw an error if the user doesn't exist", async () => {
      const id = 'non-existing-id';
      usersRepository.findById.mockResolvedValue(undefined);

      await expect(usersService.delete(id)).rejects.toThrow(
        new BadRequestException("User doesn't exist"),
      );
    });

    it('should delete the user if they exist', async () => {
      const existingUser = new UserDomain({
        id: 'user-id',
        email: 'test@example.com',
        name: 'Test User',
      });
      usersRepository.findById.mockResolvedValue(existingUser);

      await usersService.delete(existingUser.id);
      expect(usersRepository.delete).toHaveBeenCalledWith(existingUser.id);
    });
  });

  describe('validRefreshToken', () => {
    it('should return undefined if the user or token is invalid', async () => {
      usersRepository.findById.mockResolvedValue(undefined);
      const result = await usersService.validRefreshToken(
        'invalid-id',
        'invalid-token',
      );
      expect(result).toBeUndefined();
    });

    it('should update the refresh token if it matches the existing token', async () => {
      const user = new UserDomain({
        id: 'user-id',
        email: 'test@example.com',
        name: 'Test User',
        refresh_token: 'valid-token',
      });
      const newToken = randomUUID();

      const newUser = new UserDomain({
        id: 'user-id',
        email: 'test@example.com',
        name: 'Test User',
        refresh_token: newToken,
      });

      usersRepository.findById.mockResolvedValue(user);
      usersRepository.updateRefreshToken.mockResolvedValue(newUser);

      const result = await usersService.validRefreshToken(
        user.id,
        'valid-token',
      );

      expect(result).toHaveProperty('refresh_token', newToken);
      expect(usersRepository.updateRefreshToken).toHaveBeenCalled();
    });
  });
});
