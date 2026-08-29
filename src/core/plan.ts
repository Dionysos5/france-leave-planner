import type { LeaveType, Plan } from './types';

export const applyToggle = (plan: Plan, dateStr: string, tool: LeaveType | null): Plan => {
  const removes = tool === null || plan[dateStr] === tool;
  const next = { ...plan };
  if (removes) {
    delete next[dateStr];
  } else {
    next[dateStr] = tool;
  }
  return next;
};

export const applyRange = (plan: Plan, dates: string[], tool: LeaveType | null): Plan => {
  const next = { ...plan };
  for (const dateStr of dates) {
    if (tool === null) {
      delete next[dateStr];
    } else {
      next[dateStr] = tool;
    }
  }
  return next;
};
