import { getDatesInRange, resolveSelection, type YearCalendar } from '@core';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const EMPTY_SELECTION: ReadonlySet<string> = new Set();

/** How long a finger must rest on a day before dragging paints instead of scrolling. */
const LONG_PRESS_MS = 350;
/** Movement allowed during a tap or long press before it counts as a scroll. */
const TOUCH_SLOP_PX = 10;

interface PendingPress {
  dateStr: string;
  x: number;
  y: number;
  timer: number;
}

/** The day under a point; day cells carry `data-date`. */
const dateAt = (x: number, y: number): string | null => {
  return document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-date]')?.dataset.date ?? null;
};

/**
 * Click-or-drag painting shared by every month, so a drag can cross month boundaries.
 * With a mouse, pressing starts a selection right away. With touch, a tap toggles a day,
 * a long press starts a selection that follows the finger, and moving first scrolls.
 */
export const usePaintSelection = (
  calendar: YearCalendar,
  onToggleDay: (dateStr: string) => void,
  onRangeUpdate: (dates: string[]) => void
) => {
  const [anchor, setAnchor] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const pendingPress = useRef<PendingPress | null>(null);

  const selection = useMemo<ReadonlySet<string>>(
    () => (anchor && hover ? new Set(getDatesInRange(anchor, hover)) : EMPTY_SELECTION),
    [anchor, hover]
  );

  const startSelection = useCallback((dateStr: string) => {
    setAnchor(dateStr);
    setHover(dateStr);
  }, []);

  // While selecting: follow the pointer, keep the page from scrolling, commit on release.
  useEffect(() => {
    if (!anchor || !hover) {
      return;
    }
    const cancel = () => {
      setAnchor(null);
      setHover(null);
    };
    const follow = (event: PointerEvent) => {
      const dateStr = dateAt(event.clientX, event.clientY);
      if (dateStr) {
        setHover(dateStr);
      }
    };
    const commit = () => {
      const edit = resolveSelection(calendar, anchor, hover);
      if (edit?.kind === 'toggle') {
        onToggleDay(edit.dateStr);
      } else if (edit?.kind === 'range') {
        onRangeUpdate(edit.dates);
      }
      cancel();
    };
    const blockScroll = (event: TouchEvent) => event.preventDefault();

    window.addEventListener('pointermove', follow);
    window.addEventListener('pointerup', commit);
    window.addEventListener('pointercancel', cancel);
    window.addEventListener('blur', cancel);
    window.addEventListener('touchmove', blockScroll, { passive: false });
    return () => {
      window.removeEventListener('pointermove', follow);
      window.removeEventListener('pointerup', commit);
      window.removeEventListener('pointercancel', cancel);
      window.removeEventListener('blur', cancel);
      window.removeEventListener('touchmove', blockScroll);
    };
  }, [anchor, hover, calendar, onToggleDay, onRangeUpdate]);

  // Before a touch selection starts: a tap toggles, moving turns the press into a scroll.
  useEffect(() => {
    const clear = () => {
      if (pendingPress.current) {
        window.clearTimeout(pendingPress.current.timer);
        pendingPress.current = null;
      }
    };
    const move = (event: PointerEvent) => {
      const press = pendingPress.current;
      if (press && Math.hypot(event.clientX - press.x, event.clientY - press.y) > TOUCH_SLOP_PX) {
        clear();
      }
    };
    const release = () => {
      const press = pendingPress.current;
      if (!press) {
        return;
      }
      clear();
      if (resolveSelection(calendar, press.dateStr, press.dateStr)) {
        onToggleDay(press.dateStr);
      }
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', clear);
    return () => {
      clear();
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', release);
      window.removeEventListener('pointercancel', clear);
    };
  }, [calendar, onToggleDay]);

  const pressDay = useCallback(
    (dateStr: string, event: ReactPointerEvent) => {
      if (event.pointerType === 'mouse') {
        if (event.button !== 0) {
          return;
        }
        event.preventDefault(); // Prevent text selection
        startSelection(dateStr);
        return;
      }
      const timer = window.setTimeout(() => {
        pendingPress.current = null;
        navigator.vibrate?.(10);
        startSelection(dateStr);
      }, LONG_PRESS_MS);
      pendingPress.current = { dateStr, x: event.clientX, y: event.clientY, timer };
    },
    [startSelection]
  );

  return { selection, pressDay };
};
