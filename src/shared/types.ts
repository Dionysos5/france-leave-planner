export type Locale = 'en' | 'fr';

export const LeaveType = {
  CP: 'CP',
  RTT: 'RTT',
  UNPAID: 'UNPAID',
  REMOTE: 'REMOTE',
} as const;
export type LeaveType = (typeof LeaveType)[keyof typeof LeaveType];

export interface LeaveSettings {
  initialCP: number;
  accrualRateCP: number; // days per month
  initialRTT: number;
  accrualRateRTT: number; // days per month
}

export interface UIPreferences {
  hidePastMonths: boolean;
}

export interface LeaveEntry {
  dateStr: string; // YYYY-MM-DD
  type: LeaveType;
  createdAt: string; // ISO string
}

export interface AppData {
  version: number;
  lastUpdated: string; // ISO string
  leaves: LeaveEntry[];
  settings: LeaveSettings;
  uiPreferences: UIPreferences;
}

export interface Holiday {
  dateStr: string;
  name: Record<Locale, string>;
}

export const SYSTEM_ENTRY = 'SYSTEM' as const;

export interface LedgerEntry {
  id: string;
  date: string;
  description: string;
  type: LeaveType | typeof SYSTEM_ENTRY;
  changeCP: number;
  changeRTT: number;
  balanceCP: number;
  balanceRTT: number;
  balanceUnpaid: number;
}
