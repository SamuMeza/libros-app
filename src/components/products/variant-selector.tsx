'use client';

import { useState } from 'react';
import type { Variant } from '@/types/product';

interface VariantSelectorProps {
  variants: Variant[];
  onSelectionChange?: (selection: { size?: string; color?: string }) => void;
}

export default function VariantSelector({
  variants,
  onSelectionChange,
}: VariantSelectorProps) {
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [selectedColor, setSelectedColor] = useState<string | undefined>();

  const sizeVariant = variants.find(
    (v) => v.name.toLowerCase() === 'tamaño' || v.name.toLowerCase() === 'size'
  );
  const colorVariant = variants.find(
    (v) => v.name.toLowerCase() === 'color'
  );

  const handleSizeChange = (value: string) => {
    const newSize = selectedSize === value ? undefined : value;
    setSelectedSize(newSize);
    onSelectionChange?.({ size: newSize, color: selectedColor });
  };

  const handleColorChange = (value: string) => {
    const newColor = selectedColor === value ? undefined : value;
    setSelectedColor(newColor);
    onSelectionChange?.({ size: selectedSize, color: newColor });
  };

  return (
    <div className="space-y-6">
      {sizeVariant && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">
            {sizeVariant.name}
          </h3>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={sizeVariant.name}>
            {sizeVariant.options.map((option) => (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={selectedSize === option.value}
                onClick={() => handleSizeChange(option.value)}
                className={`flex items-center gap-2 rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kc-primary)] ${
                  selectedSize === option.value
                    ? 'border-[var(--kc-primary)] bg-[var(--kc-primary)]/10 text-[var(--kc-primary)]'
                    : 'border-border text-foreground hover:border-[var(--kc-primary)]/50'
                }`}
              >
                <span>{option.label}</span>
                {Number(option.price_adjustment) > 0 && (
                  <span className="text-xs text-muted-foreground">
                    +${Number(option.price_adjustment).toFixed(2)}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {colorVariant && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">
            {colorVariant.name}
          </h3>
          <div className="flex flex-wrap gap-3" role="radiogroup" aria-label={colorVariant.name}>
            {colorVariant.options.map((option) => (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={selectedColor === option.value}
                aria-label={option.label}
                onClick={() => handleColorChange(option.value)}
                className={`h-10 w-10 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kc-primary)] focus-visible:ring-offset-2 ${
                  selectedColor === option.value
                    ? 'ring-2 ring-[var(--kc-primary)] ring-offset-2'
                    : 'hover:ring-2 hover:ring-[var(--kc-primary)]/50 hover:ring-offset-2'
                }`}
                style={{ backgroundColor: option.color_hex || '#ccc' }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
