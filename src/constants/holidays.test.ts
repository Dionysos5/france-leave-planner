import { describe, expect, test } from 'bun:test';
import { getPublicHolidays } from './holidays';

const CURATED_2026 = [
  { dateStr: '2026-01-01', name: { en: "New Year's Day", fr: "Jour de l'An" } },
  { dateStr: '2026-04-06', name: { en: 'Easter Monday', fr: 'Lundi de Pâques' } },
  { dateStr: '2026-05-01', name: { en: 'Labour Day', fr: 'Fête du Travail' } },
  { dateStr: '2026-05-08', name: { en: 'Victory in WWII Day', fr: 'Victoire 1945' } },
  { dateStr: '2026-05-14', name: { en: 'Ascension Day', fr: 'Ascension' } },
  { dateStr: '2026-05-25', name: { en: 'Whit Monday', fr: 'Lundi de Pentecôte' } },
  { dateStr: '2026-07-14', name: { en: 'Bastille Day', fr: 'Fête Nationale' } },
  { dateStr: '2026-08-15', name: { en: 'Assumption Day', fr: 'Assomption' } },
  { dateStr: '2026-11-01', name: { en: "All Saints' Day", fr: 'Toussaint' } },
  { dateStr: '2026-11-11', name: { en: 'Armistice Day', fr: 'Armistice' } },
  { dateStr: '2026-12-25', name: { en: 'Christmas Day', fr: 'Noël' } },
];

describe('getPublicHolidays', () => {
  test('reproduces the hand-curated 2026 calendar exactly', () => {
    expect(getPublicHolidays(2026)).toEqual(CURATED_2026);
  });

  test('always yields eleven sorted holidays', () => {
    for (const year of [2027, 2028, 2031, 2038]) {
      const holidays = getPublicHolidays(year);
      expect(holidays).toHaveLength(11);
      const dateStrs = holidays.map((h) => h.dateStr);
      expect(dateStrs).toEqual([...dateStrs].sort());
    }
  });

  test('computus-derived dates for 2027 (Easter March 28)', () => {
    const byDate = new Map(getPublicHolidays(2027).map((h) => [h.dateStr, h]));
    expect(byDate.has('2027-03-29')).toBe(true);
    expect(byDate.has('2027-05-06')).toBe(true);
    expect(byDate.has('2027-05-17')).toBe(true);
  });

  test('computus-derived dates for 2028 (Easter April 16)', () => {
    const byDate = new Map(getPublicHolidays(2028).map((h) => [h.dateStr, h]));
    expect(byDate.has('2028-04-17')).toBe(true);
    expect(byDate.has('2028-05-25')).toBe(true);
    expect(byDate.has('2028-06-05')).toBe(true);
  });
});
