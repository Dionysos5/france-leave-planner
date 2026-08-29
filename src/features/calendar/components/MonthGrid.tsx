import { Tooltip } from '@components/ui/Tooltip';
import { LEAVE_COLORS } from '@constants';
import type { LeaveType, Plan } from '@core';
import {
  formatDate,
  getDatesInRange,
  getDayInfo,
  getMonthDays,
  isToday,
  isWorkableDay,
  type YearCalendar,
} from '@core';
import { useTranslation } from '@i18n/LocaleContext';
import type { MouseEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';

interface MonthGridProps {
  calendar: YearCalendar;
  month: number;
  plan: Plan;
  activeTool: LeaveType | null;
  onToggleDay: (dateStr: string) => void;
  onRangeUpdate: (dates: string[]) => void;
}

const MonthGrid = ({
  calendar,
  month,
  plan,
  activeTool,
  onToggleDay,
  onRangeUpdate,
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

  // Drag State
  const [selectionStart, setSelectionStart] = useState<string | null>(null);
  const [currentHover, setCurrentHover] = useState<string | null>(null);

  const isDragging = selectionStart !== null;

  // Calculate visual selection range
  const selectionRange = useMemo(() => {
    if (!selectionStart || !currentHover) return new Set<string>();
    return new Set(getDatesInRange(selectionStart, currentHover));
  }, [selectionStart, currentHover]);

  // Handle Drag End (Global mouse up to catch releases outside the grid)
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging && selectionStart && currentHover) {
        // Commit the selection
        const dates = getDatesInRange(selectionStart, currentHover);
        // Filter out invalid days (weekends/holidays) so we don't paint them
        const validDates = dates.filter((d) => isWorkableDay(calendar, d));

        if (validDates.length > 0) {
          if (validDates.length === 1 && selectionStart === currentHover) {
            // Single click behavior (Toggle)
            onToggleDay(validDates[0]);
          } else {
            // Drag behavior (Paint/Overwrite)
            onRangeUpdate(validDates);
          }
        }
      }
      // Reset state
      setSelectionStart(null);
      setCurrentHover(null);
    };

    const cancelDrag = () => {
      setSelectionStart(null);
      setCurrentHover(null);
    };

    if (isDragging) {
      window.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('mouseleave', cancelDrag);
      window.addEventListener('blur', cancelDrag);
    }
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('mouseleave', cancelDrag);
      window.removeEventListener('blur', cancelDrag);
    };
  }, [isDragging, selectionStart, currentHover, onToggleDay, onRangeUpdate, calendar]);

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
    if (selectionRange.has(dateStr) && !isWknd && !holiday) {
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
      setSelectionStart(dateStr);
      setCurrentHover(dateStr);
    };

    const handleMouseEnter = () => {
      if (isDragging) {
        setCurrentHover(dateStr);
      }
    };

    const cell = (
      <div
        key={d}
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
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
