'use client';

import { useState } from 'react';

interface BookQuantityProps {
  value: number;
  onChange: (qty: number) => void;
  max?: number;
}

export default function BookQuantity({ value, onChange, max = 10 }: BookQuantityProps) {
  const [inputValue, setInputValue] = useState(value.toString());

  function clamp(n: number): number {
    return Math.max(1, Math.min(max, Math.round(n)));
  }

  function handleDecrease() {
    const next = clamp(value - 1);
    onChange(next);
    setInputValue(next.toString());
  }

  function handleIncrease() {
    const next = clamp(value + 1);
    onChange(next);
    setInputValue(next.toString());
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    setInputValue(raw);
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed)) {
      onChange(clamp(parsed));
    }
  }

  function handleBlur() {
    const parsed = parseInt(inputValue, 10);
    if (isNaN(parsed) || parsed < 1) {
      onChange(1);
      setInputValue('1');
    } else {
      const clamped = clamp(parsed);
      onChange(clamped);
      setInputValue(clamped.toString());
    }
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={handleDecrease}
        disabled={value <= 1}
        aria-label="Disminuir cantidad"
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-hl-primary/20 text-hl-primary hover:bg-hl-secondary/5 disabled:cursor-not-allowed disabled:opacity-40"
      >
        −
      </button>
      <input
        type="number"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        min={1}
        max={max}
        aria-label="Cantidad"
        className="h-10 w-14 rounded-lg border border-hl-primary/20 bg-white text-center text-sm font-medium text-hl-primary focus:border-hl-accent focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        onClick={handleIncrease}
        disabled={value >= max}
        aria-label="Aumentar cantidad"
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-hl-primary/20 text-hl-primary hover:bg-hl-secondary/5 disabled:cursor-not-allowed disabled:opacity-40"
      >
        +
      </button>
    </div>
  );
}
