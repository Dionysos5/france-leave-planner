import { DEFAULT_SETTINGS, DEFAULT_UI_PREFS, STORAGE_KEY, STORAGE_VERSION } from '@constants';
import { calculateLedger, formatDate } from '@services/leaveService';
import {
  type AppData,
  type LeaveEntry,
  type LeaveSettings,
  LeaveType,
  type UIPreferences,
} from '@shared/types';
import { useCallback, useEffect, useMemo, useState } from 'react';

function loadAppData(): {
  leaves: LeaveEntry[];
  settings: LeaveSettings;
  uiPreferences: UIPreferences;
} {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw)
      return {
        leaves: [],
        settings: DEFAULT_SETTINGS,
        uiPreferences: DEFAULT_UI_PREFS,
      };
    const parsed: AppData = JSON.parse(raw);
    if (parsed.version !== STORAGE_VERSION) {
      return {
        leaves: [],
        settings: DEFAULT_SETTINGS,
        uiPreferences: DEFAULT_UI_PREFS,
      };
    }
    return {
      leaves: parsed.leaves,
      settings: parsed.settings,
      uiPreferences: parsed.uiPreferences,
    };
  } catch {
    return {
      leaves: [],
      settings: DEFAULT_SETTINGS,
      uiPreferences: DEFAULT_UI_PREFS,
    };
  }
}

export const useLeaveApp = () => {
  const [settings, setSettings] = useState<LeaveSettings>(() => loadAppData().settings);
  const [uiPreferences, setUiPreferences] = useState<UIPreferences>(
    () => loadAppData().uiPreferences
  );
  const [leaves, setLeaves] = useState<LeaveEntry[]>(() => loadAppData().leaves);

  const [activeTool, setActiveTool] = useState<LeaveType | null>(LeaveType.CP);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Derived state
  const leavesByDate = useMemo(() => {
    const map = new Map<string, LeaveType>();
    for (const l of leaves) {
      map.set(l.dateStr, l.type);
    }
    return map;
  }, [leaves]);

  const ledger = useMemo(() => calculateLedger(leavesByDate, settings), [leavesByDate, settings]);

  const monthlyBalances = useMemo(
    () =>
      ledger
        .filter((e) => e.id.startsWith('accrual-'))
        .map((e) => ({ balanceCP: e.balanceCP, balanceRTT: e.balanceRTT })),
    [ledger]
  );

  const currentBalance = useMemo(() => {
    const today = formatDate(new Date());
    const past = ledger.filter((e) => e.date <= today);
    const last = past.at(-1);
    return {
      balanceCP: last?.balanceCP ?? settings.initialCP,
      balanceRTT: last?.balanceRTT ?? settings.initialRTT,
    };
  }, [ledger, settings]);

  const endBalance = useMemo(() => {
    const last = monthlyBalances.at(-1);
    return last ?? { balanceCP: settings.initialCP, balanceRTT: settings.initialRTT };
  }, [monthlyBalances, settings]);

  // Persist as a single atomic blob
  useEffect(() => {
    const data: AppData = {
      version: STORAGE_VERSION,
      lastUpdated: new Date().toISOString(),
      leaves,
      settings,
      uiPreferences,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [leaves, settings, uiPreferences]);

  // Handlers
  const handleToggleDay = useCallback(
    (dateStr: string) => {
      setLeaves((prev) => {
        const existingIndex = prev.findIndex((l) => l.dateStr === dateStr);

        if (activeTool === null) {
          if (existingIndex >= 0) {
            const next = [...prev];
            next.splice(existingIndex, 1);
            return next;
          }
          return prev;
        }

        if (existingIndex >= 0) {
          const existing = prev[existingIndex];
          if (existing.type === activeTool) {
            const next = [...prev];
            next.splice(existingIndex, 1);
            return next;
          }
          const next = [...prev];
          next[existingIndex] = {
            dateStr,
            type: activeTool,
            createdAt: new Date().toISOString(),
          };
          return next;
        }
        return [...prev, { dateStr, type: activeTool, createdAt: new Date().toISOString() }];
      });
    },
    [activeTool]
  );

  const handleRangeUpdate = useCallback(
    (dates: string[]) => {
      setLeaves((prev) => {
        const datesSet = new Set(dates);
        const filtered = prev.filter((l) => !datesSet.has(l.dateStr));

        if (activeTool === null) {
          return filtered;
        }

        const now = new Date().toISOString();
        const newLeaves = dates.map((dateStr) => ({
          dateStr,
          type: activeTool,
          createdAt: now,
        }));
        return [...filtered, ...newLeaves];
      });
    },
    [activeTool]
  );

  return {
    settings,
    setSettings,
    uiPreferences,
    setUiPreferences,
    activeTool,
    setActiveTool,
    isSettingsOpen,
    setIsSettingsOpen,
    monthlyBalances,
    currentBalance,
    endBalance,
    leavesByDate,
    handleToggleDay,
    handleRangeUpdate,
  };
};
