import { LeaveType } from '@core';
import { useEffect } from 'react';

const TOOL_KEYS: Record<string, LeaveType | null> = {
  Digit1: LeaveType.CP,
  Digit2: LeaveType.RTT,
  Digit3: LeaveType.UNPAID,
  Digit4: null,
  Numpad1: LeaveType.CP,
  Numpad2: LeaveType.RTT,
  Numpad3: LeaveType.UNPAID,
  Numpad4: null,
};

export const toolForKey = (code: string): LeaveType | null | undefined => {
  return TOOL_KEYS[code];
};

export const displayKeyForTool = (tool: LeaveType | null): string => {
  const code = Object.entries(TOOL_KEYS).find(([, value]) => value === tool)?.[0];
  return code?.replace(/^(Digit|Key)/, '') ?? '';
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
  onSelectTool: (tool: LeaveType | null) => void,
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
