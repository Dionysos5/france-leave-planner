import { LeaveType } from '@shared/types';

export const LEAVE_COLORS: Record<LeaveType, string> = {
  [LeaveType.CP]: 'bg-blue-500 text-white hover:bg-blue-600',
  [LeaveType.RTT]: 'bg-purple-500 text-white hover:bg-purple-600',
  [LeaveType.UNPAID]: 'bg-orange-500 text-white hover:bg-orange-600',
  [LeaveType.REMOTE]: 'bg-teal-500 text-white hover:bg-teal-600',
};

export const LEAVE_ACTIVE_CLASSES: Record<LeaveType, string> = {
  [LeaveType.CP]: 'bg-blue-50 border-blue-200 text-blue-700 ring-2 ring-blue-500 ring-offset-1',
  [LeaveType.RTT]:
    'bg-purple-50 border-purple-200 text-purple-700 ring-2 ring-purple-500 ring-offset-1',
  [LeaveType.UNPAID]:
    'bg-orange-50 border-orange-200 text-orange-700 ring-2 ring-orange-500 ring-offset-1',
  [LeaveType.REMOTE]: 'bg-teal-50 border-teal-200 text-teal-700 ring-2 ring-teal-500 ring-offset-1',
};

export const LEAVE_DOT_COLORS: Record<LeaveType, string | null> = {
  [LeaveType.CP]: 'bg-blue-500',
  [LeaveType.RTT]: 'bg-purple-500',
  [LeaveType.UNPAID]: 'bg-orange-500',
  [LeaveType.REMOTE]: null,
};
