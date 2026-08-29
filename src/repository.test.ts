import { describe, expect, test } from 'bun:test';
import { DEFAULT_SETTINGS, DEFAULT_UI_PREFS } from '@constants';
import { createRepository } from './repository';

const storageWith = (value: string | null) => ({
  getItem: (_key: string) => value,
  setItem: (_key: string, _value: string) => {},
});

describe('createRepository', () => {
  test('missing data yields defaults', () => {
    expect(createRepository(storageWith(null)).load()).toEqual({
      plan: {},
      settings: DEFAULT_SETTINGS,
      uiPreferences: DEFAULT_UI_PREFS,
    });
  });

  test('v2 settings migrate into a checkpoint when balances are non-zero', () => {
    const blob = JSON.stringify({
      version: 2,
      leaves: { '2026-07-14': 'CP' },
      settings: { initialCP: 12.5, accrualRateCP: 2.08, initialRTT: 4, accrualRateRTT: 0.75 },
      uiPreferences: { hidePastMonths: false },
    });
    const state = createRepository(storageWith(blob)).load();
    expect(state.plan).toEqual({ '2026-07-14': 'CP' });
    expect(state.settings).toEqual({
      accrualRateCP: 2.08,
      accrualRateRTT: 0.75,
      checkpoints: [{ dateStr: '2026-01-01', balanceCP: 12.5, balanceRTT: 4 }],
    });
  });

  test('v2 default balances migrate to no checkpoints', () => {
    const blob = JSON.stringify({
      version: 2,
      leaves: {},
      settings: { initialCP: 0, accrualRateCP: 2.08, initialRTT: 0, accrualRateRTT: 0.75 },
      uiPreferences: { hidePastMonths: true },
    });
    const state = createRepository(storageWith(blob)).load();
    expect(state.settings.checkpoints).toEqual([]);
    expect(state.uiPreferences).toEqual({ hidePastMonths: true });
  });

  test('v1 leaves array migrates through to v3', () => {
    const blob = JSON.stringify({
      version: 1,
      leaves: [
        { dateStr: '2026-07-14', type: 'CP' },
        { dateStr: '2026-07-15', type: 'CP' },
        { dateStr: 'garbage', type: 'CP' },
      ],
      settings: { initialCP: 0, accrualRateCP: 2.08, initialRTT: 0, accrualRateRTT: 0.75 },
      uiPreferences: { hidePastMonths: false },
    });
    const state = createRepository(storageWith(blob)).load();
    expect(state.plan).toEqual({ '2026-07-14': 'CP', '2026-07-15': 'CP' });
  });

  test('v3 state loads as-is with invalid checkpoints dropped', () => {
    const blob = JSON.stringify({
      version: 3,
      leaves: {},
      settings: {
        accrualRateCP: 2,
        accrualRateRTT: 1,
        checkpoints: [
          { dateStr: '2026-08-01', balanceCP: 10, balanceRTT: 3 },
          { dateStr: 'not-a-date', balanceCP: 5, balanceRTT: 0 },
        ],
      },
      uiPreferences: { hidePastMonths: false },
    });
    const state = createRepository(storageWith(blob)).load();
    expect(state.settings.checkpoints).toEqual([
      { dateStr: '2026-08-01', balanceCP: 10, balanceRTT: 3 },
    ]);
  });

  test('malformed JSON yields defaults', () => {
    expect(createRepository(storageWith('{not json')).load()).toEqual({
      plan: {},
      settings: DEFAULT_SETTINGS,
      uiPreferences: DEFAULT_UI_PREFS,
    });
  });

  test('save writes a versioned v3 blob', () => {
    const captured: { value: string | null } = { value: null };
    const storage = {
      getItem: () => null,
      setItem: (_key: string, value: string) => {
        captured.value = value;
      },
    };
    createRepository(storage).save({
      plan: { '2026-07-14': 'RTT' },
      settings: DEFAULT_SETTINGS,
      uiPreferences: DEFAULT_UI_PREFS,
    });
    expect(JSON.parse(captured.value ?? '')).toEqual({
      version: 3,
      leaves: { '2026-07-14': 'RTT' },
      settings: DEFAULT_SETTINGS,
      uiPreferences: DEFAULT_UI_PREFS,
    });
  });
});
