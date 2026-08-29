import { formatDate, getMonthDays, isWorkableDay } from './calendar';
import {
  type BalanceCheckpoint,
  type LeaveSettings,
  LeaveType,
  type MonthBalance,
  type Plan,
  type YearCalendar,
} from './types';

interface LeaveEffect {
  cp: number;
  rtt: number;
  unpaid: boolean;
}

const LEAVE_EFFECT: Record<LeaveType, LeaveEffect> = {
  [LeaveType.CP]: { cp: 1, rtt: 0, unpaid: false },
  [LeaveType.RTT]: { cp: 0, rtt: 1, unpaid: false },
  [LeaveType.UNPAID]: { cp: 0, rtt: 0, unpaid: true },
};

const latestCheckpointBefore = (
  checkpoints: BalanceCheckpoint[],
  year: number
): BalanceCheckpoint | undefined => {
  return checkpoints
    .filter((checkpoint) => checkpoint.dateStr < `${year}-01-01`)
    .sort((a, b) => a.dateStr.localeCompare(b.dateStr))
    .at(-1);
};

const round3 = (value: number): number => Number.parseFloat(value.toFixed(3));

export const calculateMonthlyBalances = (
  calendar: YearCalendar,
  plan: Plan,
  settings: LeaveSettings
): MonthBalance[] => {
  const resets = new Map(
    settings.checkpoints.map((checkpoint) => [checkpoint.dateStr, checkpoint])
  );
  const opening = latestCheckpointBefore(settings.checkpoints, calendar.year);

  let balanceCP = opening?.balanceCP ?? 0;
  let balanceRTT = opening?.balanceRTT ?? 0;
  const balances: MonthBalance[] = [];

  for (let month = 0; month < 12; month++) {
    const monthDays = getMonthDays(calendar, month);
    const lastDayStr = formatDate(monthDays[monthDays.length - 1]);
    const accrualCoveredByCheckpoint = resets.has(lastDayStr);
    let workableDays = 0;
    let unpaidDays = 0;

    for (const date of monthDays) {
      const dateStr = formatDate(date);

      const reset = resets.get(dateStr);
      if (reset) {
        balanceCP = reset.balanceCP;
        balanceRTT = reset.balanceRTT;
      }

      if (!isWorkableDay(calendar, dateStr)) {
        continue;
      }
      workableDays += 1;

      const type = plan[dateStr];
      if (!type) {
        continue;
      }
      const effect = LEAVE_EFFECT[type];
      balanceCP -= effect.cp;
      balanceRTT -= effect.rtt;
      unpaidDays += effect.unpaid ? 1 : 0;
    }

    const workRatio = workableDays === 0 ? 0 : (workableDays - unpaidDays) / workableDays;
    if (!accrualCoveredByCheckpoint) {
      balanceCP += settings.accrualRateCP * workRatio;
      balanceRTT += settings.accrualRateRTT * workRatio;
    }

    balances.push({ balanceCP: round3(balanceCP), balanceRTT: round3(balanceRTT) });
  }

  return balances;
};
