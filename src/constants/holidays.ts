import type { PublicHoliday } from '@core';
import { addDays, format } from 'date-fns';

const DATE_FORMAT = 'yyyy-MM-dd';

const FIXED_HOLIDAYS = [
  { month: 1, day: 1, name: { en: "New Year's Day", fr: "Jour de l'An" } },
  { month: 5, day: 1, name: { en: 'Labour Day', fr: 'Fête du Travail' } },
  { month: 5, day: 8, name: { en: 'Victory in WWII Day', fr: 'Victoire 1945' } },
  { month: 7, day: 14, name: { en: 'Bastille Day', fr: 'Fête Nationale' } },
  { month: 8, day: 15, name: { en: 'Assumption Day', fr: 'Assomption' } },
  { month: 11, day: 1, name: { en: "All Saints' Day", fr: 'Toussaint' } },
  { month: 11, day: 11, name: { en: 'Armistice Day', fr: 'Armistice' } },
  { month: 12, day: 25, name: { en: 'Christmas Day', fr: 'Noël' } },
];

const EASTER_OFFSETS = [
  { days: 1, name: { en: 'Easter Monday', fr: 'Lundi de Pâques' } },
  { days: 39, name: { en: 'Ascension Day', fr: 'Ascension' } },
  { days: 50, name: { en: 'Whit Monday', fr: 'Lundi de Pentecôte' } },
];

const easterSunday = (year: number): Date => {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
};

export const getPublicHolidays = (year: number): PublicHoliday[] => {
  const easter = easterSunday(year);

  const fixed = FIXED_HOLIDAYS.map((holiday) => ({
    date: new Date(year, holiday.month - 1, holiday.day),
    name: holiday.name,
  }));
  const easterDerived = EASTER_OFFSETS.map((offset) => ({
    date: addDays(easter, offset.days),
    name: offset.name,
  }));

  return [...fixed, ...easterDerived]
    .map(({ date, name }) => ({ dateStr: format(date, DATE_FORMAT), name }))
    .sort((a, b) => a.dateStr.localeCompare(b.dateStr));
};
