import { Button } from '@components/ui/Button';
import { Kbd } from '@components/ui/Kbd';
import { Tooltip } from '@components/ui/Tooltip';
import { DAY_TYPES } from '@constants';
import { DayType } from '@core';
import { displayKeyForTool } from '@hooks/useKeyboardShortcuts';
import { useTranslation } from '@i18n/LocaleContext';
import { Eraser, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

const ERASER_ACTIVE_CLASS = 'bg-slate-200 text-slate-900 hover:bg-slate-300';

interface LeaveToolbarProps {
  activeTool: DayType | null;
  setActiveTool: (tool: DayType | null) => void;
}

/** A small square in the day's color; on a selected button it gets a white outline. */
const Swatch = ({
  className,
  icon: Icon,
  onColor,
}: {
  className: string;
  icon?: LucideIcon;
  onColor: boolean;
}) => (
  <span
    className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[4px] ${className} ${onColor ? 'ring-1 ring-inset ring-white/80' : ''}`}
  >
    {Icon && <Icon size={9} strokeWidth={2.5} aria-hidden />}
  </span>
);

const LeaveToolbar = ({ activeTool, setActiveTool }: LeaveToolbarProps) => {
  const { locale, translations } = useTranslation();

  // The selected tool takes the color it paints. Phones only have room for its label.
  const toolButton = (
    tool: DayType | null,
    swatch: ReactNode,
    label: string,
    shortLabel: string,
    activeClass: string
  ) => {
    const active = activeTool === tool;
    return (
      <Tooltip
        key={tool ?? 'eraser'}
        content={
          <span className="flex items-center gap-1.5">
            {label}
            <Kbd tone="dark">{displayKeyForTool(tool)}</Kbd>
          </span>
        }
      >
        <Button
          variant={active ? 'plain' : 'ghost'}
          aria-pressed={active}
          aria-label={label}
          className={`shrink-0 ${active ? activeClass : ''}`}
          onClick={() => setActiveTool(tool)}
        >
          {swatch}
          <span className={active ? undefined : 'hidden sm:inline'}>{shortLabel}</span>
        </Button>
      </Tooltip>
    );
  };

  return (
    <div className="fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] md:bottom-8 z-50 flex justify-center pointer-events-none">
      <div className="pointer-events-auto max-w-full overflow-x-auto bg-white border border-slate-200 shadow-[0_8px_24px_-8px_rgba(15,23,42,0.25)] rounded-2xl p-1 sm:p-1.5 flex items-center gap-0.5 sm:gap-1">
        {Object.values(DayType).map((type) => {
          const { label, shortLabel, activeClass, swatchClass, icon } = DAY_TYPES[type];
          return toolButton(
            type,
            <Swatch className={swatchClass} icon={icon} onColor={activeTool === type && !icon} />,
            label[locale],
            shortLabel[locale],
            activeClass
          );
        })}

        <div className="w-px h-5 shrink-0 bg-slate-200 mx-0.5" />

        {toolButton(
          null,
          <Eraser size={14} aria-hidden />,
          translations.eraser,
          translations.eraser,
          ERASER_ACTIVE_CLASS
        )}
      </div>
    </div>
  );
};

export default LeaveToolbar;
