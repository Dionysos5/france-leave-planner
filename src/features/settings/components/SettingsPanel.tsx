import { NumberInput } from '@components/ui/NumberInput';
import { SegmentedControl } from '@components/ui/SegmentedControl';
import { SlideOver } from '@components/ui/SlideOver';
import {
  type BalanceCheckpoint,
  forfaitRestDays,
  formatDate,
  type LeaveSettings,
  type YearCalendar,
} from '@core';
import { useTranslation } from '@i18n/LocaleContext';
import { Plus, Trash2 } from 'lucide-react';

interface SettingsPanelProps {
  calendar: YearCalendar;
  settings: LeaveSettings;
  onUpdate: (s: LeaveSettings) => void;
  isOpen: boolean;
  onClose: () => void;
}

const fieldClass =
  'w-full bg-slate-50 border border-slate-200 rounded-md px-2 py-2 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-slate-300';

const BALANCE_FIELDS = ['cpPrevious', 'cpCurrent', 'rtt'] as const;

const SettingsPanel = ({ calendar, settings, onUpdate, isOpen, onClose }: SettingsPanelProps) => {
  const { locale, setLocale, translations } = useTranslation();

  const updateCheckpoint = (index: number, patch: Partial<BalanceCheckpoint>) => {
    if (patch.dateStr !== undefined && !patch.dateStr) {
      return;
    }
    const next = settings.checkpoints.map((c, i) => (i === index ? { ...c, ...patch } : c));
    const checkpoints =
      patch.dateStr === undefined
        ? next
        : next.filter((c, i) => i === index || c.dateStr !== patch.dateStr);
    onUpdate({ ...settings, checkpoints });
  };

  const addCheckpoint = () => {
    const checkpoint: BalanceCheckpoint = {
      dateStr: formatDate(new Date()),
      cpPrevious: 0,
      cpCurrent: 0,
      rtt: 0,
    };
    onUpdate({ ...settings, checkpoints: [...settings.checkpoints, checkpoint] });
  };

  const removeCheckpoint = (index: number) => {
    const checkpoints = settings.checkpoints.filter((_, i) => i !== index);
    onUpdate({ ...settings, checkpoints });
  };

  return (
    <SlideOver
      open={isOpen}
      onClose={onClose}
      title={translations.settings.title}
      closeLabel={translations.close}
    >
      <div>
        <p className="text-[11px] font-black text-muted uppercase tracking-widest mb-4">
          {translations.settings.languageSection}
        </p>
        <SegmentedControl
          ariaLabel={translations.settings.languageSection}
          options={[
            { value: 'en', label: 'EN' },
            { value: 'fr', label: 'FR' },
          ]}
          value={locale}
          onValueChange={setLocale}
        />
      </div>

      <div>
        <p className="text-[11px] font-black text-muted uppercase tracking-widest mb-1">
          {translations.settings.balancesSection}
        </p>
        <p className="text-xs text-muted mb-4">{translations.settings.checkpointHint}</p>
        <div className="space-y-3">
          {settings.checkpoints.map((checkpoint, index) => (
            <div
              key={checkpoint.dateStr}
              className="space-y-2 rounded-md border border-slate-200 p-2"
            >
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={checkpoint.dateStr}
                  aria-label={translations.settings.asOf}
                  onChange={(e) => updateCheckpoint(index, { dateStr: e.target.value })}
                  className={fieldClass}
                />
                <button
                  type="button"
                  onClick={() => removeCheckpoint(index)}
                  aria-label={translations.settings.removeCheckpoint}
                  className="w-8 h-8 shrink-0 flex cursor-pointer items-center justify-center rounded-md text-muted hover:text-red-500 hover:bg-slate-100 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {BALANCE_FIELDS.map((field) => (
                  <div key={field}>
                    <label
                      htmlFor={`checkpoint-${index}-${field}`}
                      className="block text-[10px] font-bold text-slate-500 mb-1"
                    >
                      {translations.settings[field]}
                    </label>
                    <NumberInput
                      id={`checkpoint-${index}-${field}`}
                      step="0.5"
                      className={`${fieldClass} text-right`}
                      value={checkpoint[field]}
                      onValueChange={(val) => updateCheckpoint(index, { [field]: val })}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addCheckpoint}
          className="mt-3 flex cursor-pointer items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <Plus size={14} />
          {translations.settings.addCheckpoint}
        </button>
      </div>

      <div>
        <p className="text-[11px] font-black text-muted uppercase tracking-widest mb-4">
          {translations.settings.rulesSection}
        </p>
        <ul className="list-disc space-y-1.5 pl-4 text-xs text-slate-600">
          {translations.settings.rules(calendar.year, forfaitRestDays(calendar)).map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </div>
    </SlideOver>
  );
};

export default SettingsPanel;
