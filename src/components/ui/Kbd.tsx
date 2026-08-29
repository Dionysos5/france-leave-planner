import type { ReactNode } from 'react';

const TONES = {
  light: 'border-slate-200 bg-white text-muted',
  dark: 'border-white/30 bg-white/10 text-white',
};

export const Kbd = ({
  tone = 'light',
  children,
}: {
  tone?: keyof typeof TONES;
  children: ReactNode;
}) => {
  return (
    <kbd
      className={`inline-flex h-4 min-w-4 items-center justify-center rounded border px-1 text-[9px] font-bold leading-none ${TONES[tone]}`}
    >
      {children}
    </kbd>
  );
};
