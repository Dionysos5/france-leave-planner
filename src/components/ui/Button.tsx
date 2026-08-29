import type { ButtonHTMLAttributes } from 'react';

type Variant = 'ghost' | 'solid' | 'outline';

const VARIANT_CLASSES: Record<Variant, string> = {
  ghost: 'text-slate-500 hover:bg-slate-50 hover:text-slate-900',
  solid: 'bg-slate-900 text-white hover:bg-slate-700',
  outline: 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50',
};

const FOCUS_CLASSES =
  'cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-slate-400 transition-colors';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export const Button = ({
  variant = 'ghost',
  className = '',
  type = 'button',
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`rounded-md px-3.5 py-2 text-xs font-bold flex items-center gap-2 whitespace-nowrap ${FOCUS_CLASSES} ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  );
};

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  pressed?: boolean;
  variant?: Variant;
}

export const IconButton = ({
  label,
  pressed,
  variant = 'ghost',
  className = '',
  type = 'button',
  ...props
}: IconButtonProps) => {
  return (
    <button
      type={type}
      aria-label={label}
      aria-pressed={pressed}
      className={`w-8 h-8 rounded-lg flex items-center justify-center ${FOCUS_CLASSES} ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  );
};
