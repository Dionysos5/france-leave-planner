export type Language = 'en' | 'fr';

export const LeaveType = {
  CP: 'CP',
  RTT: 'RTT',
  UNPAID: 'UNPAID',
} as const;
export type LeaveType = (typeof LeaveType)[keyof typeof LeaveType];

export type Plan = Record<string, LeaveType>;

export interface PublicHoliday {
  dateStr: string;
  name: Record<Language, string>;
}

export interface BalanceCheckpoint {
  dateStr: string;
  balanceCP: number;
  balanceRTT: number;
}

export interface LeaveSettings {
  accrualRateCP: number;
  accrualRateRTT: number;
  checkpoints: BalanceCheckpoint[];
}

export interface YearCalendar {
  year: number;
  holidays: Map<string, PublicHoliday>;
}

export type DayKind = 'workable' | 'weekend' | 'holiday';

export interface DayInfo {
  kind: DayKind;
  holiday: PublicHoliday | null;
}

export interface MonthBalance {
  balanceCP: number;
  balanceRTT: number;
}
