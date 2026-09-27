import { formatDate, getMonthDays, isWorkableDay } from './calendar';
import { halvesOf } from './dayEntry';
import { frenchCalendar } from './holidays';
import {
  CP_PER_MONTH,
  CP_PERIOD_START_MONTH,
  forfaitRestDays,
  SICK_CP_ACCRUAL_RATIO,
} from './rules';
import {
  DayType,
  type LeaveSettings,
  type MonthBalance,
  type Plan,
  type YearCalendar,
  type YearProjection,
} from './types';

export type CalendarForYear = (year: number) => YearCalendar;

const round3 = (value: number): number => Number.parseFloat(value.toFixed(3));

const snapshot = (pools: MonthBalance): MonthBalance => ({
  cpPrevious: round3(pools.cpPrevious),
  cpCurrent: round3(pools.cpCurrent),
  rtt: round3(pools.rtt),
});

/** Each half of a day counts for this much. */
const HALF_DAY = 0.5;

/** CP is drawn from N-1 first; once it runs out, from N (taken in advance if negative). */
const takeCP = (pools: MonthBalance, days: number) => {
  const fromPrevious = Math.min(Math.max(pools.cpPrevious, 0), days);
  pools.cpPrevious -= fromPrevious;
  pools.cpCurrent -= days - fromPrevious;
};

/**
 * Simulates day by day from January 1 of the year of the earliest checkpoint (or of `year`
 * when there is none, starting from zero) so balances carry over from one year to the next.
 */
export const projectYear = (
  year: number,
  plan: Plan,
  settings: LeaveSettings,
  calendarFor: CalendarForYear = frenchCalendar
): YearProjection => {
  // Two checkpoints on the same date: the one listed last wins.
  const checkpoints = new Map(settings.checkpoints.map((c) => [c.dateStr, c]));
  const earliestYear = Math.min(
    ...settings.checkpoints.map((c) => Number.parseInt(c.dateStr.slice(0, 4), 10))
  );
  const startYear = Math.min(year, earliestYear);

  const pools: MonthBalance = { cpPrevious: 0, cpCurrent: 0, rtt: 0 };
  let months: MonthBalance[] = [];
  let cpLostOnMay31 = 0;

  for (let y = startYear; y <= year; y++) {
    const calendar = calendarFor(y);
    const rttPerMonth = forfaitRestDays(calendar) / 12;
    months = [];

    for (let month = 0; month < 12; month++) {
      const monthDays = getMonthDays(calendar, month);
      const lastDayStr = formatDate(monthDays[monthDays.length - 1]);
      let workableDays = 0;
      let unpaidDays = 0;
      let sickDays = 0;

      for (const date of monthDays) {
        const dateStr = formatDate(date);

        if (date.getDate() === 1 && month === 0) {
          pools.rtt = 0;
        }
        if (date.getDate() === 1 && month === CP_PERIOD_START_MONTH) {
          cpLostOnMay31 = Math.max(0, pools.cpPrevious);
          pools.cpPrevious = pools.cpCurrent;
          pools.cpCurrent = 0;
        }

        const checkpoint = checkpoints.get(dateStr);
        if (checkpoint) {
          pools.cpPrevious = checkpoint.cpPrevious;
          pools.cpCurrent = checkpoint.cpCurrent;
          pools.rtt = checkpoint.rtt;
        }

        if (!isWorkableDay(calendar, dateStr)) {
          continue;
        }
        workableDays += 1;

        const { am, pm } = halvesOf(plan[dateStr]);
        for (const type of [am, pm]) {
          switch (type) {
            case DayType.CP:
              takeCP(pools, HALF_DAY);
              break;
            case DayType.RTT:
              pools.rtt -= HALF_DAY;
              break;
            case DayType.UNPAID:
              unpaidDays += HALF_DAY;
              break;
            case DayType.SICK:
              sickDays += HALF_DAY;
              break;
            case DayType.WFH:
              // Working from home is a worked day: nothing to deduct, full accrual.
              break;
          }
        }
      }

      // A checkpoint on the last day of the month already includes that month's accrual.
      if (!checkpoints.has(lastDayStr) && workableDays > 0) {
        const cpWorked = workableDays - unpaidDays - sickDays * (1 - SICK_CP_ACCRUAL_RATIO);
        pools.cpCurrent += (CP_PER_MONTH * cpWorked) / workableDays;
        pools.rtt += (rttPerMonth * (workableDays - unpaidDays)) / workableDays;
      }

      months.push(snapshot(pools));
    }
  }

  return {
    months,
    cpLostOnMay31: round3(cpLostOnMay31),
  };
};
