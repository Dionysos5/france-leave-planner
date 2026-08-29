import { IconButton } from '@components/ui/Button';
import LeaveToolbar from '@features/calendar/components/LeaveToolbar';
import MonthGrid from '@features/calendar/components/MonthGrid';
import SettingsPanel from '@features/settings/components/SettingsPanel';
import { useEditorState } from '@hooks/useEditorState';
import { useLeavePlan } from '@hooks/useLeavePlan';
import { useTranslation } from '@i18n/LocaleContext';
import {
  ChevronLeft,
  ChevronRight,
  MousePointerClick,
  Settings as SettingsIcon,
} from 'lucide-react';

function App() {
  const { locale, translations } = useTranslation();
  const { calendar, setYear, activeTool, setActiveTool, isSettingsOpen, setIsSettingsOpen } =
    useEditorState();
  const {
    plan,
    settings,
    setSettings,
    uiPreferences,
    setUiPreferences,
    monthlyBalances,
    endBalance,
    handleToggleDay,
    handleRangeUpdate,
  } = useLeavePlan(calendar, activeTool);

  const endMonthLabel = new Date(calendar.year, monthlyBalances.length - 1).toLocaleString(
    locale === 'fr' ? 'fr-FR' : 'en-GB',
    { month: 'short' }
  );

  return (
    <div className="min-h-screen pb-28">
      <header className="px-6 pt-8 pb-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="" className="w-20 h-20" />
            <div>
              <h1 className="text-lg font-extrabold text-slate-900 leading-none">
                {translations.appTitle}
              </h1>
              <div className="flex items-center gap-0.5 text-xs font-bold text-muted">
                <IconButton
                  label={translations.previousYear}
                  className="w-5 h-5 rounded hover:bg-slate-100 hover:text-slate-700"
                  onClick={() => setYear((y) => y - 1)}
                >
                  <ChevronLeft size={13} />
                </IconButton>
                <span className="tabular-nums">{calendar.year}</span>
                <IconButton
                  label={translations.nextYear}
                  className="w-5 h-5 rounded hover:bg-slate-100 hover:text-slate-700"
                  onClick={() => setYear((y) => y + 1)}
                >
                  <ChevronRight size={13} />
                </IconButton>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm flex items-center gap-2 overflow-hidden">
              <span className="text-[9px] font-bold text-muted uppercase tracking-widest">
                {translations.cpBalance} · {endMonthLabel} {calendar.year}
              </span>
              <span
                className={`text-xs font-extrabold tabular-nums ${endBalance.balanceCP < 0 ? 'text-red-500' : 'text-slate-800'}`}
              >
                {endBalance.balanceCP.toFixed(1)}
              </span>
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-400 to-violet-500" />
            </div>

            <div className="relative bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm flex items-center gap-2 overflow-hidden">
              <span className="text-[9px] font-bold text-muted uppercase tracking-widest">
                {translations.rttBalance} · {endMonthLabel} {calendar.year}
              </span>
              <span
                className={`text-xs font-extrabold tabular-nums ${endBalance.balanceRTT < 0 ? 'text-red-500' : 'text-slate-800'}`}
              >
                {endBalance.balanceRTT.toFixed(1)}
              </span>
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-400 to-violet-500" />
            </div>

            <IconButton
              label={translations.settingsTooltip}
              variant="outline"
              className="w-10 h-10 rounded-full shadow-sm"
              onClick={() => setIsSettingsOpen(true)}
            >
              <SettingsIcon size={18} />
            </IconButton>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-4">
        {Object.keys(plan).length === 0 && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-slate-200 bg-white/80 px-4 py-3 text-xs font-bold text-slate-600 animate-enter-up">
            <MousePointerClick size={14} className="text-muted shrink-0" />
            {translations.firstRunHint}
          </div>
        )}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4 animate-enter-up">
          {Array.from({ length: 12 })
            .map((_, i) => i)
            .filter((i) => {
              if (!uiPreferences.hidePastMonths) return true;
              const now = new Date();
              return calendar.year === now.getFullYear() ? i >= now.getMonth() : true;
            })
            .map((i) => (
              <MonthGrid
                key={i}
                calendar={calendar}
                month={i}
                plan={plan}
                activeTool={activeTool}
                onToggleDay={handleToggleDay}
                onRangeUpdate={handleRangeUpdate}
              />
            ))}
        </div>
      </main>

      <LeaveToolbar
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        uiPreferences={uiPreferences}
        setUiPreferences={setUiPreferences}
      />

      <SettingsPanel
        settings={settings}
        onUpdate={setSettings}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

export default App;
