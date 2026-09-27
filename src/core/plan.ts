import { getDatesInRange, isWorkableDay } from './calendar';
import { entryOf, type Halves, halvesOf, isHalfDayType } from './dayEntry';
import type { DayType, Plan, YearCalendar } from './types';

const FREE: Halves = { am: null, pm: null };

/**
 * What a click with a half-day tool does. On its own the tool cycles full day → morning →
 * afternoon → free. Next to another type it fills the free half, or frees its own half.
 */
const cycleHalves = ({ am, pm }: Halves, tool: DayType): Halves => {
  if (am === tool && pm === tool) return { am: tool, pm: null };
  if (am === tool) return { am: null, pm: pm === null ? tool : pm };
  if (pm === tool) return { am, pm: null };
  if (am !== null && pm === null) return { am, pm: tool };
  if (am === null && pm !== null) return { am: tool, pm };
  return { am: tool, pm: tool };
};

export const applyToggle = (plan: Plan, dateStr: string, tool: DayType | null): Plan => {
  const current = plan[dateStr];
  let halves: Halves;
  if (tool === null) {
    halves = FREE;
  } else if (isHalfDayType(tool)) {
    halves = cycleHalves(halvesOf(current), tool);
  } else {
    // Whole-day types toggle the full day, as before half days existed.
    halves = current === tool ? FREE : { am: tool, pm: tool };
  }

  const next = { ...plan };
  const entry = entryOf(halves);
  if (entry === undefined) {
    delete next[dateStr];
  } else {
    next[dateStr] = entry;
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
