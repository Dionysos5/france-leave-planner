import { DEFAULT_SETTINGS, DEFAULT_UI_PREFS, STORAGE_KEY, STORAGE_VERSION } from '@constants';
import { type BalanceCheckpoint, type LeaveSettings, LeaveType, type Plan } from '@core';
import type { UIPreferences } from '@shared/types';

export interface PersistedState {
  plan: Plan;
  settings: LeaveSettings;
  uiPreferences: UIPreferences;
}

export interface LeaveRepository {
  load(): PersistedState;
  save(state: PersistedState): void;
}

interface SettingsV2 {
  initialCP: number;
  accrualRateCP: number;
  initialRTT: number;
  accrualRateRTT: number;
}

const EMPTY_STATE: PersistedState = {
  plan: {},
  settings: DEFAULT_SETTINGS,
  uiPreferences: DEFAULT_UI_PREFS,
};

const memoryStorage: Pick<Storage, 'getItem' | 'setItem'> = {
  getItem: () => null,
  setItem: () => {},
};

const safeLocalStorage = (): Pick<Storage, 'getItem' | 'setItem'> => {
  try {
    return window.localStorage;
  } catch {
    return memoryStorage;
  }
};

const VALID_TYPES: ReadonlySet<string> = new Set(Object.values(LeaveType));

const isDateStr = (value: unknown): value is string => {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
};

const isLeaveType = (value: unknown): value is LeaveType => {
  return typeof value === 'string' && VALID_TYPES.has(value);
};

const finiteOr = (value: unknown, fallback: number): number => {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
};

const sanitizePlan = (value: unknown): Plan => {
  if (!value || typeof value !== 'object') {
    return {};
  }
  const plan: Plan = {};
  for (const [dateStr, type] of Object.entries(value)) {
    if (isDateStr(dateStr) && isLeaveType(type)) {
      plan[dateStr] = type;
    }
  }
  return plan;
};

const sanitizeCheckpoints = (value: unknown): BalanceCheckpoint[] => {
  if (!Array.isArray(value)) {
    return [];
  }
  const checkpoints: BalanceCheckpoint[] = [];
  for (const entry of value) {
    if (!entry || typeof entry !== 'object') {
      continue;
    }
    const c = entry as Partial<BalanceCheckpoint>;
    if (isDateStr(c.dateStr)) {
      checkpoints.push({
        dateStr: c.dateStr,
        balanceCP: finiteOr(c.balanceCP, 0),
        balanceRTT: finiteOr(c.balanceRTT, 0),
      });
    }
  }
  return checkpoints;
};

const sanitizeSettings = (value: unknown): LeaveSettings => {
  if (!value || typeof value !== 'object') {
    return DEFAULT_SETTINGS;
  }
  const s = value as Partial<LeaveSettings>;
  return {
    accrualRateCP: finiteOr(s.accrualRateCP, DEFAULT_SETTINGS.accrualRateCP),
    accrualRateRTT: finiteOr(s.accrualRateRTT, DEFAULT_SETTINGS.accrualRateRTT),
    checkpoints: sanitizeCheckpoints(s.checkpoints),
  };
};

const sanitizeSettingsV2 = (value: unknown): SettingsV2 => {
  if (!value || typeof value !== 'object') {
    return {
      initialCP: 0,
      accrualRateCP: DEFAULT_SETTINGS.accrualRateCP,
      initialRTT: 0,
      accrualRateRTT: DEFAULT_SETTINGS.accrualRateRTT,
    };
  }
  const s = value as Partial<SettingsV2>;
  return {
    initialCP: finiteOr(s.initialCP, 0),
    accrualRateCP: finiteOr(s.accrualRateCP, DEFAULT_SETTINGS.accrualRateCP),
    initialRTT: finiteOr(s.initialRTT, 0),
    accrualRateRTT: finiteOr(s.accrualRateRTT, DEFAULT_SETTINGS.accrualRateRTT),
  };
};

const upgradeSettingsV2toV3 = (value: unknown): LeaveSettings => {
  const s = sanitizeSettingsV2(value);
  const checkpoints: BalanceCheckpoint[] =
    s.initialCP !== 0 || s.initialRTT !== 0
      ? [{ dateStr: '2026-01-01', balanceCP: s.initialCP, balanceRTT: s.initialRTT }]
      : [];
  return {
    accrualRateCP: s.accrualRateCP,
    accrualRateRTT: s.accrualRateRTT,
    checkpoints,
  };
};

const sanitizeUiPreferences = (value: unknown): UIPreferences => {
  if (!value || typeof value !== 'object') {
    return DEFAULT_UI_PREFS;
  }
  const prefs = value as Partial<UIPreferences>;
  return {
    hidePastMonths:
      typeof prefs.hidePastMonths === 'boolean'
        ? prefs.hidePastMonths
        : DEFAULT_UI_PREFS.hidePastMonths,
  };
};

const sanitizeState = (value: unknown): PersistedState => {
  if (!value || typeof value !== 'object') {
    return EMPTY_STATE;
  }
  const state = value as Partial<PersistedState>;
  return {
    plan: sanitizePlan(state.plan),
    settings: sanitizeSettings(state.settings),
    uiPreferences: sanitizeUiPreferences(state.uiPreferences),
  };
};

const planFromV1Leaves = (leaves: unknown): Plan => {
  if (!Array.isArray(leaves)) {
    return {};
  }
  const plan: Plan = {};
  for (const entry of leaves) {
    if (!entry || typeof entry !== 'object') {
      continue;
    }
    const { dateStr, type } = entry as { dateStr?: unknown; type?: unknown };
    if (isDateStr(dateStr) && isLeaveType(type)) {
      plan[dateStr] = type;
    }
  }
  return plan;
};

export const createRepository = (
  storage: Pick<Storage, 'getItem' | 'setItem'> = safeLocalStorage()
): LeaveRepository => ({
  load() {
    try {
      const raw = storage.getItem(STORAGE_KEY);
      if (!raw) {
        return EMPTY_STATE;
      }
      const parsed: unknown = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') {
        return EMPTY_STATE;
      }
      const { version, leaves, settings, uiPreferences } = parsed as {
        version?: unknown;
        leaves?: unknown;
        settings?: unknown;
        uiPreferences?: unknown;
      };
      if (version === STORAGE_VERSION) {
        return sanitizeState(parsed);
      }
      if (version === 1 || version === 2) {
        return {
          plan: version === 1 ? planFromV1Leaves(leaves) : sanitizePlan(leaves),
          settings: upgradeSettingsV2toV3(settings),
          uiPreferences: sanitizeUiPreferences(uiPreferences),
        };
      }
      return EMPTY_STATE;
    } catch {
      return EMPTY_STATE;
    }
  },

  save(state: PersistedState) {
    try {
      const blob = {
        version: STORAGE_VERSION,
        leaves: state.plan,
        settings: state.settings,
        uiPreferences: state.uiPreferences,
      };
      storage.setItem(STORAGE_KEY, JSON.stringify(blob));
    } catch {
      // storage unavailable or full — the app keeps running from memory
    }
  },
});
