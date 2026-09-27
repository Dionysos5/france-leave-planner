import type { Locale } from '@shared/types';

export interface Translations {
  appTitle: string;
  settingsTooltip: string;
  eraser: string;
  close: string;
  showPast: string;
  hidePast: string;
  cpBalance: string;
  rttBalance: string;
  cpBreakdown: (previous: string, current: string) => string;
  lostOn: (days: string, date: string) => string;
  firstRunHint: string;
  previousYear: string;
  nextYear: string;
  weekdays: { key: string; label: string; name: string }[];
  settings: {
    title: string;
    languageSection: string;
    balancesSection: string;
    asOf: string;
    checkpointHint: string;
    addCheckpoint: string;
    removeCheckpoint: string;
    cpPrevious: string;
    cpCurrent: string;
    rtt: string;
    rulesSection: string;
    rules: (year: number, rttDays: number) => string[];
  };
}

export const TRANSLATIONS: Record<Locale, Translations> = {
  en: {
    appTitle: 'Leave Planner',
    settingsTooltip: 'Settings',
    eraser: 'Eraser',
    close: 'Close',
    showPast: 'Show past months',
    hidePast: 'Hide past months',
    cpBalance: 'CP Balance',
    rttBalance: 'RTT Balance',
    cpBreakdown: (previous, current) => `CP N-1: ${previous} · CP N: ${current}`,
    lostOn: (days, date) => `${days} lost ${date}`,
    firstRunHint: 'Click or drag days to paint your leave — 1–5 switch tools.',
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
      checkpointHint: 'Copy the balances from your latest payslip.',
      addCheckpoint: 'Add a known balance',
      removeCheckpoint: 'Remove',
      cpPrevious: 'CP N-1',
      cpCurrent: 'CP N',
      rtt: 'RTT',
      rulesSection: 'Rules applied',
      rules: (year, rttDays) => [
        'Syntec agreement, cadre au forfait jours (218 days), France métropolitaine.',
        'CP: 25 working days a year, earned June 1 – May 31. CP N-1 not taken by May 31 is lost.',
        `RTT ${year}: ${rttDays} days, granted January 1, lost if not taken by December 31.`,
        'Unpaid leave reduces the CP earned that month and the RTT, in proportion.',
        "Sick leave still earns 80% of CP and doesn't reduce RTT.",
      ],
    },
  },
  fr: {
    appTitle: 'Planificateur de congés',
    settingsTooltip: 'Paramètres',
    eraser: 'Gomme',
    close: 'Fermer',
    showPast: 'Afficher les mois passés',
    hidePast: 'Masquer les mois passés',
    cpBalance: 'Solde CP',
    rttBalance: 'Solde RTT',
    cpBreakdown: (previous, current) => `CP N-1 : ${previous} · CP N : ${current}`,
    lostOn: (days, date) => `${days} perdus le ${date}`,
    firstRunHint:
      "Cliquez ou glissez sur les jours pour poser vos congés — 1 à 5 pour changer d'outil.",
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
      checkpointHint: 'Recopiez les soldes de votre dernier bulletin de paie.',
      addCheckpoint: 'Ajouter un solde connu',
      removeCheckpoint: 'Supprimer',
      cpPrevious: 'CP N-1',
      cpCurrent: 'CP N',
      rtt: 'RTT',
      rulesSection: 'Règles appliquées',
      rules: (year, rttDays) => [
        'Convention Syntec, cadre au forfait jours (218 jours), France métropolitaine.',
        'CP : 25 jours ouvrés par an, acquis du 1er juin au 31 mai. Les CP N-1 non pris au 31 mai sont perdus.',
        `RTT ${year} : ${rttDays} jours, crédités au 1er janvier, perdus s'ils ne sont pas pris au 31 décembre.`,
        'Le congé sans solde réduit au prorata les CP acquis dans le mois et les RTT.',
        "L'arrêt maladie acquiert 80 % des CP et ne réduit pas les RTT.",
      ],
    },
  },
};
