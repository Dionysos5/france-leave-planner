import { getDatesInRange, resolveSelection, type YearCalendar } from '@core';
import { useCallback, useEffect, useMemo, useState } from 'react';

const EMPTY_SELECTION: ReadonlySet<string> = new Set();

/** Click-or-drag painting shared by every month, so a drag can cross month boundaries. */
export const usePaintSelection = (
  calendar: YearCalendar,
  onToggleDay: (dateStr: string) => void,
  onRangeUpdate: (dates: string[]) => void
) => {
  const [anchor, setAnchor] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);

  const selection = useMemo<ReadonlySet<string>>(
    () => (anchor && hover ? new Set(getDatesInRange(anchor, hover)) : EMPTY_SELECTION),
    [anchor, hover]
  );

  useEffect(() => {
    if (!anchor || !hover) {
      return;
    }
    const cancel = () => {
      setAnchor(null);
      setHover(null);
    };
    // Listen on the window so releasing outside the calendar still commits.
    const commit = () => {
      const edit = resolveSelection(calendar, anchor, hover);
      if (edit?.kind === 'toggle') {
        onToggleDay(edit.dateStr);
      } else if (edit?.kind === 'range') {
        onRangeUpdate(edit.dates);
      }
      cancel();
    };
    window.addEventListener('mouseup', commit);
    document.addEventListener('mouseleave', cancel);
    window.addEventListener('blur', cancel);
    return () => {
      window.removeEventListener('mouseup', commit);
      document.removeEventListener('mouseleave', cancel);
      window.removeEventListener('blur', cancel);
    };
  }, [anchor, hover, calendar, onToggleDay, onRangeUpdate]);

  const startSelection = useCallback((dateStr: string) => {
    setAnchor(dateStr);
    setHover(dateStr);
  }, []);

  const extendSelection = useCallback((dateStr: string) => {
    setHover((current) => (current === null ? null : dateStr));
  }, []);

  return { selection, startSelection, extendSelection };
};
