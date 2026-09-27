import { useTranslation } from '@i18n/LocaleContext';
import { ChevronsDown, ChevronsUp } from 'lucide-react';

interface PastMonthsToggleProps {
  /** Months of the current year already over; 0 in other years. */
  pastCount: number;
  hidden: boolean;
  onToggle: () => void;
}

/** Sits where the past months are, so it says what it hides and how to get them back. */
export const PastMonthsToggle = ({ pastCount, hidden, onToggle }: PastMonthsToggleProps) => {
  const { translations } = useTranslation();
  if (pastCount === 0) return null;

  // Both states share one box so toggling doesn't move the calendar; only the colors change.
  const Icon = hidden ? ChevronsDown : ChevronsUp;
  return (
    <button
      type="button"
      aria-expanded={!hidden}
      onClick={onToggle}
      className={`mb-3 md:mb-4 flex w-full cursor-pointer items-center gap-2 rounded-lg border border-dashed px-4 py-2.5 text-xs font-bold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-slate-400 ${
        hidden
          ? 'border-slate-300 bg-white/60 text-slate-600 hover:border-slate-400 hover:bg-white'
          : 'border-transparent text-muted hover:border-slate-200 hover:text-slate-700'
      }`}
    >
      <Icon size={14} className="shrink-0 text-muted" aria-hidden />
      {hidden ? (
        <>
          {translations.pastHidden(pastCount)}
          <span aria-hidden className="text-slate-300">
            ·
          </span>
          <span className="text-slate-900 underline underline-offset-2">
            {translations.showPast}
          </span>
        </>
      ) : (
        translations.hidePast(pastCount)
      )}
    </button>
  );
};
