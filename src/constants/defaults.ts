import type { LeaveSettings, UIPreferences } from '@shared/types';

export const PLAN_YEAR = 2026;

export const DEFAULT_SETTINGS: LeaveSettings = {
  initialCP: 0,
  accrualRateCP: 2.08, // Standard 25 days / 12 months
  initialRTT: 0,
  accrualRateRTT: 0.75, // 9 days / 12 months
};

export const DEFAULT_UI_PREFS: UIPreferences = {
  hidePastMonths: false,
};
