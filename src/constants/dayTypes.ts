import { DayType } from '@core';
import type { Locale } from '@shared/types';
import { House, type LucideIcon } from 'lucide-react';

interface DayTypeDescriptor {
  /** Number key that selects the tool (top row or numpad). */
  shortcut: string;
  label: Record<Locale, string>;
  /** Label for narrow screens, when it differs from `label`. */
  shortLabel?: Record<Locale, string>;
  /** Classes for a painted day: background, text and border. Colors are defined in index.css. */
  cellClass: string;
  /** Toolbar swatch: a colored dot, or an icon that is also drawn on painted days. */
  swatch: { dotClass: string } | { icon: LucideIcon; iconClass: string };
  /** Leave tools sit before the eraser in the toolbar, the others after it. */
  isLeave: boolean;
}

/** Everything the UI needs per day type; adding a type means adding one entry here. */
export const DAY_TYPES: Record<DayType, DayTypeDescriptor> = {
  [DayType.CP]: {
    shortcut: '1',
    label: { en: 'Paid Leave (CP)', fr: 'Congés Payés (CP)' },
    shortLabel: { en: 'CP', fr: 'CP' },
    cellClass: 'bg-leave-cp text-white border-transparent hover:bg-leave-cp-hover',
    swatch: { dotClass: 'bg-leave-cp' },
    isLeave: true,
  },
  [DayType.RTT]: {
    shortcut: '2',
    label: { en: 'RTT', fr: 'RTT' },
    shortLabel: { en: 'RTT', fr: 'RTT' },
    cellClass: 'bg-leave-rtt text-white border-transparent hover:bg-leave-rtt-hover',
    swatch: { dotClass: 'bg-leave-rtt' },
    isLeave: true,
  },
  [DayType.UNPAID]: {
    shortcut: '3',
    label: { en: 'Unpaid Leave', fr: 'Sans solde' },
    shortLabel: { en: 'Unpaid', fr: 'Sans solde' },
    cellClass: 'bg-leave-unpaid text-white border-transparent hover:bg-leave-unpaid-hover',
    swatch: { dotClass: 'bg-leave-unpaid' },
    isLeave: true,
  },
  [DayType.SICK]: {
    shortcut: '4',
    label: { en: 'Sick Leave', fr: 'Arrêt maladie' },
    shortLabel: { en: 'Sick', fr: 'Maladie' },
    cellClass: 'bg-leave-sick text-white border-transparent hover:bg-leave-sick-hover',
    swatch: { dotClass: 'bg-leave-sick' },
    isLeave: true,
  },
  // A worked day: marked on the calendar, ignored by the balances.
  [DayType.WFH]: {
    shortcut: '6',
    label: { en: 'Work from home', fr: 'Télétravail' },
    cellClass: 'bg-wfh-tint text-wfh-ink border-wfh-border hover:bg-wfh-tint-hover',
    swatch: { icon: House, iconClass: 'text-wfh-ink' },
    isLeave: false,
  },
};

export const ERASER_SHORTCUT = '5';
