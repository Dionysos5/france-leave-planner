import { describe, expect, test } from 'bun:test';
import { LeaveType } from '@core';
import { displayKeyForTool, toolForKey } from './useKeyboardShortcuts';

describe('toolForKey', () => {
  test('maps number keys to leave types', () => {
    expect(toolForKey('Digit1')).toBe(LeaveType.CP);
    expect(toolForKey('Digit2')).toBe(LeaveType.RTT);
    expect(toolForKey('Digit3')).toBe(LeaveType.UNPAID);
    expect(toolForKey('Digit4')).toBe(LeaveType.SICK);
  });

  test('5 selects the eraser', () => {
    expect(toolForKey('Digit5')).toBe(null);
  });

  test('numpad keys work too', () => {
    expect(toolForKey('Numpad1')).toBe(LeaveType.CP);
    expect(toolForKey('Numpad5')).toBe(null);
  });

  test('unknown keys are no-ops', () => {
    expect(toolForKey('KeyX')).toBeUndefined();
    expect(toolForKey('Enter')).toBeUndefined();
  });
});

describe('displayKeyForTool', () => {
  test('derives the display key from the same keymap', () => {
    expect(displayKeyForTool(LeaveType.CP)).toBe('1');
    expect(displayKeyForTool(LeaveType.RTT)).toBe('2');
    expect(displayKeyForTool(LeaveType.UNPAID)).toBe('3');
    expect(displayKeyForTool(LeaveType.SICK)).toBe('4');
    expect(displayKeyForTool(null)).toBe('5');
  });
});
