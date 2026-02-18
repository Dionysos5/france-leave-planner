import type { LeaveType, Locale } from '@shared/types';

export interface Translations {
  appTitle: string;
  settingsTooltip: string;
  leaveLabels: Record<LeaveType, string>;
  eraser: string;
  showPast: string;
  hidePast: string;
  cpBalance: string;
  rttBalance: string;
  weekdays: { key: string; label: string }[];
  settings: {
    title: string;
    languageSection: string;
    cpSection: string;
    rttSection: string;
    janBalance: string;
    monthlyEarned: string;
    unpaidNote: string;
  };
}

export const TRANSLATIONS: Record<Locale, Translations> = {
  en: {
    appTitle: 'Leave Planner',
    settingsTooltip: 'Settings',
    leaveLabels: {
      CP: 'Paid Leave (CP)',
      RTT: 'RTT',
      UNPAID: 'Unpaid Leave',
      REMOTE: 'Remote',
    },
    eraser: 'Eraser',
    showPast: 'Show past months',
    hidePast: 'Hide past months',
    cpBalance: 'CP Balance',
    rttBalance: 'RTT Balance',
    weekdays: [
      { key: 'mon', label: 'M' },
      { key: 'tue', label: 'T' },
      { key: 'wed', label: 'W' },
      { key: 'thu', label: 'T' },
      { key: 'fri', label: 'F' },
      { key: 'sat', label: 'S' },
      { key: 'sun', label: 'S' },
    ],
    settings: {
      title: 'Configuration',
      languageSection: 'Language',
      cpSection: 'Paid Leave (CP)',
      rttSection: 'RTT',
      janBalance: 'Jan 1st Balance',
      monthlyEarned: 'Monthly Earned',
      unpaidNote:
        '* Unpaid leave reduces monthly acquisition proportionally based on the number of working days in that month.',
    },
  },
  fr: {
    appTitle: 'Planificateur de congés',
    settingsTooltip: 'Paramètres',
    leaveLabels: {
      CP: 'Congés Payés (CP)',
      RTT: 'RTT',
      UNPAID: 'Sans solde',
      REMOTE: 'Télétravail',
    },
    eraser: 'Gomme',
    showPast: 'Afficher les mois passés',
    hidePast: 'Masquer les mois passés',
    cpBalance: 'Solde CP',
    rttBalance: 'Solde RTT',
    weekdays: [
      { key: 'mon', label: 'L' },
      { key: 'tue', label: 'M' },
      { key: 'wed', label: 'M' },
      { key: 'thu', label: 'J' },
      { key: 'fri', label: 'V' },
      { key: 'sat', label: 'S' },
      { key: 'sun', label: 'D' },
    ],
    settings: {
      title: 'Configuration',
      languageSection: 'Langue',
      cpSection: 'Congés Payés (CP)',
      rttSection: 'RTT',
      janBalance: 'Solde au 1er jan.',
      monthlyEarned: 'Acquis par mois',
      unpaidNote:
        "* Les congés non payés réduisent l'acquisition mensuelle proportionnellement au nombre de jours ouvrés du mois.",
    },
  },
};
