import { describe, expect, test } from 'bun:test';
import { frenchCalendar } from './holidays';
import { forfaitRestDays } from './rules';

describe('forfaitRestDays', () => {
  test('2026 has 9 RTT: 9 public holidays fall on weekdays', () => {
    expect(forfaitRestDays(frenchCalendar(2026))).toBe(9);
  });

  test('2027 has 11 RTT: only 7 public holidays fall on weekdays', () => {
    expect(forfaitRestDays(frenchCalendar(2027))).toBe(11);
  });
});
