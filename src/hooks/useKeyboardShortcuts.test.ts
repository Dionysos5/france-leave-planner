import { describe, expect, test } from 'bun:test';
import { DayType } from '@core';
import { displayKeyForTool, toolForKey } from './useKeyboardShortcuts';

describe('toolForKey', () => {
  test('maps number keys to leave types', () => {
    expect(toolForKey('Digit1')).toBe(DayType.CP);
    expect(toolForKey('Digit2')).toBe(DayType.RTT);
    expect(toolForKey('Digit3')).toBe(DayType.UNPAID);
    expect(toolForKey('Digit4')).toBe(DayType.SICK);
  });

  test('5 selects the eraser', () => {
    expect(toolForKey('Digit5')).toBe(null);
  });

  test('6 selects work from home', () => {
    expect(toolForKey('Digit6')).toBe(DayType.WFH);
  });

  test('numpad keys work too', () => {
    expect(toolForKey('Numpad1')).toBe(DayType.CP);
    expect(toolForKey('Numpad5')).toBe(null);
  });

  test('unknown keys are no-ops', () => {
    expect(toolForKey('KeyX')).toBeUndefined();
    expect(toolForKey('Enter')).toBeUndefined();
  });
});

describe('displayKeyForTool', () => {
  test('derives the display key from the same keymap', () => {
    expect(displayKeyForTool(DayType.CP)).toBe('1');
    expect(displayKeyForTool(DayType.RTT)).toBe('2');
    expect(displayKeyForTool(DayType.UNPAID)).toBe('3');
    expect(displayKeyForTool(DayType.SICK)).toBe('4');
    expect(displayKeyForTool(null)).toBe('5');
  });
});

describe('shortcuts', () => {
  test('every tool has its own key', () => {
    const tools = [...Object.values(DayType), null];
    const keys = tools.map(displayKeyForTool);
    expect(new Set(keys).size).toBe(tools.length);
    for (const tool of tools) {
      expect(toolForKey(`Digit${displayKeyForTool(tool)}`)).toBe(tool);
    }
  });
});
