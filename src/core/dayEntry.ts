import { HALF_DAY_TYPES } from './rules';
import type { DayEntry, DayType, Half, HalfDays } from './types';

export type Halves = Record<Half, DayType | null>;

export const isHalfDayType = (type: DayType): boolean => HALF_DAY_TYPES.has(type);

/** What each half of a day holds; a full day fills both. */
export const halvesOf = (entry: DayEntry | undefined): Halves => {
  if (entry === undefined) {
    return { am: null, pm: null };
  }
  if (typeof entry === 'string') {
    return { am: entry, pm: entry };
  }
  return { am: entry.am ?? null, pm: entry.pm ?? null };
};

/** The shortest entry for two halves: nothing when both are free, a full day when they match. */
export const entryOf = ({ am, pm }: Halves): DayEntry | undefined => {
  if (am === pm) {
    return am ?? undefined;
  }
  const halves: HalfDays = {};
  if (am) halves.am = am;
  if (pm) halves.pm = pm;
  return halves;
};
