import { UserDomain } from '@src/users/domain/user.entity';
import { CreateUserDto } from '@src/users/dto/user.dto';

describe('UserDomain', () => {
  const userData: CreateUserDto = {
    id: 'user-id',
    name: 'Test User',
    email: 'test@example.com',
    password_hash: 'hashed_password',
    refresh_token: 'refresh_token',
    created_at: new Date(),
    updated_at: new Date(),
  };

  let user: UserDomain;

  beforeEach(() => {
    user = new UserDomain(userData);
  });

  it('should create a user domain instance correctly', () => {
    expect(user).toBeDefined();
    expect(user.id).toBe(userData.id);
    expect(user.name).toBe(userData.name);
    expect(user.email).toBe(userData.email);
    expect(user.password).toBe(userData.password_hash);
    expect(user.refresh_token).toBe(userData.refresh_token);
    expect(user.created_at).toEqual(userData.created_at);
    expect(user.updated_at).toEqual(userData.updated_at);
  });

  it('should set email correctly', () => {
    const newEmail = 'updated@example.com';
    user.setEmail(newEmail);
    expect(user.email).toBe(newEmail);
  });

  it('should set name correctly', () => {
    const newName = 'Updated User';
    user.setName(newName);
    expect(user.name).toBe(newName);
  });

  it('should set refresh token correctly', () => {
    const newToken = 'new_refresh_token';
    user.setRefreshToken(newToken);
    expect(user.refresh_token).toBe(newToken);
  });

  it('should hash password and set it correctly', () => {
    const password = 'plain_password';
    user.setPassword(password);
    expect(user.password).not.toBe(password);
  });
});
