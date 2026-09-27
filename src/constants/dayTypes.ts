import { DayType } from '@core';
import type { Locale } from '@shared/types';
import { House, type LucideIcon } from 'lucide-react';

interface DayTypeDescriptor {
  /** Number key that selects the tool (top row or numpad). */
  shortcut: string;
  /** Full name, shown in the toolbar tooltip. */
  label: Record<Locale, string>;
  /** Name on the toolbar button. */
  shortLabel: Record<Locale, string>;
  /** Classes for a painted day: background, text and border. Colors are defined in index.css. */
  cellClass: string;
  /** Toolbar button while this tool is selected: it takes the color it paints. */
  activeClass: string;
  /** Small square on the toolbar button showing the day's color. */
  swatchClass: string;
  /** Drawn on painted days and inside the swatch. */
  icon?: LucideIcon;
}

/** Everything the UI needs per day type; adding a type means adding one entry here. */
export const DAY_TYPES: Record<DayType, DayTypeDescriptor> = {
  [DayType.CP]: {
    shortcut: '1',
    label: { en: 'Paid Leave (CP)', fr: 'Congés Payés (CP)' },
    shortLabel: { en: 'CP', fr: 'CP' },
    cellClass: 'bg-leave-cp text-white border-transparent hover:bg-leave-cp-hover',
    activeClass: 'bg-leave-cp text-white hover:bg-leave-cp-hover',
    swatchClass: 'bg-leave-cp',
  },
  [DayType.RTT]: {
    shortcut: '2',
    label: { en: 'RTT', fr: 'RTT' },
    shortLabel: { en: 'RTT', fr: 'RTT' },
    cellClass: 'bg-leave-rtt text-white border-transparent hover:bg-leave-rtt-hover',
    activeClass: 'bg-leave-rtt text-white hover:bg-leave-rtt-hover',
    swatchClass: 'bg-leave-rtt',
  },
  [DayType.UNPAID]: {
    shortcut: '3',
    label: { en: 'Unpaid Leave', fr: 'Congé sans solde' },
    shortLabel: { en: 'Unpaid', fr: 'Sans solde' },
    cellClass: 'bg-leave-unpaid text-white border-transparent hover:bg-leave-unpaid-hover',
    activeClass: 'bg-leave-unpaid text-white hover:bg-leave-unpaid-hover',
    swatchClass: 'bg-leave-unpaid',
  },
  [DayType.SICK]: {
    shortcut: '4',
    label: { en: 'Sick Leave', fr: 'Arrêt maladie' },
    shortLabel: { en: 'Sick', fr: 'Maladie' },
    cellClass: 'bg-leave-sick text-white border-transparent hover:bg-leave-sick-hover',
    activeClass: 'bg-leave-sick text-white hover:bg-leave-sick-hover',
    swatchClass: 'bg-leave-sick',
  },
  // A worked day: marked on the calendar, ignored by the balances.
  [DayType.WFH]: {
    shortcut: '5',
    label: { en: 'Work from home', fr: 'Télétravail' },
    shortLabel: { en: 'WFH', fr: 'Télétravail' },
    cellClass: 'bg-wfh-tint text-wfh-ink border-wfh-border hover:bg-wfh-tint-hover',
    activeClass:
      'bg-wfh-tint text-wfh-ink ring-1 ring-inset ring-wfh-border hover:bg-wfh-tint-hover',
    swatchClass: 'bg-wfh-tint text-wfh-ink ring-1 ring-inset ring-wfh-border',
    icon: House,
  },
};

export const ERASER_SHORTCUT = '6';
