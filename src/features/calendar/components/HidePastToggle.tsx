import { IconButton } from '@components/ui/Button';
import { useTranslation } from '@i18n/LocaleContext';
import type { UIPreferences } from '@shared/types';
import { Eye, EyeOff } from 'lucide-react';

interface HidePastToggleProps {
  uiPreferences: UIPreferences;
  setUiPreferences: (prefs: UIPreferences) => void;
  className?: string;
}

export const HidePastToggle = ({
  uiPreferences,
  setUiPreferences,
  className = '',
}: HidePastToggleProps) => {
  const { translations } = useTranslation();
  const { hidePastMonths } = uiPreferences;
  return (
    <IconButton
      label={hidePastMonths ? translations.showPast : translations.hidePast}
      pressed={hidePastMonths}
      variant={hidePastMonths ? 'solid' : 'ghost'}
      className={className}
      onClick={() => setUiPreferences({ ...uiPreferences, hidePastMonths: !hidePastMonths })}
    >
      {hidePastMonths ? <Eye size={14} /> : <EyeOff size={14} />}
    </IconButton>
  );
};
