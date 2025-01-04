import { getDaysBetweenDates } from '@utils/date';

describe('getDaysBetweenDates', () => {
  it('should return the correct number of days between two dates', () => {
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-01-10');

    const days = getDaysBetweenDates(startDate, endDate);
    expect(days).toBe(9); // 10 de Janeiro - 1 de Janeiro = 9 dias
  });

  it('should return a negative number if the end date is before the start date', () => {
    const startDate = new Date('2024-01-10');
    const endDate = new Date('2024-01-01');

    const days = getDaysBetweenDates(startDate, endDate);
    expect(days).toBe(-9); // 1 de Janeiro - 10 de Janeiro = -9 dias
  });

  it('should return 0 if both dates are the same', () => {
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-01-01');

    const days = getDaysBetweenDates(startDate, endDate);
    expect(days).toBe(0); // Mesma data deve retornar 0
  });

  it('should handle dates that cross over months', () => {
    const startDate = new Date('2024-01-30');
    const endDate = new Date('2024-02-02');

    const days = getDaysBetweenDates(startDate, endDate);
    expect(days).toBe(3); // 1 e 2 de Fevereiro = 3 dias
  });

  it('should handle leap years correctly', () => {
    const startDate = new Date('2020-02-28'); // Ano bissexto
    const endDate = new Date('2020-03-01'); // Um dia depois

    const days = getDaysBetweenDates(startDate, endDate);
    expect(days).toBe(2); // 29 de Fevereiro + 1 de Março = 2 dias
  });
});
