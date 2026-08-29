import { describe, expect, test } from 'bun:test';
import { calculateMonthlyBalances } from './balances';
import { buildYearCalendar } from './calendar';
import { type LeaveSettings, LeaveType } from './types';

const { CP, UNPAID } = LeaveType;

const SETTINGS: LeaveSettings = {
  accrualRateCP: 2,
  accrualRateRTT: 1,
  checkpoints: [{ dateStr: '2024-01-01', balanceCP: 10, balanceRTT: 5 }],
};

const CALENDAR_2024 = buildYearCalendar(2024, []);

describe('calculateMonthlyBalances', () => {
  test('accrues monthly from the seeded balance', () => {
    const balances = calculateMonthlyBalances(CALENDAR_2024, {}, SETTINGS);
    expect(balances).toHaveLength(12);
    expect(balances[0]).toEqual({ balanceCP: 12, balanceRTT: 6 });
    expect(balances[1]).toEqual({ balanceCP: 14, balanceRTT: 7 });
  });

  test('CP usage subtracts on top of accrual', () => {
    const balances = calculateMonthlyBalances(CALENDAR_2024, { '2024-01-02': CP }, SETTINGS);
    expect(balances[0]).toEqual({ balanceCP: 11, balanceRTT: 6 });
  });

  test('leaves on weekends and holidays are ignored', () => {
    const balances = calculateMonthlyBalances(
      CALENDAR_2024,
      { '2024-01-06': CP, '2024-01-07': CP },
      SETTINGS
    );
    expect(balances[0]).toEqual({ balanceCP: 12, balanceRTT: 6 });
  });

  test('balances are cumulative across the year', () => {
    const balances = calculateMonthlyBalances(CALENDAR_2024, { '2024-01-02': CP }, SETTINGS);
    expect(balances[11]).toEqual({ balanceCP: 33, balanceRTT: 17 });
  });

  test('unpaid leave slows accrual through the work ratio', () => {
    const balances = calculateMonthlyBalances(CALENDAR_2024, { '2024-01-02': UNPAID }, SETTINGS);
    expect(balances[0].balanceCP).toBeCloseTo(10 + (2 * 22) / 23, 3);
    expect(balances[0].balanceRTT).toBeCloseTo(5 + (1 * 22) / 23, 3);
  });

  test('without checkpoints the year starts from zero', () => {
    const balances = calculateMonthlyBalances(
      CALENDAR_2024,
      {},
      {
        accrualRateCP: 2,
        accrualRateRTT: 1,
        checkpoints: [],
      }
    );
    expect(balances[0]).toEqual({ balanceCP: 2, balanceRTT: 1 });
  });

  test('a checkpoint resets the running balance mid-year', () => {
    const settings: LeaveSettings = {
      accrualRateCP: 2,
      accrualRateRTT: 1,
      checkpoints: [{ dateStr: '2024-06-01', balanceCP: 20, balanceRTT: 9 }],
    };
    const balances = calculateMonthlyBalances(CALENDAR_2024, {}, settings);
    expect(balances[4]).toEqual({ balanceCP: 10, balanceRTT: 5 });
    expect(balances[5]).toEqual({ balanceCP: 22, balanceRTT: 10 });
  });

  test('usage before a checkpoint is wiped by the reset', () => {
    const settings: LeaveSettings = {
      accrualRateCP: 2,
      accrualRateRTT: 1,
      checkpoints: [{ dateStr: '2024-06-01', balanceCP: 20, balanceRTT: 9 }],
    };
    const balances = calculateMonthlyBalances(CALENDAR_2024, { '2024-01-02': CP }, settings);
    expect(balances[4]).toEqual({ balanceCP: 9, balanceRTT: 5 });
    expect(balances[5]).toEqual({ balanceCP: 22, balanceRTT: 10 });
  });

  test('a checkpoint on the last day of a month absorbs that month accrual', () => {
    const settings: LeaveSettings = {
      accrualRateCP: 2,
      accrualRateRTT: 1,
      checkpoints: [{ dateStr: '2024-08-31', balanceCP: 6.5, balanceRTT: 0.5 }],
    };
    const balances = calculateMonthlyBalances(CALENDAR_2024, {}, settings);
    expect(balances[7]).toEqual({ balanceCP: 6.5, balanceRTT: 0.5 });
    expect(balances[8]).toEqual({ balanceCP: 8.5, balanceRTT: 1.5 });
  });

  test('a checkpoint from a previous year seeds the opening balance', () => {
    const settings: LeaveSettings = {
      accrualRateCP: 2,
      accrualRateRTT: 1,
      checkpoints: [{ dateStr: '2023-08-01', balanceCP: 30, balanceRTT: 7 }],
    };
    const balances = calculateMonthlyBalances(CALENDAR_2024, {}, settings);
    expect(balances[0]).toEqual({ balanceCP: 32, balanceRTT: 8 });
  });

  test('an in-year checkpoint overrides a previous-year seed', () => {
    const settings: LeaveSettings = {
      accrualRateCP: 2,
      accrualRateRTT: 1,
      checkpoints: [
        { dateStr: '2023-08-01', balanceCP: 30, balanceRTT: 7 },
        { dateStr: '2024-01-01', balanceCP: 10, balanceRTT: 5 },
      ],
    };
    const balances = calculateMonthlyBalances(CALENDAR_2024, {}, settings);
    expect(balances[0]).toEqual({ balanceCP: 12, balanceRTT: 6 });
  });
});
