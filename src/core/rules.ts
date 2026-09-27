// Rules for a cadre au forfait jours under the Syntec collective agreement (IDCC 1486),
// France métropolitaine.
import { formatDate, isWorkableDay } from './calendar';
import { DayType, type YearCalendar } from './types';

/** Days worked per year under the forfait, journée de solidarité included. */
export const FORFAIT_DAYS = 218;

/** CP earned per full year, in jours ouvrés (equivalent to the legal 30 jours ouvrables). */
export const CP_DAYS_PER_YEAR = 25;

export const CP_PER_MONTH = CP_DAYS_PER_YEAR / 12;

/** The CP reference period runs June 1 – May 31 (0-based month). */
export const CP_PERIOD_START_MONTH = 5;

/** Sick leave earns 2 of the usual 2.5 jours ouvrables a month (loi du 22 avril 2024). */
export const SICK_CP_ACCRUAL_RATIO = 0.8;

/**
 * Types that can cover half a day. The forfait may be counted in half-days; sick and unpaid
 * leave stay whole days.
 */
export const HALF_DAY_TYPES: ReadonlySet<DayType> = new Set([DayType.CP, DayType.RTT, DayType.WFH]);

const countWorkableDays = (calendar: YearCalendar): number => {
  let count = 0;
  const date = new Date(calendar.year, 0, 1);
  while (date.getFullYear() === calendar.year) {
    if (isWorkableDay(calendar, formatDate(date))) {
      count += 1;
    }
    date.setDate(date.getDate() + 1);
  }
  return count;
};

/**
 * RTT (jours de repos) for the year: weekdays that aren't public holidays, minus CP,
 * minus the forfait. Earned in twelfths at the end of each month, forfeited if untaken by
 * December 31.
 */
export const forfaitRestDays = (calendar: YearCalendar): number => {
  return Math.max(0, countWorkableDays(calendar) - CP_DAYS_PER_YEAR - FORFAIT_DAYS);
};
