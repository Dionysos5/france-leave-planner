import { describe, expect, test } from 'bun:test';
import { applyRange, applyToggle } from './plan';
import { LeaveType } from './types';

const { CP, RTT, UNPAID } = LeaveType;

describe('applyToggle', () => {
  test('adds a leave on an empty day', () => {
    expect(applyToggle({}, '2026-07-13', CP)).toEqual({ '2026-07-13': CP });
  });

  test('re-clicking the same tool removes the leave', () => {
    expect(applyToggle({ '2026-07-13': CP }, '2026-07-13', CP)).toEqual({});
  });

  test('re-clicking a different tool replaces the leave', () => {
    expect(applyToggle({ '2026-07-13': CP }, '2026-07-13', RTT)).toEqual({ '2026-07-13': RTT });
  });

  test('the eraser removes without touching other days', () => {
    const plan = { '2026-07-13': CP, '2026-07-14': RTT };
    expect(applyToggle(plan, '2026-07-13', null)).toEqual({ '2026-07-14': RTT });
  });

  test('the eraser on an empty day is a no-op', () => {
    expect(applyToggle({}, '2026-07-13', null)).toEqual({});
  });
});

describe('applyRange', () => {
  const dates = ['2026-08-03', '2026-08-04', '2026-08-05'];

  test('paints every date in the range and preserves unrelated days', () => {
    const plan = { '2026-01-05': UNPAID };
    expect(applyRange(plan, dates, CP)).toEqual({
      '2026-01-05': UNPAID,
      '2026-08-03': CP,
      '2026-08-04': CP,
      '2026-08-05': CP,
    });
  });

  test('painting overwrites existing types in the range', () => {
    const plan = { '2026-08-04': RTT };
    expect(applyRange(plan, dates, CP)).toEqual({
      '2026-08-03': CP,
      '2026-08-04': CP,
      '2026-08-05': CP,
    });
  });

  test('the eraser clears exactly the given dates', () => {
    const plan = { '2026-08-03': CP, '2026-08-04': RTT, '2026-08-05': CP };
    expect(applyRange(plan, [dates[0], dates[2]], null)).toEqual({ '2026-08-04': RTT });
  });
});
