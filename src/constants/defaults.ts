import type { LeaveSettings } from '@core';
import type { UIPreferences } from '@shared/types';

const LEGAL_CP_DAYS_PER_YEAR = 25;
const LEGAL_RTT_DAYS_PER_YEAR = 9;

export const DEFAULT_SETTINGS: LeaveSettings = {
  accrualRateCP: LEGAL_CP_DAYS_PER_YEAR / 12,
  accrualRateRTT: LEGAL_RTT_DAYS_PER_YEAR / 12,
  checkpoints: [],
};

export const DEFAULT_UI_PREFS: UIPreferences = {
  hidePastMonths: false,
};
