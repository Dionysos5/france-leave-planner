import { useEffect, useState } from 'react';

interface NumberInputProps {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  id?: string;
  step?: string;
  ariaLabel?: string;
  className?: string;
}

export const NumberInput = ({
  value,
  onValueChange,
  min,
  max,
  id,
  step,
  ariaLabel,
  className = '',
}: NumberInputProps) => {
  const [raw, setRaw] = useState(String(value));
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    setRaw(String(value));
  }, [value]);

  const outOfRange = (num: number) =>
    (min !== undefined && num < min) || (max !== undefined && num > max);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    setRaw(next);
    const num = Number.parseFloat(next);
    if (next.trim() === '' || Number.isNaN(num) || outOfRange(num)) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    onValueChange(num);
  };

  const handleBlur = () => {
    if (invalid) {
      setRaw(String(value));
      setInvalid(false);
    }
  };

  return (
    <input
      id={id}
      type="number"
      inputMode="decimal"
      step={step}
      aria-label={ariaLabel}
      className={`${className} ${invalid ? 'ring-2 ring-red-400' : ''}`}
      value={raw}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
};
