import { Button } from '@components/ui/Button';
import { Kbd } from '@components/ui/Kbd';
import { DAY_TYPES } from '@constants';
import { DayType } from '@core';
import { displayKeyForTool } from '@hooks/useKeyboardShortcuts';
import { useTranslation } from '@i18n/LocaleContext';
import type { UIPreferences } from '@shared/types';
import { Eraser } from 'lucide-react';
import type { ReactNode } from 'react';
import { HidePastToggle } from './HidePastToggle';

const LEAVE_TOOLS = Object.values(DayType).filter((type) => DAY_TYPES[type].isLeave);
const OTHER_TOOLS = Object.values(DayType).filter((type) => !DAY_TYPES[type].isLeave);

interface LeaveToolbarProps {
  activeTool: DayType | null;
  setActiveTool: (tool: DayType | null) => void;
  uiPreferences: UIPreferences;
  setUiPreferences: (prefs: UIPreferences) => void;
}

const Divider = () => <div className="w-px h-5 shrink-0 bg-slate-200 mx-0.5 sm:mx-1" />;

const LeaveToolbar = ({
  activeTool,
  setActiveTool,
  uiPreferences,
  setUiPreferences,
}: LeaveToolbarProps) => {
  const { locale, translations } = useTranslation();

  // Phones only have room for one label: inactive tools show just their swatch.
  const toolButton = (
    tool: DayType | null,
    swatch: ReactNode,
    label: string,
    phoneLabel: string
  ) => {
    const active = activeTool === tool;
    return (
      <Button
        key={tool ?? 'eraser'}
        variant={active ? 'solid' : 'ghost'}
        aria-pressed={active}
        aria-label={label}
        className="shrink-0"
        onClick={() => setActiveTool(tool)}
      >
        {swatch}
        {active && <span className="sm:hidden">{phoneLabel}</span>}
        <span className="hidden sm:inline">{label}</span>
        <span className="hidden sm:contents">
          <Kbd tone={active ? 'dark' : 'light'}>{displayKeyForTool(tool)}</Kbd>
        </span>
      </Button>
    );
  };

  const dayTypeButton = (type: DayType) => {
    const { swatch, label, shortLabel } = DAY_TYPES[type];
    return toolButton(
      type,
      'icon' in swatch ? (
        <swatch.icon size={14} aria-hidden />
      ) : (
        <span className={`w-2.5 h-2.5 rounded-sm ${swatch.dotClass}`} />
      ),
      label[locale],
      (shortLabel ?? label)[locale]
    );
  };

  return (
    <div className="fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] md:bottom-10 z-50 flex justify-center pointer-events-none">
      <div className="pointer-events-auto max-w-full overflow-x-auto bg-white/90 backdrop-blur-sm border border-slate-200 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] rounded-xl p-1 sm:p-1.5 flex items-center gap-0.5 sm:gap-1">
        {LEAVE_TOOLS.map(dayTypeButton)}
        <Divider />
        {toolButton(
          null,
          <Eraser size={14} aria-hidden />,
          translations.eraser,
          translations.eraser
        )}
        <Divider />
        {OTHER_TOOLS.map(dayTypeButton)}

        {/* On phones the toggle lives in the header to leave room for the tools. */}
        <div className="hidden sm:contents">
          <Divider />
          <HidePastToggle uiPreferences={uiPreferences} setUiPreferences={setUiPreferences} />
        </div>
      </div>
    </div>
  );
};

export default LeaveToolbar;
