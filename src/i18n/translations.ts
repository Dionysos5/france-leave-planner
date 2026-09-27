import type { Locale } from '@shared/types';

export interface Translations {
  appTitle: string;
  settingsTooltip: string;
  eraser: string;
  close: string;
  showPast: string;
  hidePast: (count: number) => string;
  pastHidden: (count: number) => string;
  cpBalance: string;
  rttToTake: (date: string) => string;
  rttNotCovered: (days: string) => string;
  cpBreakdown: (previous: string, current: string) => string;
  lostOn: (days: string, date: string) => string;
  firstRunHint: string;
  firstRunHintTouch: string;
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
    showPast: 'Show',
    hidePast: (count) => (count === 1 ? 'Hide last month' : `Hide the ${count} past months`),
    pastHidden: (count) => (count === 1 ? 'Last month hidden' : `${count} past months hidden`),
    cpBalance: 'CP Balance',
    rttToTake: (date) => `RTT to take by ${date}`,
    rttNotCovered: (days) => `${days} more than the year earns`,
    cpBreakdown: (previous, current) => `CP N-1: ${previous} · CP N: ${current}`,
    lostOn: (days, date) => `${days} lost ${date}`,
    firstRunHint: 'Click or drag days to paint your leave — 1–6 switch tools.',
    firstRunHintTouch: 'Tap a day to paint it, or long-press and drag to paint a range.',
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
        `RTT ${year}: ${rttDays} days, earned monthly (${(rttDays / 12).toFixed(2)} a month), lost if not taken by December 31.`,
        'Unpaid leave reduces the CP and RTT earned that month, in proportion.',
        "Sick leave still earns 80% of CP and doesn't reduce RTT.",
        'Work-from-home days are worked days: they never change a balance.',
      ],
    },
  },
  fr: {
    appTitle: 'Planificateur de congés',
    settingsTooltip: 'Paramètres',
    eraser: 'Gomme',
    close: 'Fermer',
    showPast: 'Afficher',
    hidePast: (count) =>
      count === 1 ? 'Masquer le mois passé' : `Masquer les ${count} mois passés`,
    pastHidden: (count) => (count === 1 ? 'Mois passé masqué' : `${count} mois passés masqués`),
    cpBalance: 'Solde CP',
    rttToTake: (date) => `RTT à poser d'ici le ${date}`,
    rttNotCovered: (days) => `${days} de plus que l'acquis de l'année`,
    cpBreakdown: (previous, current) => `CP N-1 : ${previous} · CP N : ${current}`,
    lostOn: (days, date) => `${days} perdus le ${date}`,
    firstRunHint:
      "Cliquez ou glissez sur les jours pour poser vos congés — 1 à 6 pour changer d'outil.",
    firstRunHintTouch:
      'Touchez un jour pour le poser, ou appuyez longuement puis glissez pour une période.',
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
        `RTT ${year} : ${rttDays} jours, acquis chaque mois (${(rttDays / 12).toFixed(2).replace('.', ',')} par mois), perdus s'ils ne sont pas pris au 31 décembre.`,
        'Le congé sans solde réduit au prorata les CP et RTT acquis dans le mois.',
        "L'arrêt maladie acquiert 80 % des CP et ne réduit pas les RTT.",
        'Les jours de télétravail sont des jours travaillés : ils ne modifient aucun solde.',
      ],
    },
  },
};
