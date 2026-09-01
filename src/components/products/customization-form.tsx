'use client';

import { useState } from 'react';
import type { CustomizationOption } from '@/types/product';

interface CustomizationFormProps {
  options: CustomizationOption[];
}

export default function CustomizationForm({ options }: CustomizationFormProps) {
  const [values, setValues] = useState<Record<string, string>>({});

  const handleChange = (label: string, value: string, maxLength: number) => {
    if (value.length <= maxLength) {
      setValues((prev) => ({ ...prev, [label]: value }));
    }
  };

  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-sm font-semibold text-foreground">Personalización</h3>
      {options.map((option) => (
        <div key={option.label}>
          <label
            htmlFor={`custom-${option.label}`}
            className="mb-1 block text-sm text-foreground"
          >
            {option.label}
          </label>
          <input
            id={`custom-${option.label}`}
            type="text"
            placeholder={option.placeholder}
            value={values[option.label] || ''}
            onChange={(e) =>
              handleChange(option.label, e.target.value, option.max_length)
            }
            maxLength={option.max_length}
            aria-describedby={`custom-${option.label}-count`}
            aria-invalid={
              values[option.label]?.length === option.max_length ? true : undefined
            }
            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-[var(--kc-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--kc-primary)]"
          />
          <div
            id={`custom-${option.label}-count`}
            className="mt-1 text-right text-xs text-muted-foreground"
          >
            {values[option.label]?.length || 0}/{option.max_length}
          </div>
        </div>
      ))}
    </div>
  );
}
