import type { LeaveType } from '@core';
import type { Locale } from '@shared/types';

export interface Translations {
  appTitle: string;
  settingsTooltip: string;
  leaveLabels: Record<LeaveType, string>;
  eraser: string;
  close: string;
  showPast: string;
  hidePast: string;
  cpBalance: string;
  rttBalance: string;
  firstRunHint: string;
  previousYear: string;
  nextYear: string;
  weekdays: { key: string; label: string; name: string }[];
  settings: {
    title: string;
    languageSection: string;
    balancesSection: string;
    asOf: string;
    addCheckpoint: string;
    removeCheckpoint: string;
    cpSection: string;
    rttSection: string;
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
    },
    eraser: 'Eraser',
    close: 'Close',
    showPast: 'Show past months',
    hidePast: 'Hide past months',
    cpBalance: 'CP Balance',
    rttBalance: 'RTT Balance',
    firstRunHint: 'Click or drag days to paint your leave — 1–4 switch tools.',
    previousYear: 'Previous year',
    nextYear: 'Next year',
    weekdays: [
      { key: 'mon', label: 'M', name: 'Monday' },
      { key: 'tue', label: 'T', name: 'Tuesday' },
      { key: 'wed', label: 'W', name: 'Wednesday' },
      { key: 'thu', label: 'T', name: 'Thursday' },
      { key: 'fri', label: 'F', name: 'Friday' },
      { key: 'sat', label: 'S', name: 'Saturday' },
      { key: 'sun', label: 'S', name: 'Sunday' },
    ],
    settings: {
      title: 'Configuration',
      languageSection: 'Language',
      balancesSection: 'Balance checkpoints',
      asOf: 'As of',
      addCheckpoint: 'Add a known balance',
      removeCheckpoint: 'Remove',
      cpSection: 'Paid Leave (CP)',
      rttSection: 'RTT',
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
    },
    eraser: 'Gomme',
    close: 'Fermer',
    showPast: 'Afficher les mois passés',
    hidePast: 'Masquer les mois passés',
    cpBalance: 'Solde CP',
    rttBalance: 'Solde RTT',
    firstRunHint:
      "Cliquez ou glissez sur les jours pour poser vos congés — 1 à 4 pour changer d'outil.",
    previousYear: 'Année précédente',
    nextYear: 'Année suivante',
    weekdays: [
      { key: 'mon', label: 'L', name: 'Lundi' },
      { key: 'tue', label: 'M', name: 'Mardi' },
      { key: 'wed', label: 'M', name: 'Mercredi' },
      { key: 'thu', label: 'J', name: 'Jeudi' },
      { key: 'fri', label: 'V', name: 'Vendredi' },
      { key: 'sat', label: 'S', name: 'Samedi' },
      { key: 'sun', label: 'D', name: 'Dimanche' },
    ],
    settings: {
      title: 'Configuration',
      languageSection: 'Langue',
      balancesSection: 'Soldes de référence',
      asOf: 'Au',
      addCheckpoint: 'Ajouter un solde connu',
      removeCheckpoint: 'Supprimer',
      cpSection: 'Congés Payés (CP)',
      rttSection: 'RTT',
      monthlyEarned: 'Acquis par mois',
      unpaidNote:
        "* Les congés non payés réduisent l'acquisition mensuelle proportionnellement au nombre de jours ouvrés du mois.",
    },
  },
};
