import { Tooltip } from '@components/ui/Tooltip';
import { LEAVE_COLORS } from '@constants';
import type { LeaveType, Plan } from '@core';
import { formatDate, getDayInfo, getMonthDays, isToday, type YearCalendar } from '@core';
import { useTranslation } from '@i18n/LocaleContext';
import type { MouseEvent } from 'react';

interface MonthGridProps {
  calendar: YearCalendar;
  month: number;
  plan: Plan;
  activeTool: LeaveType | null;
  selection: ReadonlySet<string>;
  onSelectionStart: (dateStr: string) => void;
  onSelectionExtend: (dateStr: string) => void;
}

const MonthGrid = ({
  calendar,
  month,
  plan,
  activeTool,
  selection,
  onSelectionStart,
  onSelectionExtend,
}: MonthGridProps) => {
  const { locale, translations } = useTranslation();
  const monthDays = getMonthDays(calendar, month);
  const firstWeekday = monthDays[0].getDay(); // 0 = Sun

  // Adjust for Monday start (France standard)
  const startOffset = firstWeekday === 0 ? 6 : firstWeekday - 1;

  const monthName = new Date(calendar.year, month).toLocaleString(
    locale === 'fr' ? 'fr-FR' : 'en-GB',
    {
      month: 'long',
    }
  );
  const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

  const days = [];

  for (let i = 0; i < startOffset; i++) {
    days.push(<div key={`empty-${i}`} className="day-cell" />);
  }

  for (const date of monthDays) {
    const d = date.getDate();
    const dateStr = formatDate(date);
    const info = getDayInfo(calendar, dateStr);
    const isWknd = info.kind === 'weekend';
    const holiday = info.holiday;
    const leaveType = plan[dateStr];
    const today = isToday(dateStr);

    let bgClass = 'bg-white hover:bg-slate-50';
    let textClass = 'text-slate-700';
    let cursorClass = 'cursor-pointer';
    let borderClass = 'border-slate-100';

    // Apply Styles
    if (leaveType) {
      bgClass = LEAVE_COLORS[leaveType];
      textClass = 'text-white font-bold';
      borderClass = 'border-transparent';
    } else if (holiday) {
      bgClass = 'bg-[#fff1f2]';
      textClass = 'text-[#be123c] font-bold';
      cursorClass = 'cursor-not-allowed';
    } else if (isWknd) {
      bgClass = 'bg-[#f8fafc]';
      textClass = 'text-muted';
      cursorClass = 'cursor-not-allowed';
    }

    // Apply Drag Preview Overrides
    if (selection.has(dateStr) && !isWknd && !holiday) {
      if (activeTool) {
        // Show active tool color
        bgClass = LEAVE_COLORS[activeTool];
        textClass = 'text-white font-bold';
      } else {
        // Eraser preview (white/cleared)
        bgClass = 'bg-slate-50 ring-2 ring-slate-300 z-10';
        textClass = 'text-muted';
      }
    }

    const handleMouseDown = (e: MouseEvent) => {
      // Only left click
      if (e.button !== 0) return;
      if (holiday || isWknd) return;

      e.preventDefault(); // Prevent text selection
      onSelectionStart(dateStr);
    };

    const cell = (
      <div
        key={d}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => onSelectionExtend(dateStr)}
        className={`
          day-cell flex flex-col items-center justify-center text-xs border rounded-sm transition-all duration-75 relative select-none
          ${bgClass} ${textClass} ${cursorClass} ${borderClass}
        `}
      >
        <span>{d}</span>
        {today && (
          <div className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white shadow-sm" />
        )}
      </div>
    );

    days.push(
      holiday ? (
        <Tooltip key={d} content={holiday.name[locale]}>
          {cell}
        </Tooltip>
      ) : (
        cell
      )
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest">
          {capitalizedMonth}
        </h2>
      </div>
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {translations.weekdays.map(({ key, label, name }) => (
          <div key={key} className="text-center text-[9px] font-bold text-muted">
            <span className="sr-only">{name}</span>
            <span aria-hidden="true">{label}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">{days}</div>
    </div>
  );
};

export default MonthGrid;
