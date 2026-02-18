import type { Locale } from '@shared/types';
import { createContext, useContext, useState } from 'react';
import { TRANSLATIONS, type Translations } from './translations';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  translations: Translations;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export const LocaleProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const stored = localStorage.getItem('locale');
    if (stored === 'en' || stored === 'fr') return stored;
    return navigator.language.toLowerCase().startsWith('fr') ? 'fr' : 'en';
  });

  const setLocale = (next: Locale) => {
    localStorage.setItem('locale', next);
    setLocaleState(next);
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, translations: TRANSLATIONS[locale] }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useTranslation = (): LocaleContextValue => {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useTranslation must be used inside LocaleProvider');
  return ctx;
};
