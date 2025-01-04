import { Bcrypt } from '@src/shared/utils/bCrypt';

describe('Bcrypt', () => {
  const plainPassword = 'mySecurePassword';
  const incorrectPassword = 'wrongPassword';

  it('should hash the password', () => {
    const hashedPassword = Bcrypt.hash(plainPassword);
    expect(hashedPassword).toBeDefined();
    expect(hashedPassword).not.toBe(plainPassword);
  });

  it('should compare the password with a correct hash', () => {
    const hashedPassword = Bcrypt.hash(plainPassword);
    const isMatch = Bcrypt.compare(plainPassword, hashedPassword);
    expect(isMatch).toBe(true);
  });

  it('should not compare the password with an incorrect hash', () => {
    const hashedPassword = Bcrypt.hash(plainPassword);
    const isMatch = Bcrypt.compare(incorrectPassword, hashedPassword);
    expect(isMatch).toBe(false);
  });

  it('should hash with a custom salt', () => {
    const customSalt = 12;
    const hashedPassword = Bcrypt.hash(plainPassword, customSalt);
    expect(hashedPassword).toBeDefined();
    expect(hashedPassword).not.toBe(plainPassword);
  });
});
