import { Tooltip } from '@components/ui/Tooltip';
import type { YearProjection } from '@core';
import { useTranslation } from '@i18n/LocaleContext';
import type { ComponentProps } from 'react';

interface BalanceCardProps extends ComponentProps<'div'> {
  label: string;
  value: number;
  warning: string | null;
}

const BalanceCard = ({ label, value, warning, ...rest }: BalanceCardProps) => (
  <div
    {...rest}
    className="relative bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm overflow-hidden"
  >
    <div className="flex items-center gap-2">
      <span className="text-[9px] font-bold text-muted uppercase tracking-widest">{label}</span>
      <span
        className={`text-xs font-extrabold tabular-nums ${value < 0 ? 'text-red-500' : 'text-slate-800'}`}
      >
        {value.toFixed(1)}
      </span>
    </div>
    {warning && <p className="text-[10px] font-bold text-amber-600">{warning}</p>}
    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-400 to-violet-500" />
  </div>
);

interface BalanceSummaryProps {
  year: number;
  projection: YearProjection;
}

/** Year-end CP and RTT balances, with a warning when days will be lost. */
const BalanceSummary = ({ year, projection }: BalanceSummaryProps) => {
  const { locale, translations } = useTranslation();
  const dateLocale = locale === 'fr' ? 'fr-FR' : 'en-GB';
  const endBalance = projection.months[11];
  const endMonthLabel = new Date(year, 11).toLocaleString(dateLocale, { month: 'short' });

  const lostWarning = (days: number, month: number, day: number) => {
    if (days <= 0) {
      return null;
    }
    const date = new Date(year, month, day).toLocaleString(dateLocale, {
      day: 'numeric',
      month: 'short',
    });
    return translations.lostOn(days.toFixed(1), date);
  };

  return (
    <>
      <Tooltip
        content={translations.cpBreakdown(
          endBalance.cpPrevious.toFixed(1),
          endBalance.cpCurrent.toFixed(1)
        )}
      >
        <BalanceCard
          label={`${translations.cpBalance} · ${endMonthLabel} ${year}`}
          value={endBalance.cpPrevious + endBalance.cpCurrent}
          warning={lostWarning(projection.cpLostOnMay31, 4, 31)}
        />
      </Tooltip>

      <BalanceCard
        label={`${translations.rttBalance} · ${endMonthLabel} ${year}`}
        value={endBalance.rtt}
        warning={lostWarning(projection.rttLostOnDec31, 11, 31)}
      />
    </>
  );
};

export default BalanceSummary;
