// Rules for a cadre au forfait jours under the Syntec collective agreement (IDCC 1486),
// France métropolitaine.
import { formatDate, isWorkableDay } from './calendar';
import type { YearCalendar } from './types';

/** Days worked per year under the forfait, journée de solidarité included. */
export const FORFAIT_DAYS = 218;

/** CP earned per full year, in jours ouvrés (equivalent to the legal 30 jours ouvrables). */
export const CP_DAYS_PER_YEAR = 25;

export const CP_PER_MONTH = CP_DAYS_PER_YEAR / 12;

/** The CP reference period runs June 1 – May 31 (0-based month). */
export const CP_PERIOD_START_MONTH = 5;

/** Sick leave earns 2 of the usual 2.5 jours ouvrables a month (loi du 22 avril 2024). */
export const SICK_CP_ACCRUAL_RATIO = 0.8;

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
 * minus the forfait. Granted on January 1, forfeited if untaken by December 31.
 */
export const forfaitRestDays = (calendar: YearCalendar): number => {
  return Math.max(0, countWorkableDays(calendar) - CP_DAYS_PER_YEAR - FORFAIT_DAYS);
};

/**
 * RTT lost per unpaid day: the year's RTT spread over the days the employee is expected
 * to be present (forfait + RTT), so a full year of unpaid leave cancels every RTT.
 */
export const rttCostPerUnpaidDay = (restDays: number): number => {
  return restDays === 0 ? 0 : restDays / (FORFAIT_DAYS + restDays);
};
