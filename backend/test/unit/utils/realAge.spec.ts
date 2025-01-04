import { realAge } from '@utils/realAge';

describe('realAge', () => {
  it('should return correct age for a given birth date', () => {
    const birthDate = new Date('1990-01-01');
    const today = new Date('2024-11-02');
    const age = realAge(birthDate, today);
    expect(age).toBe(34);
  });

  it('should return correct age when birthday has not occurred yet this year', () => {
    const birthDate = new Date('1990-11-10');
    const today = new Date('2024-11-02');
    const age = realAge(birthDate, today);
    expect(age).toBe(33);
  });

  it('should return the same age if today is the birthday', () => {
    const birthDate = new Date('1990-11-02');
    const today = new Date('2024-11-02');
    const age = realAge(birthDate, today);
    expect(age).toBe(34);
  });

  it('should handle edge cases correctly', () => {
    const birthDate = new Date('2000-02-29');

    const today = new Date('2024-02-28');
    const age = realAge(birthDate, today);
    expect(age).toBe(23);

    const nextDay = new Date('2024-02-29');
    const ageNextDay = realAge(birthDate, nextDay);
    expect(ageNextDay).toBe(24);
  });
});
