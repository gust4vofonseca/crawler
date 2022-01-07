export interface IDateProvider {
  addHours(hours: number, date: Date): Date;
  minutesAdd(date: Date, minutes: number): Date;
  addDaysNow(days: number): Date;
  compareIfBefore(start_date: Date, end_date: Date): boolean;
  compareIfIsAfter(start_date: Date, end_date: Date): boolean;
  compareIsEqual(first_date: Date, second_date: Date): boolean;
  roundToMinutesNearest(date: Date, minutes: number): Date;
  minutesDifference(start_date: Date, end_date: Date): number;
  minutesInInterval(start_date: Date, end_date: Date, step: number): Date[];
  getWeekDay(date: Date): number;
  hoursDifference(first_date: Date, second_date: Date): number;
  isWithinInterval(date: Date, { start, end }: Interval): boolean;
}
