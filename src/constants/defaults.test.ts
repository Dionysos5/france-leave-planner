import { describe, expect, test } from 'bun:test';
import { DEFAULT_SETTINGS } from './defaults';

describe('DEFAULT_SETTINGS', () => {
  test('accrual rates derive from the legal yearly entitlements', () => {
    expect(DEFAULT_SETTINGS.accrualRateCP).toBeCloseTo(25 / 12, 10);
    expect(DEFAULT_SETTINGS.accrualRateRTT).toBeCloseTo(9 / 12, 10);
  });
});
