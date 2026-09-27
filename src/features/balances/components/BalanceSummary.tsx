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
    <div className="flex items-center justify-between gap-2">
      <span className="min-w-0 text-[9px] font-bold text-muted uppercase tracking-widest">
        {label}
      </span>
      <span
        className={`shrink-0 text-xs font-extrabold tabular-nums ${value < 0 ? 'text-red-500' : 'text-slate-800'}`}
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

/**
 * Year-end CP balance, warning about CP N-1 lost on May 31, and the RTT left to take by
 * December 31. RTT may dip below zero mid-year as long as the year's accrual covers it.
 */
const BalanceSummary = ({ year, projection }: BalanceSummaryProps) => {
  const { locale, translations } = useTranslation();
  const dateLocale = locale === 'fr' ? 'fr-FR' : 'en-GB';
  const endBalance = projection.months[11];
  const endMonthLabel = new Date(year, 11).toLocaleString(dateLocale, { month: 'short' });

  const formatDay = (month: number, day: number) =>
    new Date(year, month, day).toLocaleString(dateLocale, { day: 'numeric', month: 'short' });

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
          warning={
            projection.cpLostOnMay31 > 0
              ? translations.lostOn(projection.cpLostOnMay31.toFixed(1), formatDay(4, 31))
              : null
          }
        />
      </Tooltip>

      <BalanceCard
        label={translations.rttToTake(formatDay(11, 31))}
        value={endBalance.rtt}
        warning={
          endBalance.rtt < 0 ? translations.rttNotCovered((-endBalance.rtt).toFixed(1)) : null
        }
      />
    </>
  );
};

export default BalanceSummary;
