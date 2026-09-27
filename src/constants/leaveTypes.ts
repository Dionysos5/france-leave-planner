import { LeaveType } from '@core';
import type { Locale } from '@shared/types';

interface LeaveTypeDescriptor {
  /** Number key that selects the tool (top row or numpad). */
  shortcut: string;
  label: Record<Locale, string>;
  /** Label for narrow screens. */
  shortLabel: Record<Locale, string>;
  /** Classes for a painted day; the colors are defined in index.css. */
  cellClass: string;
  dotClass: string;
}

/** Everything the UI needs per leave type; adding a type means adding one entry here. */
export const LEAVE_TYPES: Record<LeaveType, LeaveTypeDescriptor> = {
  [LeaveType.CP]: {
    shortcut: '1',
    label: { en: 'Paid Leave (CP)', fr: 'Congés Payés (CP)' },
    shortLabel: { en: 'CP', fr: 'CP' },
    cellClass: 'bg-leave-cp text-white hover:bg-leave-cp-hover',
    dotClass: 'bg-leave-cp',
  },
  [LeaveType.RTT]: {
    shortcut: '2',
    label: { en: 'RTT', fr: 'RTT' },
    shortLabel: { en: 'RTT', fr: 'RTT' },
    cellClass: 'bg-leave-rtt text-white hover:bg-leave-rtt-hover',
    dotClass: 'bg-leave-rtt',
  },
  [LeaveType.UNPAID]: {
    shortcut: '3',
    label: { en: 'Unpaid Leave', fr: 'Sans solde' },
    shortLabel: { en: 'Unpaid', fr: 'Sans solde' },
    cellClass: 'bg-leave-unpaid text-white hover:bg-leave-unpaid-hover',
    dotClass: 'bg-leave-unpaid',
  },
  [LeaveType.SICK]: {
    shortcut: '4',
    label: { en: 'Sick Leave', fr: 'Arrêt maladie' },
    shortLabel: { en: 'Sick', fr: 'Maladie' },
    cellClass: 'bg-leave-sick text-white hover:bg-leave-sick-hover',
    dotClass: 'bg-leave-sick',
  },
};

export const ERASER_SHORTCUT = '5';
