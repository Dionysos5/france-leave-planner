import { DAY_TYPES, ERASER_SHORTCUT } from '@constants';
import type { DayType } from '@core';
import { useEffect } from 'react';

const SHORTCUTS: [string, DayType | null][] = [
  ...Object.entries(DAY_TYPES).map(
    ([type, { shortcut }]) => [shortcut, type as DayType] as [string, DayType]
  ),
  [ERASER_SHORTCUT, null],
];

// Physical key codes, so the shortcuts work on AZERTY keyboards without Shift.
const TOOL_KEYS: Record<string, DayType | null> = Object.fromEntries(
  SHORTCUTS.flatMap(([digit, tool]) => [
    [`Digit${digit}`, tool],
    [`Numpad${digit}`, tool],
  ])
);

export const toolForKey = (code: string): DayType | null | undefined => {
  return TOOL_KEYS[code];
};

export const displayKeyForTool = (tool: DayType | null): string => {
  return tool === null ? ERASER_SHORTCUT : DAY_TYPES[tool].shortcut;
};

const isTypingTarget = (target: EventTarget | null): boolean => {
  return (
    target instanceof HTMLElement &&
    (target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.tagName === 'SELECT' ||
      target.isContentEditable)
  );
};

export const useKeyboardShortcuts = (
  onSelectTool: (tool: DayType | null) => void,
  enabled: boolean
) => {
  useEffect(() => {
    if (!enabled) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }
      if (isTypingTarget(event.target)) {
        return;
      }
      const tool = toolForKey(event.code);
      if (tool === undefined) {
        return;
      }
      onSelectTool(tool);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSelectTool, enabled]);
};
