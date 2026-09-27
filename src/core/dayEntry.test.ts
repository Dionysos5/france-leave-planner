import { describe, expect, test } from 'bun:test';
import { entryOf, halvesOf, isHalfDayType } from './dayEntry';
import { DayType } from './types';

const { CP, RTT, UNPAID, SICK, WFH } = DayType;

describe('halvesOf', () => {
  test('an empty day has two free halves', () => {
    expect(halvesOf(undefined)).toEqual({ am: null, pm: null });
  });

  test('a full day fills both halves', () => {
    expect(halvesOf(CP)).toEqual({ am: CP, pm: CP });
  });

  test('a split day keeps each half', () => {
    expect(halvesOf({ pm: RTT })).toEqual({ am: null, pm: RTT });
    expect(halvesOf({ am: CP, pm: WFH })).toEqual({ am: CP, pm: WFH });
  });
});

describe('entryOf', () => {
  test('two free halves are no entry', () => {
    expect(entryOf({ am: null, pm: null })).toBeUndefined();
  });

  test('matching halves collapse into a full day', () => {
    expect(entryOf({ am: RTT, pm: RTT })).toBe(RTT);
  });

  test('different halves stay split, free halves omitted', () => {
    expect(entryOf({ am: CP, pm: null })).toEqual({ am: CP });
    expect(entryOf({ am: CP, pm: WFH })).toEqual({ am: CP, pm: WFH });
  });
});

describe('isHalfDayType', () => {
  test('CP, RTT and WFH can be half days; sick and unpaid cannot', () => {
    expect([CP, RTT, WFH].every(isHalfDayType)).toBe(true);
    expect([SICK, UNPAID].some(isHalfDayType)).toBe(false);
  });
});
