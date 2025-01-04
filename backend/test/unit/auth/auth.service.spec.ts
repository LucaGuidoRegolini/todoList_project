import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '@src/auth/services/auth.service';
import { UsersService } from '@src/users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { Bcrypt } from '@utils/bCrypt';
import { User } from '@prisma/client';
import { LoginUserRequest } from '@src/auth/dto/auth.dto';

const mockUser = {
  id: 'user-id',
  email: 'test@example.com',
  password: Bcrypt.hash('password123'),
};

const mockUsersService = {
  findOne: jest.fn().mockResolvedValue(mockUser),
  validRefreshToken: jest.fn().mockResolvedValue(mockUser),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mocked_access_token'),
  verify: jest
    .fn()
    .mockReturnValue({ sub: mockUser.id, email: mockUser.email }),
  decode: jest
    .fn()
    .mockReturnValue({ exp: Math.floor(Date.now() / 1000) + 3600 }),
};

const mockConfigService = {
  get: jest.fn((key: string) => {
    if (key === 'JWT_REFRESH_SECRET') return 'mocked_refresh_secret';
    if (key === 'JWT_REFRESH_EXPIRATION_TIME') return '1h';
  }),
};

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return a user if credentials are valid', async () => {
      const result = await authService.validateUser(
        mockUser.email,
        'password123',
      );
      expect(result).toEqual(mockUser);
      expect(mockUsersService.findOne).toHaveBeenCalledWith(mockUser.email);
    });

    it('should return undefined if user is not found', async () => {
      mockUsersService.findOne.mockResolvedValueOnce(null);
      const result = await authService.validateUser(
        mockUser.email,
        'password123',
      );
      expect(result).toBeUndefined();
    });

    it('should return undefined if password is invalid', async () => {
      const result = await authService.validateUser(
        mockUser.email,
        'wrongpassword',
      );
      expect(result).toBeUndefined();
    });
  });

  describe('login', () => {
    it('should return authentication response with tokens', async () => {
      const loginUser: LoginUserRequest = {
        user_id: mockUser.id,
        email: mockUser.email,
        token: 'mocked_refresh_token',
      };
      const result = await authService.login(loginUser);

      expect(result).toHaveProperty('user');
      expect(result.user).toEqual({ id: mockUser.id, email: mockUser.email });
      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
    });
  });

  describe('refreshToken', () => {
    it('should return a new authentication response with new tokens', async () => {
      const refreshToken = 'mocked_refresh_token';
      const result = await authService.refreshToken(refreshToken);

      expect(result).toHaveProperty('user');
      expect(result.user).toEqual({ id: mockUser.id, email: mockUser.email });
      expect(mockJwtService.verify).toHaveBeenCalledWith(refreshToken, {
        secret: 'mocked_refresh_secret',
      });
    });

    it('should throw an UnauthorizedException if refresh token is invalid', async () => {
      mockJwtService.verify.mockImplementationOnce(() => {
        throw new Error('Invalid token');
      });

      await expect(authService.refreshToken('invalid_token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw an UnauthorizedException if refresh token is not found in database', async () => {
      const refreshToken = 'mocked_refresh_token';

      mockJwtService.verify.mockReturnValue({
        sub: 'invalid_user_id',
        email: mockUser.email,
      });
      mockUsersService.validRefreshToken.mockResolvedValueOnce(null);

      await expect(authService.refreshToken(refreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
