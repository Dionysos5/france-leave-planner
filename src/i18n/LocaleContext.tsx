import { LOCALE_STORAGE_KEY } from '@constants';
import type { Locale } from '@shared/types';
import { createContext, useContext, useState } from 'react';
import { TRANSLATIONS, type Translations } from './translations';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  translations: Translations;
}

const DEFAULT_LOCALE: Locale = navigator.language.toLowerCase().startsWith('fr') ? 'fr' : 'en';

const readStoredLocale = (): Locale => {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored === 'en' || stored === 'fr') return stored;
  } catch {
    // storage unavailable — fall through to the browser default
  }
  return DEFAULT_LOCALE;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export const LocaleProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>(readStoredLocale);

  const setLocale = (next: Locale) => {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      // storage unavailable — the locale still applies for this session
    }
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
