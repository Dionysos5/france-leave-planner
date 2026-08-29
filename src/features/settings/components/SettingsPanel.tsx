import { NumberInput } from '@components/ui/NumberInput';
import { SegmentedControl } from '@components/ui/SegmentedControl';
import { SlideOver } from '@components/ui/SlideOver';
import { type BalanceCheckpoint, formatDate, type LeaveSettings } from '@core';
import { useTranslation } from '@i18n/LocaleContext';
import { Plus, Trash2 } from 'lucide-react';

interface SettingsPanelProps {
  settings: LeaveSettings;
  onUpdate: (s: LeaveSettings) => void;
  isOpen: boolean;
  onClose: () => void;
}

const inputClass =
  'w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-slate-300 outline-none';

const compactInputClass =
  'w-full bg-slate-50 border border-slate-200 rounded-md px-2 py-2 text-xs font-bold text-slate-900 text-right outline-none focus:ring-2 focus:ring-slate-300';

const SettingsPanel = ({ settings, onUpdate, isOpen, onClose }: SettingsPanelProps) => {
  const { locale, setLocale, translations } = useTranslation();

  const handleChange = (field: 'accrualRateCP' | 'accrualRateRTT', value: number) => {
    onUpdate({ ...settings, [field]: value });
  };

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
      balanceCP: 0,
      balanceRTT: 0,
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
        <p className="text-[11px] font-black text-muted uppercase tracking-widest mb-4">
          {translations.settings.balancesSection}
        </p>
        <div className="space-y-2">
          {settings.checkpoints.map((checkpoint, index) => (
            <div
              key={checkpoint.dateStr}
              className="grid grid-cols-[1fr_4rem_4rem_auto] gap-2 items-center"
            >
              <input
                type="date"
                value={checkpoint.dateStr}
                aria-label={translations.settings.asOf}
                onChange={(e) => updateCheckpoint(index, { dateStr: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-md px-2 py-2 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-slate-300"
              />
              <NumberInput
                step="0.5"
                className={compactInputClass}
                value={checkpoint.balanceCP}
                onValueChange={(val) => updateCheckpoint(index, { balanceCP: val })}
              />
              <NumberInput
                step="0.5"
                className={compactInputClass}
                value={checkpoint.balanceRTT}
                onValueChange={(val) => updateCheckpoint(index, { balanceRTT: val })}
              />
              <button
                type="button"
                onClick={() => removeCheckpoint(index)}
                aria-label={translations.settings.removeCheckpoint}
                className="w-7 h-7 flex cursor-pointer items-center justify-center rounded-md text-muted hover:text-red-500 hover:bg-slate-100 transition-colors"
              >
                <Trash2 size={14} />
              </button>
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
          {translations.settings.cpSection}
        </p>
        <label htmlFor="accrualRateCP" className="block text-xs font-bold text-slate-500 mb-1.5">
          {translations.settings.monthlyEarned}
        </label>
        <NumberInput
          id="accrualRateCP"
          step="0.01"
          min={0}
          className={inputClass}
          value={settings.accrualRateCP}
          onValueChange={(val) => handleChange('accrualRateCP', val)}
        />
      </div>

      <div>
        <p className="text-[11px] font-black text-muted uppercase tracking-widest mb-4">
          {translations.settings.rttSection}
        </p>
        <label htmlFor="accrualRateRTT" className="block text-xs font-bold text-slate-500 mb-1.5">
          {translations.settings.monthlyEarned}
        </label>
        <NumberInput
          id="accrualRateRTT"
          step="0.01"
          min={0}
          className={inputClass}
          value={settings.accrualRateRTT}
          onValueChange={(val) => handleChange('accrualRateRTT', val)}
        />
      </div>

      <p className="text-xs text-muted italic">{translations.settings.unpaidNote}</p>
    </SlideOver>
  );
};

export default SettingsPanel;
