import { PLAN_YEAR, PUBLIC_HOLIDAYS_2026 } from '@constants';
import {
  type Holiday,
  type LeaveSettings,
  LeaveType,
  type LedgerEntry,
  SYSTEM_ENTRY,
} from '@shared/types';

export const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

export const formatDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const isWeekend = (dateStr: string): boolean => {
  const d = new Date(dateStr);
  const day = d.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
};

export const isToday = (dateStr: string): boolean => {
  return dateStr === formatDate(new Date());
};

export const getPublicHoliday = (dateStr: string): Holiday | undefined => {
  return PUBLIC_HOLIDAYS_2026.find((holiday: Holiday) => holiday.dateStr === dateStr);
};

export const getDatesInRange = (startDate: string, endDate: string): string[] => {
  let start = new Date(startDate);
  let end = new Date(endDate);

  if (start > end) {
    const temp = start;
    start = end;
    end = temp;
  }

  const dates: string[] = [];
  const current = new Date(start);

  while (current <= end) {
    dates.push(formatDate(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

const BALANCE_AFFECTING = new Set<LeaveType>([LeaveType.CP, LeaveType.RTT, LeaveType.UNPAID]);
export const isBalanceAffecting = (type: LeaveType) => BALANCE_AFFECTING.has(type);

export const calculateLedger = (
  leavesByDate: Map<string, LeaveType>,
  settings: LeaveSettings
): LedgerEntry[] => {
  const ledger: LedgerEntry[] = [];
  let balanceCP = settings.initialCP;
  let balanceRTT = settings.initialRTT;
  let balanceUnpaid = 0;

  ledger.push({
    id: 'init',
    date: `${PLAN_YEAR}-01-01`,
    description: 'Balance on Jan 1st',
    type: SYSTEM_ENTRY,
    changeCP: 0,
    changeRTT: 0,
    balanceCP,
    balanceRTT,
    balanceUnpaid,
  });

  for (let m = 0; m < 12; m++) {
    const year = PLAN_YEAR;
    const daysInMonth = getDaysInMonth(year, m);

    let workableDaysInMonth = 0;
    let unpaidOnWorkableDays = 0;

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, m, d);
      const dateStr = formatDate(date);
      const isWknd = isWeekend(dateStr);
      const isHoliday = getPublicHoliday(dateStr);
      const isWorkable = !isWknd && !isHoliday;

      if (isWorkable) {
        workableDaysInMonth++;
      }

      if (leavesByDate.has(dateStr)) {
        const type = leavesByDate.get(dateStr);

        if (isWorkable && type && isBalanceAffecting(type)) {
          if (type === LeaveType.CP) {
            balanceCP -= 1;
            ledger.push({
              id: `use-${dateStr}`,
              date: dateStr,
              description: 'Taken: CP',
              type: LeaveType.CP,
              changeCP: -1,
              changeRTT: 0,
              balanceCP,
              balanceRTT,
              balanceUnpaid,
            });
          } else if (type === LeaveType.RTT) {
            balanceRTT -= 1;
            ledger.push({
              id: `use-${dateStr}`,
              date: dateStr,
              description: 'Taken: RTT',
              type: LeaveType.RTT,
              changeCP: 0,
              changeRTT: -1,
              balanceCP,
              balanceRTT,
              balanceUnpaid,
            });
          } else if (type === LeaveType.UNPAID) {
            balanceUnpaid += 1;
            unpaidOnWorkableDays++;
            ledger.push({
              id: `use-${dateStr}`,
              date: dateStr,
              description: 'Taken: Unpaid',
              type: LeaveType.UNPAID,
              changeCP: 0,
              changeRTT: 0,
              balanceCP,
              balanceRTT,
              balanceUnpaid,
            });
          }
        }
      }
    }

    // End of Month Accrual
    const workRatio =
      workableDaysInMonth > 0
        ? (workableDaysInMonth - unpaidOnWorkableDays) / workableDaysInMonth
        : 0;

    const earnedCP = settings.accrualRateCP * workRatio;
    const earnedRTT = settings.accrualRateRTT * workRatio;

    balanceCP += earnedCP;
    balanceRTT += earnedRTT;

    ledger.push({
      id: `accrual-${m}`,
      date: formatDate(new Date(year, m, daysInMonth)),
      description: `Accrual (Month ${m + 1})`,
      type: SYSTEM_ENTRY,
      changeCP: Number.parseFloat(earnedCP.toFixed(3)),
      changeRTT: Number.parseFloat(earnedRTT.toFixed(3)),
      balanceCP: Number.parseFloat(balanceCP.toFixed(3)),
      balanceRTT: Number.parseFloat(balanceRTT.toFixed(3)),
      balanceUnpaid,
    });
  }

  return ledger;
};
