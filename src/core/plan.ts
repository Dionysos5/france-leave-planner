import { getDatesInRange, isWorkableDay } from './calendar';
import type { DayType, Plan, YearCalendar } from './types';

export const applyToggle = (plan: Plan, dateStr: string, tool: DayType | null): Plan => {
  const removes = tool === null || plan[dateStr] === tool;
  const next = { ...plan };
  if (removes) {
    delete next[dateStr];
  } else {
    next[dateStr] = tool;
  }
  return next;
};

export const applyRange = (plan: Plan, dates: string[], tool: DayType | null): Plan => {
  const next = { ...plan };
  for (const dateStr of dates) {
    if (tool === null) {
      delete next[dateStr];
    } else {
      next[dateStr] = tool;
    }
  }
  return next;
};

export type SelectionEdit =
  | { kind: 'toggle'; dateStr: string }
  | { kind: 'range'; dates: string[] }
  | null;

/**
 * What releasing a drag from `anchor` to `hover` does: a click on one workable day toggles
 * it, a drag paints every workable day in between (across months), otherwise nothing.
 */
export const resolveSelection = (
  calendar: YearCalendar,
  anchor: string,
  hover: string
): SelectionEdit => {
  const dates = getDatesInRange(anchor, hover).filter((d) => isWorkableDay(calendar, d));
  if (dates.length === 0) {
    return null;
  }
  if (anchor === hover) {
    return { kind: 'toggle', dateStr: anchor };
  }
  return { kind: 'range', dates };
};
