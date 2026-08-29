import {
  applyRange,
  applyToggle,
  calculateMonthlyBalances,
  type LeaveSettings,
  type LeaveType,
  type MonthBalance,
  type Plan,
  type YearCalendar,
} from '@core';
import type { UIPreferences } from '@shared/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createRepository } from '../repository';

const repository = createRepository();

export const useLeavePlan = (calendar: YearCalendar, activeTool: LeaveType | null) => {
  const [persisted] = useState(repository.load);

  const [plan, setPlan] = useState<Plan>(persisted.plan);
  const [settings, setSettings] = useState<LeaveSettings>(persisted.settings);
  const [uiPreferences, setUiPreferences] = useState<UIPreferences>(persisted.uiPreferences);

  const monthlyBalances = useMemo(
    () => calculateMonthlyBalances(calendar, plan, settings),
    [calendar, plan, settings]
  );

  const endBalance = useMemo<MonthBalance>(
    () => monthlyBalances.at(-1) ?? { balanceCP: 0, balanceRTT: 0 },
    [monthlyBalances]
  );

  useEffect(() => {
    repository.save({ plan, settings, uiPreferences });
  }, [plan, settings, uiPreferences]);

  const handleToggleDay = useCallback(
    (dateStr: string) => {
      setPlan((prev) => applyToggle(prev, dateStr, activeTool));
    },
    [activeTool]
  );

  const handleRangeUpdate = useCallback(
    (dates: string[]) => {
      setPlan((prev) => applyRange(prev, dates, activeTool));
    },
    [activeTool]
  );

  return {
    plan,
    settings,
    setSettings,
    uiPreferences,
    setUiPreferences,
    monthlyBalances,
    endBalance,
    handleToggleDay,
    handleRangeUpdate,
  };
};
