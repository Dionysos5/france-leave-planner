import { Button, IconButton } from '@components/ui/Button';
import { Kbd } from '@components/ui/Kbd';
import { LEAVE_TYPES } from '@constants';
import { LeaveType } from '@core';
import { displayKeyForTool } from '@hooks/useKeyboardShortcuts';
import { useTranslation } from '@i18n/LocaleContext';
import type { UIPreferences } from '@shared/types';
import { Eraser, Eye, EyeOff } from 'lucide-react';

const LEAVE_TOOLS = Object.values(LeaveType).filter((type) => LEAVE_TYPES[type].isLeave);
const OTHER_TOOLS = Object.values(LeaveType).filter((type) => !LEAVE_TYPES[type].isLeave);

interface LeaveToolbarProps {
  activeTool: LeaveType | null;
  setActiveTool: (tool: LeaveType | null) => void;
  uiPreferences: UIPreferences;
  setUiPreferences: (prefs: UIPreferences) => void;
}

const LeaveToolbar = ({
  activeTool,
  setActiveTool,
  uiPreferences,
  setUiPreferences,
}: LeaveToolbarProps) => {
  const { locale, translations } = useTranslation();

  const toolButton = (type: LeaveType) => {
    const { swatch, label, shortLabel } = LEAVE_TYPES[type];
    const active = activeTool === type;
    return (
      <Button
        key={type}
        variant={active ? 'solid' : 'ghost'}
        aria-pressed={active}
        aria-label={shortLabel ? undefined : label[locale]}
        onClick={() => setActiveTool(type)}
      >
        {'icon' in swatch ? (
          <swatch.icon size={14} aria-hidden />
        ) : (
          <span className={`w-2.5 h-2.5 rounded-sm ${swatch.dotClass}`} />
        )}
        {shortLabel && <span className="sm:hidden">{shortLabel[locale]}</span>}
        <span className="hidden sm:inline">{label[locale]}</span>
        <span className="hidden sm:contents">
          <Kbd tone={active ? 'dark' : 'light'}>{displayKeyForTool(type)}</Kbd>
        </span>
      </Button>
    );
  };

  return (
    <div className="fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] md:bottom-10 z-50 flex justify-center pointer-events-none">
      <div className="pointer-events-auto max-w-full overflow-x-auto bg-white/90 backdrop-blur-sm border border-slate-200 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] rounded-xl p-1 sm:p-1.5 flex items-center gap-0.5 sm:gap-1">
        {LEAVE_TOOLS.map(toolButton)}

        <div className="w-px h-5 bg-slate-200 mx-1" />

        <Button
          variant={activeTool === null ? 'solid' : 'ghost'}
          aria-pressed={activeTool === null}
          onClick={() => setActiveTool(null)}
          aria-label={translations.eraser}
        >
          <Eraser size={14} />
          <span className="hidden sm:contents">
            {translations.eraser}
            <Kbd tone={activeTool === null ? 'dark' : 'light'}>{displayKeyForTool(null)}</Kbd>
          </span>
        </Button>

        <div className="w-px h-5 bg-slate-200 mx-1" />

        {OTHER_TOOLS.map(toolButton)}

        <div className="w-px h-5 bg-slate-200 mx-1" />

        <IconButton
          label={uiPreferences.hidePastMonths ? translations.showPast : translations.hidePast}
          pressed={uiPreferences.hidePastMonths}
          variant={uiPreferences.hidePastMonths ? 'solid' : 'ghost'}
          onClick={() =>
            setUiPreferences({
              ...uiPreferences,
              hidePastMonths: !uiPreferences.hidePastMonths,
            })
          }
        >
          {uiPreferences.hidePastMonths ? <Eye size={14} /> : <EyeOff size={14} />}
        </IconButton>
      </div>
    </div>
  );
};

export default LeaveToolbar;
