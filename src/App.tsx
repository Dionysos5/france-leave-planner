import { PLAN_YEAR } from "@constants";
import LeaveToolbar from "@features/calendar/components/LeaveToolbar";
import MonthGrid from "@features/calendar/components/MonthGrid";
import SettingsPanel from "@features/settings/components/SettingsPanel";
import { useLeaveApp } from "@hooks/useLeaveApp";
import { useTranslation } from "@i18n/LocaleContext";
import { Settings as SettingsIcon } from "lucide-react";

function App() {
  const { translations } = useTranslation();
  const {
    settings,
    setSettings,
    uiPreferences,
    setUiPreferences,
    activeTool,
    setActiveTool,
    isSettingsOpen,
    setIsSettingsOpen,
    monthlyBalances,
    endBalance,
    leavesByDate,
    handleToggleDay,
    handleRangeUpdate,
  } = useLeaveApp();

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
              <span className="text-xs text-slate-400 font-medium">
                {PLAN_YEAR}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm flex items-center gap-2 overflow-hidden">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                {translations.cpBalance}
              </span>
              <span
                className={`text-xs font-extrabold tabular-nums ${endBalance.balanceCP < 0 ? "text-red-500" : "text-slate-800"}`}
              >
                {endBalance.balanceCP.toFixed(1)}
              </span>
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-400 to-violet-500" />
            </div>

            <div className="relative bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm flex items-center gap-2 overflow-hidden">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                {translations.rttBalance}
              </span>
              <span
                className={`text-xs font-extrabold tabular-nums ${endBalance.balanceRTT < 0 ? "text-red-500" : "text-slate-800"}`}
              >
                {endBalance.balanceRTT.toFixed(1)}
              </span>
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-400 to-violet-500" />
            </div>

            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors"
              title={translations.settingsTooltip}
            >
              <SettingsIcon size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-4">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {Array.from({ length: 12 })
            .map((_, i) => i)
            .filter(
              (i) =>
                !uiPreferences.hidePastMonths || i >= new Date().getMonth(),
            )
            .map((i) => (
              <MonthGrid
                key={i}
                year={PLAN_YEAR}
                month={i}
                leaves={leavesByDate}
                activeTool={activeTool}
                onToggleDay={handleToggleDay}
                onRangeUpdate={handleRangeUpdate}
                monthBalance={monthlyBalances[i]}
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
