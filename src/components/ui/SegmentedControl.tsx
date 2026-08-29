import type { ReactNode } from 'react';
import { useId } from 'react';

interface SegmentedControlProps<T extends string> {
  options: { value: T; label: ReactNode }[];
  value: T;
  onValueChange: (value: T) => void;
  ariaLabel?: string;
}

export const SegmentedControl = <T extends string>({
  options,
  value,
  onValueChange,
  ariaLabel,
}: SegmentedControlProps<T>) => {
  const name = useId();

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="flex items-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden text-xs font-bold w-fit"
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <label
            key={option.value}
            className={`px-4 py-2 transition-colors cursor-pointer has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-inset has-[:focus-visible]:ring-slate-400 ${
              selected ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selected}
              onChange={() => onValueChange(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        );
      })}
    </div>
  );
};
