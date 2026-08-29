import { getPublicHolidays } from '@constants';
import { buildYearCalendar, LeaveType } from '@core';
import { useMemo, useState } from 'react';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';

export const useEditorState = () => {
  const [year, setYear] = useState(() => new Date().getFullYear());
  const calendar = useMemo(() => buildYearCalendar(year, getPublicHolidays(year)), [year]);
  const [activeTool, setActiveTool] = useState<LeaveType | null>(LeaveType.CP);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useKeyboardShortcuts(setActiveTool, !isSettingsOpen);

  return {
    year,
    setYear,
    calendar,
    activeTool,
    setActiveTool,
    isSettingsOpen,
    setIsSettingsOpen,
  };
};
