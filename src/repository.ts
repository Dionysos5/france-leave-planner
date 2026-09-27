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
  initialRTT: number;
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

type CheckpointBalances = Omit<BalanceCheckpoint, 'id' | 'dateStr'>;

// Checkpoints saved before ids existed get a positional one.
const checkpointId = (value: unknown, index: number): string => {
  return typeof value === 'string' && value ? value : `checkpoint-${index}`;
};

const sanitizeCheckpoints = (
  value: unknown,
  toBalances: (entry: Record<string, unknown>) => CheckpointBalances
): BalanceCheckpoint[] => {
  if (!Array.isArray(value)) {
    return [];
  }
  const checkpoints: BalanceCheckpoint[] = [];
  for (const [index, entry] of value.entries()) {
    if (!entry || typeof entry !== 'object') {
      continue;
    }
    const c = entry as Record<string, unknown>;
    if (isDateStr(c.dateStr)) {
      checkpoints.push({ id: checkpointId(c.id, index), dateStr: c.dateStr, ...toBalances(c) });
    }
  }
  return checkpoints;
};

const sanitizeSettings = (value: unknown): LeaveSettings => {
  if (!value || typeof value !== 'object') {
    return DEFAULT_SETTINGS;
  }
  const s = value as { checkpoints?: unknown };
  return {
    checkpoints: sanitizeCheckpoints(s.checkpoints, (c) => ({
      cpPrevious: finiteOr(c.cpPrevious, 0),
      cpCurrent: finiteOr(c.cpCurrent, 0),
      rtt: finiteOr(c.rtt, 0),
    })),
  };
};

// v3 kept a single CP balance; which reference period it came from is unknown, so it lands in
// CP N, which never expires before the next May 31.
const upgradeSettingsV3toV4 = (value: unknown): LeaveSettings => {
  if (!value || typeof value !== 'object') {
    return DEFAULT_SETTINGS;
  }
  const s = value as { checkpoints?: unknown };
  return {
    checkpoints: sanitizeCheckpoints(s.checkpoints, (c) => ({
      cpPrevious: 0,
      cpCurrent: finiteOr(c.balanceCP, 0),
      rtt: finiteOr(c.balanceRTT, 0),
    })),
  };
};

const sanitizeSettingsV2 = (value: unknown): SettingsV2 => {
  if (!value || typeof value !== 'object') {
    return { initialCP: 0, initialRTT: 0 };
  }
  const s = value as Partial<SettingsV2>;
  return {
    initialCP: finiteOr(s.initialCP, 0),
    initialRTT: finiteOr(s.initialRTT, 0),
  };
};

const upgradeSettingsV2toV4 = (value: unknown): LeaveSettings => {
  const s = sanitizeSettingsV2(value);
  const checkpoints: BalanceCheckpoint[] =
    s.initialCP !== 0 || s.initialRTT !== 0
      ? [
          {
            id: checkpointId(undefined, 0),
            dateStr: '2026-01-01',
            cpPrevious: 0,
            cpCurrent: s.initialCP,
            rtt: s.initialRTT,
          },
        ]
      : [];
  return { checkpoints };
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
      const upgradeSettings: Record<number, (value: unknown) => LeaveSettings> = {
        1: upgradeSettingsV2toV4,
        2: upgradeSettingsV2toV4,
        3: upgradeSettingsV3toV4,
        [STORAGE_VERSION]: sanitizeSettings,
      };
      if (typeof version !== 'number' || !upgradeSettings[version]) {
        return EMPTY_STATE;
      }
      return {
        plan: version === 1 ? planFromV1Leaves(leaves) : sanitizePlan(leaves),
        settings: upgradeSettings[version](settings),
        uiPreferences: sanitizeUiPreferences(uiPreferences),
      };
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
