export type Language = 'en' | 'fr';

export const DayType = {
  CP: 'CP',
  RTT: 'RTT',
  UNPAID: 'UNPAID',
  SICK: 'SICK',
  WFH: 'WFH',
} as const;
export type DayType = (typeof DayType)[keyof typeof DayType];

export type Half = 'am' | 'pm';

/** A day split in two; a missing half is free. Only half-day types (see rules) appear here. */
export type HalfDays = Partial<Record<Half, DayType>>;

/** A bare DayType is a full day. */
export type DayEntry = DayType | HalfDays;

export type Plan = Record<string, DayEntry>;

export interface PublicHoliday {
  dateStr: string;
  name: Record<Language, string>;
}

/** Balances as printed on a payslip, applied at the start of `dateStr`. */
export interface BalanceCheckpoint {
  id: string;
  dateStr: string;
  /** CP N-1: earned in the previous reference period, lost if untaken by May 31. */
  cpPrevious: number;
  /** CP N: being earned in the current reference period. */
  cpCurrent: number;
  /** RTT left in the calendar year. */
  rtt: number;
}

export interface LeaveSettings {
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
  cpPrevious: number;
  cpCurrent: number;
  rtt: number;
}

export interface YearProjection {
  /** Balances at the end of each month of the year. */
  months: MonthBalance[];
  /** CP N-1 still untaken at the end of May 31, forfeited on June 1. */
  cpLostOnMay31: number;
}
