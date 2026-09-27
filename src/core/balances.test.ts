import { describe, expect, test } from 'bun:test';
import { projectYear } from './balances';
import { buildYearCalendar } from './calendar';
import { CP_PER_MONTH, FORFAIT_DAYS } from './rules';
import { type BalanceCheckpoint, LeaveType, type Plan } from './types';

const { CP, RTT, UNPAID, SICK } = LeaveType;

// Without public holidays, 2024 has 262 weekdays (19 RTT) and 2023 has 260 (17 RTT).
const NO_HOLIDAYS = (year: number) => buildYearCalendar(year, []);
const RTT_2024 = 19;
const JANUARY_2024_WEEKDAYS = 23;

const project = (year: number, plan: Plan, checkpoints: BalanceCheckpoint[] = []) =>
  projectYear(year, plan, { checkpoints }, NO_HOLIDAYS);

const checkpoint = (dateStr: string, cpPrevious: number, cpCurrent: number, rtt: number) => ({
  id: dateStr,
  dateStr,
  cpPrevious,
  cpCurrent,
  rtt,
});

describe('projectYear', () => {
  test('without checkpoints CP starts from zero and RTT is granted on January 1', () => {
    const { months } = project(2024, {});
    expect(months).toHaveLength(12);
    expect(months[0].cpPrevious).toBe(0);
    expect(months[0].cpCurrent).toBeCloseTo(CP_PER_MONTH, 3);
    expect(months[0].rtt).toBe(RTT_2024);
  });

  test('CP N rolls into CP N-1 on June 1', () => {
    const { months } = project(2024, {});
    expect(months[4].cpCurrent).toBeCloseTo(5 * CP_PER_MONTH, 3);
    expect(months[5].cpPrevious).toBeCloseTo(5 * CP_PER_MONTH, 3);
    expect(months[5].cpCurrent).toBeCloseTo(CP_PER_MONTH, 3);
  });

  test('a full year earns 25 CP', () => {
    const { months } = project(2024, {});
    expect(months[11].cpPrevious + months[11].cpCurrent).toBeCloseTo(25, 3);
  });

  test('CP is taken from N-1 first, then from N', () => {
    const { months } = project(2024, { '2024-01-02': CP }, [checkpoint('2024-01-01', 0.5, 5, 0)]);
    expect(months[0].cpPrevious).toBe(0);
    expect(months[0].cpCurrent).toBeCloseTo(4.5 + CP_PER_MONTH, 3);
  });

  test('CP N-1 left on May 31 is lost', () => {
    const { months, cpLostOnMay31 } = project(2024, {}, [checkpoint('2024-01-01', 3, 0, 0)]);
    expect(cpLostOnMay31).toBe(3);
    expect(months[5].cpPrevious).toBeCloseTo(5 * CP_PER_MONTH, 3);
  });

  test('balances carry over from a checkpoint in a previous year', () => {
    const { months } = project(2024, {}, [checkpoint('2023-06-01', 10, 0, 5)]);
    expect(months[0].cpPrevious).toBe(10);
    expect(months[0].cpCurrent).toBeCloseTo(8 * CP_PER_MONTH, 3);
    expect(months[0].rtt).toBe(RTT_2024);
  });

  test('RTT left on December 31 is lost', () => {
    const { rttLostOnDec31 } = project(2023, {}, [checkpoint('2023-06-01', 0, 0, 5)]);
    expect(rttLostOnDec31).toBe(5);
  });

  test('an RTT day uses one RTT', () => {
    const { months, rttLostOnDec31 } = project(2024, { '2024-01-02': RTT });
    expect(months[0].rtt).toBe(RTT_2024 - 1);
    expect(rttLostOnDec31).toBe(RTT_2024 - 1);
  });

  test('leave on weekends is ignored', () => {
    const { months } = project(2024, { '2024-01-06': CP, '2024-01-07': RTT });
    expect(months[0].cpCurrent).toBeCloseTo(CP_PER_MONTH, 3);
    expect(months[0].rtt).toBe(RTT_2024);
  });

  test('unpaid leave reduces CP accrual and RTT in proportion', () => {
    const { months } = project(2024, { '2024-01-02': UNPAID });
    expect(months[0].cpCurrent).toBeCloseTo(
      (CP_PER_MONTH * (JANUARY_2024_WEEKDAYS - 1)) / JANUARY_2024_WEEKDAYS,
      3
    );
    expect(months[0].rtt).toBeCloseTo(RTT_2024 - RTT_2024 / (FORFAIT_DAYS + RTT_2024), 3);
  });

  test('sick leave earns 80% of CP and leaves RTT untouched', () => {
    const { months } = project(2024, { '2024-01-02': SICK });
    expect(months[0].cpCurrent).toBeCloseTo(
      (CP_PER_MONTH * (JANUARY_2024_WEEKDAYS - 0.2)) / JANUARY_2024_WEEKDAYS,
      3
    );
    expect(months[0].rtt).toBe(RTT_2024);
  });

  test('a checkpoint resets the running balances mid-year', () => {
    const { months } = project(2024, { '2024-01-02': CP }, [checkpoint('2024-03-01', 2, 7, 4)]);
    expect(months[2]).toEqual({
      cpPrevious: 2,
      cpCurrent: Number((7 + CP_PER_MONTH).toFixed(3)),
      rtt: 4,
    });
  });

  test('a checkpoint on the last day of a month already includes that month accrual', () => {
    const { months } = project(2024, {}, [checkpoint('2024-08-31', 6.5, 1, 0.5)]);
    expect(months[7]).toEqual({ cpPrevious: 6.5, cpCurrent: 1, rtt: 0.5 });
  });

  test('checkpoints after the projected year are ignored', () => {
    const { months } = project(2024, {}, [checkpoint('2025-03-01', 9, 9, 9)]);
    expect(months[0].rtt).toBe(RTT_2024);
  });
});
