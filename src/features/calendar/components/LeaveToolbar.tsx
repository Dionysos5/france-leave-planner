import { LEAVE_DOT_COLORS } from '@constants';
import { useTranslation } from '@i18n/LocaleContext';
import { LeaveType, type UIPreferences } from '@shared/types';
import { Eraser, Eye, EyeOff, Laptop } from 'lucide-react';

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
        {Object.values(LeaveType).map((type) => {
          const dotColor = LEAVE_DOT_COLORS[type];
          const isActive = activeTool === type;
          return (
            <button
              type="button"
              key={type}
              onClick={() => setActiveTool(type)}
              className={`rounded-md px-3.5 py-2 text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap
                ${isActive ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}
              `}
            >
              {dotColor ? (
                <div className={`w-2.5 h-2.5 rounded-sm ${dotColor}`} />
              ) : (
                <Laptop size={14} />
              )}
              {translations.leaveLabels[type]}
            </button>
          );
        })}

        <div className="w-px h-5 bg-slate-200 mx-1" />

        <button
          type="button"
          onClick={() => setActiveTool(null)}
          className={`rounded-md px-3.5 py-2 text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap
            ${activeTool === null ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}
          `}
        >
          <Eraser size={14} />
          {translations.eraser}
        </button>

        <div className="w-px h-5 bg-slate-200 mx-1" />

        <button
          type="button"
          onClick={() =>
            setUiPreferences({
              ...uiPreferences,
              hidePastMonths: !uiPreferences.hidePastMonths,
            })
          }
          className={`rounded-md p-2 transition-all
            ${uiPreferences.hidePastMonths ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}
          `}
          title={uiPreferences.hidePastMonths ? translations.showPast : translations.hidePast}
        >
          {uiPreferences.hidePastMonths ? <Eye size={14} /> : <EyeOff size={14} />}
        </button>
      </div>
    </div>
  );
};

export default LeaveToolbar;
