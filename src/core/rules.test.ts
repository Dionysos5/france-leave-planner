import { describe, expect, test } from 'bun:test';
import { frenchCalendar } from './holidays';
import { FORFAIT_DAYS, forfaitRestDays, rttCostPerUnpaidDay } from './rules';

describe('forfaitRestDays', () => {
  test('2026 has 9 RTT: 9 public holidays fall on weekdays', () => {
    expect(forfaitRestDays(frenchCalendar(2026))).toBe(9);
  });

  test('2027 has 11 RTT: only 7 public holidays fall on weekdays', () => {
    expect(forfaitRestDays(frenchCalendar(2027))).toBe(11);
  });
});

describe('rttCostPerUnpaidDay', () => {
  test('spreads the year RTT over the expected days of presence', () => {
    expect(rttCostPerUnpaidDay(9)).toBeCloseTo(9 / (FORFAIT_DAYS + 9), 10);
  });

  test('costs nothing when there is no RTT', () => {
    expect(rttCostPerUnpaidDay(0)).toBe(0);
  });
});
