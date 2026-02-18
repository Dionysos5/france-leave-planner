import { useTranslation } from '@i18n/LocaleContext';
import type { LeaveSettings } from '@shared/types';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SettingsPanelProps {
  settings: LeaveSettings;
  onUpdate: (s: LeaveSettings) => void;
  isOpen: boolean;
  onClose: () => void;
}

const NumberInput = ({
  id,
  value,
  onChange,
  className,
  step,
}: {
  id?: string;
  value: number;
  onChange: (val: number) => void;
  className?: string;
  step?: string;
}) => {
  const [localValue, setLocalValue] = useState(value.toString());

  useEffect(() => {
    setLocalValue(value.toString());
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalValue(val);
    const num = Number.parseFloat(val);
    if (!Number.isNaN(num)) {
      onChange(num);
    } else if (val === '') {
      onChange(0);
    }
  };

  return (
    <input
      id={id}
      type="number"
      step={step}
      className={className}
      value={localValue}
      onChange={handleChange}
    />
  );
};

const SettingsPanel = ({ settings, onUpdate, isOpen, onClose }: SettingsPanelProps) => {
  const { locale, setLocale, translations } = useTranslation();
  const handleChange = (field: keyof LeaveSettings, value: number) => {
    onUpdate({ ...settings, [field]: value });
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-[60] transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <aside
        className={`settings-slideover fixed top-0 right-0 h-full w-80 bg-white border-l border-slate-200 shadow-2xl z-[70] overflow-y-auto ${isOpen ? '' : 'closed'}`}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="text-sm font-extrabold text-slate-900">{translations.settings.title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-6">
          <div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">
              {translations.settings.languageSection}
            </p>
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden text-xs font-bold w-fit">
              <button
                type="button"
                onClick={() => setLocale('en')}
                className={`px-4 py-2 transition-colors ${locale === 'en' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLocale('fr')}
                className={`px-4 py-2 transition-colors ${locale === 'fr' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                FR
              </button>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">
              {translations.settings.cpSection}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="initialCP"
                  className="block text-xs font-bold text-slate-500 mb-1.5"
                >
                  {translations.settings.janBalance}
                </label>
                <NumberInput
                  id="initialCP"
                  step="0.5"
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-slate-300 outline-none"
                  value={settings.initialCP}
                  onChange={(val) => handleChange('initialCP', val)}
                />
              </div>
              <div>
                <label
                  htmlFor="accrualRateCP"
                  className="block text-xs font-bold text-slate-500 mb-1.5"
                >
                  {translations.settings.monthlyEarned}
                </label>
                <NumberInput
                  id="accrualRateCP"
                  step="0.01"
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-slate-300 outline-none"
                  value={settings.accrualRateCP}
                  onChange={(val) => handleChange('accrualRateCP', val)}
                />
              </div>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">
              {translations.settings.rttSection}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="initialRTT"
                  className="block text-xs font-bold text-slate-500 mb-1.5"
                >
                  {translations.settings.janBalance}
                </label>
                <NumberInput
                  id="initialRTT"
                  step="0.5"
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-slate-300 outline-none"
                  value={settings.initialRTT}
                  onChange={(val) => handleChange('initialRTT', val)}
                />
              </div>
              <div>
                <label
                  htmlFor="accrualRateRTT"
                  className="block text-xs font-bold text-slate-500 mb-1.5"
                >
                  {translations.settings.monthlyEarned}
                </label>
                <NumberInput
                  id="accrualRateRTT"
                  step="0.01"
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-slate-300 outline-none"
                  value={settings.accrualRateRTT}
                  onChange={(val) => handleChange('accrualRateRTT', val)}
                />
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-400 italic">{translations.settings.unpaidNote}</p>
        </div>
      </aside>
    </>
  );
};

export default SettingsPanel;
