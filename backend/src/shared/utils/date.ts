export function getDaysBetweenDates(startDate: Date, endDate: Date): number {
  const differenceInMs = endDate.getTime() - startDate.getTime();
  const daysDifference = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));

  return daysDifference;
}
