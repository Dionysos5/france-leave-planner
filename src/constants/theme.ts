import { LeaveType } from '@core';

export const LEAVE_COLORS: Record<LeaveType, string> = {
  [LeaveType.CP]: 'bg-leave-cp text-white hover:bg-leave-cp-hover',
  [LeaveType.RTT]: 'bg-leave-rtt text-white hover:bg-leave-rtt-hover',
  [LeaveType.UNPAID]: 'bg-leave-unpaid text-white hover:bg-leave-unpaid-hover',
};

export const LEAVE_DOT_COLORS: Record<LeaveType, string> = {
  [LeaveType.CP]: 'bg-leave-cp',
  [LeaveType.RTT]: 'bg-leave-rtt',
  [LeaveType.UNPAID]: 'bg-leave-unpaid',
};
