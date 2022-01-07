import {
  add,
  addMinutes,
  differenceInHours,
  differenceInMinutes,
  eachMinuteOfInterval,
  isAfter,
  isBefore,
  isEqual,
  isWithinInterval,
  roundToNearestMinutes,
} from 'date-fns';
import { IDateProvider } from '../models/IDateProvider';

export class DateFnsDateProvider implements IDateProvider {
  minutesAdd(date: Date, minutes: number): Date {
    return addMinutes(date, minutes);
  }

  getWeekDay(date: Date): number {
    return date.getDay();
  }

  minutesInInterval(start_date: Date, end_date: Date, step: number): Date[] {
    return eachMinuteOfInterval({ start: start_date, end: end_date }, { step });
  }

  minutesDifference(start_date: Date, end_date: Date): number {
    return differenceInMinutes(start_date, end_date);
  }

  roundToMinutesNearest(date: Date, minutes: number): Date {
    return roundToNearestMinutes(date, { nearestTo: minutes });
  }

  addDaysNow(days: number): Date {
    return add(new Date(), { days });
  }

  addHours(hours: number, date: Date): Date {
    return add(date, { hours });
  }

  compareIfBefore(start_date: Date, end_date: Date): boolean {
    return isBefore(start_date, end_date);
  }

  compareIfIsAfter(start_date: Date, end_date: Date): boolean {
    return isAfter(start_date, end_date);
  }

  compareIsEqual(first_date: Date, second_date: Date): boolean {
    return isEqual(first_date, second_date);
  }

  hoursDifference(first_date: Date, second_date: Date): number {
    return differenceInHours(first_date, second_date);
  }

  isWithinInterval(date: Date, { start, end }: Interval): boolean {
    return isWithinInterval(date, {
      start,
      end,
    });
  }
}
