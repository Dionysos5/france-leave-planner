import { describe, expect, test } from 'bun:test';
import { buildYearCalendar } from './calendar';
import { applyRange, applyToggle, resolveSelection } from './plan';
import { DayType } from './types';

const { CP, RTT, UNPAID, SICK, WFH } = DayType;
const DAY = '2026-07-13';

describe('applyToggle', () => {
  test('adds a full day on an empty day', () => {
    expect(applyToggle({}, DAY, CP)).toEqual({ [DAY]: CP });
  });

  test('a half-day tool cycles full day → morning → afternoon → free', () => {
    let plan = applyToggle({}, DAY, RTT);
    expect(plan).toEqual({ [DAY]: RTT });
    plan = applyToggle(plan, DAY, RTT);
    expect(plan).toEqual({ [DAY]: { am: RTT } });
    plan = applyToggle(plan, DAY, RTT);
    expect(plan).toEqual({ [DAY]: { pm: RTT } });
    plan = applyToggle(plan, DAY, RTT);
    expect(plan).toEqual({});
  });

  test('next to another type, a half-day tool fills the free half', () => {
    expect(applyToggle({ [DAY]: { am: CP } }, DAY, WFH)).toEqual({ [DAY]: { am: CP, pm: WFH } });
    expect(applyToggle({ [DAY]: { pm: CP } }, DAY, WFH)).toEqual({ [DAY]: { am: WFH, pm: CP } });
  });

  test('on a mixed day, the tool frees its own half', () => {
    expect(applyToggle({ [DAY]: { am: CP, pm: WFH } }, DAY, WFH)).toEqual({ [DAY]: { am: CP } });
    expect(applyToggle({ [DAY]: { am: CP, pm: WFH } }, DAY, CP)).toEqual({ [DAY]: { pm: WFH } });
  });

  test('a half-day tool replaces a full day or a mix of other types', () => {
    expect(applyToggle({ [DAY]: CP }, DAY, RTT)).toEqual({ [DAY]: RTT });
    expect(applyToggle({ [DAY]: SICK }, DAY, WFH)).toEqual({ [DAY]: WFH });
    expect(applyToggle({ [DAY]: { am: CP, pm: WFH } }, DAY, RTT)).toEqual({ [DAY]: RTT });
  });

  test('whole-day types toggle the full day', () => {
    expect(applyToggle({}, DAY, UNPAID)).toEqual({ [DAY]: UNPAID });
    expect(applyToggle({ [DAY]: UNPAID }, DAY, UNPAID)).toEqual({});
    expect(applyToggle({ [DAY]: { am: CP, pm: WFH } }, DAY, SICK)).toEqual({ [DAY]: SICK });
  });

  test('the eraser clears a split day', () => {
    expect(applyToggle({ [DAY]: { am: CP, pm: WFH } }, DAY, null)).toEqual({});
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

describe('resolveSelection', () => {
  const calendar = buildYearCalendar(2026, [
    { dateStr: '2026-10-01', name: { en: 'Test holiday', fr: 'Férié de test' } },
  ]);

  test('a click on a workable day toggles it', () => {
    expect(resolveSelection(calendar, '2026-09-28', '2026-09-28')).toEqual({
      kind: 'toggle',
      dateStr: '2026-09-28',
    });
  });

  test('a drag across months paints every workable day in between', () => {
    expect(resolveSelection(calendar, '2026-09-28', '2026-10-05')).toEqual({
      kind: 'range',
      dates: ['2026-09-28', '2026-09-29', '2026-09-30', '2026-10-02', '2026-10-05'],
    });
  });

  test('dragging backwards gives the same range', () => {
    expect(resolveSelection(calendar, '2026-09-30', '2026-09-28')).toEqual({
      kind: 'range',
      dates: ['2026-09-28', '2026-09-29', '2026-09-30'],
    });
  });

  test('a drag over weekends only does nothing', () => {
    expect(resolveSelection(calendar, '2026-10-03', '2026-10-04')).toBeNull();
  });
});
