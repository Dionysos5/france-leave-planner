import {
  applyRange,
  applyToggle,
  type LeaveSettings,
  type LeaveType,
  type Plan,
  projectYear,
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

  const projection = useMemo(
    () => projectYear(calendar.year, plan, settings),
    [calendar.year, plan, settings]
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
    projection,
    handleToggleDay,
    handleRangeUpdate,
  };
};
