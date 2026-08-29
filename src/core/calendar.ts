import * as df from 'date-fns';
import type { DayInfo, PublicHoliday, YearCalendar } from './types';

const DATE_FORMAT = 'yyyy-MM-dd';

export const formatDate = (date: Date): string => {
  return df.format(date, DATE_FORMAT);
};

const parseDateStr = (dateStr: string): Date => {
  return df.parseISO(dateStr);
};

const isWeekend = (date: Date): boolean => {
  return df.isWeekend(date);
};

export const isToday = (dateStr: string): boolean => {
  return df.isToday(parseDateStr(dateStr));
};

export const getMonthDays = (calendar: YearCalendar, month: number): Date[] => {
  const start = new Date(calendar.year, month, 1);
  return df.eachDayOfInterval({ start, end: df.endOfMonth(start) });
};

export const getDatesInRange = (startDate: string, endDate: string): string[] => {
  const start = parseDateStr(startDate);
  const end = parseDateStr(endDate);
  const [from, to] = df.isBefore(start, end) ? [start, end] : [end, start];
  return df.eachDayOfInterval({ start: from, end: to }).map(formatDate);
};

export const buildYearCalendar = (year: number, holidays: PublicHoliday[]): YearCalendar => {
  return {
    year,
    holidays: new Map(holidays.map((holiday) => [holiday.dateStr, holiday])),
  };
};

export const getDayInfo = (calendar: YearCalendar, dateStr: string): DayInfo => {
  const holiday = calendar.holidays.get(dateStr) ?? null;
  if (holiday) {
    return { kind: 'holiday', holiday };
  }
  return { kind: isWeekend(parseDateStr(dateStr)) ? 'weekend' : 'workable', holiday: null };
};

export const isWorkableDay = (calendar: YearCalendar, dateStr: string): boolean => {
  return getDayInfo(calendar, dateStr).kind === 'workable';
};
