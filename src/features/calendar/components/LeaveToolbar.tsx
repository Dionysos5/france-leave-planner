import { Button, IconButton } from '@components/ui/Button';
import { Kbd } from '@components/ui/Kbd';
import { LEAVE_DOT_COLORS } from '@constants';
import { LeaveType } from '@core';
import { displayKeyForTool } from '@hooks/useKeyboardShortcuts';
import { useTranslation } from '@i18n/LocaleContext';
import type { UIPreferences } from '@shared/types';
import { Eraser, Eye, EyeOff } from 'lucide-react';

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
  const { translations } = useTranslation();
  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-white/90 backdrop-blur-sm border border-slate-200 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] rounded-xl p-1.5 flex items-center gap-1">
        {Object.values(LeaveType).map((type) => (
          <Button
            key={type}
            variant={activeTool === type ? 'solid' : 'ghost'}
            aria-pressed={activeTool === type}
            onClick={() => setActiveTool(type)}
          >
            <span className={`w-2.5 h-2.5 rounded-sm ${LEAVE_DOT_COLORS[type]}`} />
            {translations.leaveLabels[type]}
            <Kbd tone={activeTool === type ? 'dark' : 'light'}>{displayKeyForTool(type)}</Kbd>
          </Button>
        ))}

        <div className="w-px h-5 bg-slate-200 mx-1" />

        <Button
          variant={activeTool === null ? 'solid' : 'ghost'}
          aria-pressed={activeTool === null}
          onClick={() => setActiveTool(null)}
        >
          <Eraser size={14} />
          {translations.eraser}
          <Kbd tone={activeTool === null ? 'dark' : 'light'}>{displayKeyForTool(null)}</Kbd>
        </Button>

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
