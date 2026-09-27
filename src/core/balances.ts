import { formatDate, getMonthDays, isWorkableDay } from './calendar';
import { frenchCalendar } from './holidays';
import {
  CP_PER_MONTH,
  CP_PERIOD_START_MONTH,
  forfaitRestDays,
  rttCostPerUnpaidDay,
  SICK_CP_ACCRUAL_RATIO,
} from './rules';
import {
  type LeaveSettings,
  LeaveType,
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

/** CP is drawn from N-1 first; once it runs out, from N (taken in advance if negative). */
const takeCP = (pools: MonthBalance) => {
  const fromPrevious = Math.min(Math.max(pools.cpPrevious, 0), 1);
  pools.cpPrevious -= fromPrevious;
  pools.cpCurrent -= 1 - fromPrevious;
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
    const restDays = forfaitRestDays(calendar);
    const unpaidRttCost = rttCostPerUnpaidDay(restDays);
    months = [];

    for (let month = 0; month < 12; month++) {
      const monthDays = getMonthDays(calendar, month);
      const lastDayStr = formatDate(monthDays[monthDays.length - 1]);
      let workableDays = 0;
      let lostDays = 0;

      for (const date of monthDays) {
        const dateStr = formatDate(date);

        if (date.getDate() === 1 && month === 0) {
          pools.rtt = restDays;
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

        switch (plan[dateStr]) {
          case LeaveType.CP:
            takeCP(pools);
            break;
          case LeaveType.RTT:
            pools.rtt -= 1;
            break;
          case LeaveType.UNPAID:
            pools.rtt -= unpaidRttCost;
            lostDays += 1;
            break;
          case LeaveType.SICK:
            lostDays += 1 - SICK_CP_ACCRUAL_RATIO;
            break;
        }
      }

      // A checkpoint on the last day of the month already includes that month's accrual.
      if (!checkpoints.has(lastDayStr) && workableDays > 0) {
        pools.cpCurrent += (CP_PER_MONTH * (workableDays - lostDays)) / workableDays;
      }

      months.push(snapshot(pools));
    }
  }

  return {
    months,
    cpLostOnMay31: round3(cpLostOnMay31),
    rttLostOnDec31: round3(Math.max(0, pools.rtt)),
  };
};
