import { describe, expect, test } from 'bun:test';
import {
  buildYearCalendar,
  formatDate,
  getDatesInRange,
  getDayInfo,
  getMonthDays,
  isWorkableDay,
} from './calendar';

const CALENDAR = buildYearCalendar(2026, [
  { dateStr: '2026-07-14', name: { en: 'Bastille Day', fr: 'Fête Nationale' } },
]);

describe('getDatesInRange', () => {
  test('spans a DST boundary correctly in any timezone', () => {
    expect(getDatesInRange('2026-10-24', '2026-10-27')).toEqual([
      '2026-10-24',
      '2026-10-25',
      '2026-10-26',
      '2026-10-27',
    ]);
  });

  test('steps across a US DST change', () => {
    expect(getDatesInRange('2026-10-31', '2026-11-02')).toEqual([
      '2026-10-31',
      '2026-11-01',
      '2026-11-02',
    ]);
  });

  test('normalizes reversed bounds', () => {
    expect(getDatesInRange('2026-03-03', '2026-03-01')).toEqual([
      '2026-03-01',
      '2026-03-02',
      '2026-03-03',
    ]);
  });

  test('single day yields itself', () => {
    expect(getDatesInRange('2026-05-14', '2026-05-14')).toEqual(['2026-05-14']);
  });
});

describe('getMonthDays', () => {
  test('lists every day of the month in order', () => {
    const days = getMonthDays(CALENDAR, 1);
    expect(days).toHaveLength(28);
    expect(formatDate(days[0])).toBe('2026-02-01');
    expect(formatDate(days[27])).toBe('2026-02-28');
  });

  test('handles leap years', () => {
    expect(getMonthDays(buildYearCalendar(2028, []), 1)).toHaveLength(29);
  });
});

describe('getDayInfo', () => {
  test('workable weekday', () => {
    expect(getDayInfo(CALENDAR, '2026-07-13')).toEqual({ kind: 'workable', holiday: null });
  });

  test('weekend', () => {
    expect(getDayInfo(CALENDAR, '2026-07-18')).toEqual({ kind: 'weekend', holiday: null });
    expect(getDayInfo(CALENDAR, '2026-07-19')).toEqual({ kind: 'weekend', holiday: null });
  });

  test('holiday carries the holiday record', () => {
    expect(getDayInfo(CALENDAR, '2026-07-14').kind).toBe('holiday');
    expect(getDayInfo(CALENDAR, '2026-07-14').holiday?.name.fr).toBe('Fête Nationale');
  });

  test('isWorkableDay agrees with the kind', () => {
    expect(isWorkableDay(CALENDAR, '2026-07-13')).toBe(true);
    expect(isWorkableDay(CALENDAR, '2026-07-14')).toBe(false);
    expect(isWorkableDay(CALENDAR, '2026-07-18')).toBe(false);
  });
});
