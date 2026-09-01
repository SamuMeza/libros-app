'use client';

import { useMemo } from 'react';
import type { Variant } from '@/types/product';
import { calculatePrice, formatPrice } from '@/lib/utils/product-helpers';

interface PriceDisplayProps {
  basePrice: number;
  productId: string;
  variants: Variant[];
  selectedVariants?: {
    size?: string;
    color?: string;
  };
}

export default function PriceDisplay({
  basePrice,
  variants,
  selectedVariants = {},
}: PriceDisplayProps) {
  const price = useMemo(() => {
    try {
      return calculatePrice(basePrice, variants, selectedVariants);
    } catch {
      return { basePrice, variantAdjustment: 0, finalPrice: basePrice };
    }
  }, [basePrice, variants, selectedVariants]);

  const hasError = price.finalPrice === price.basePrice && price.variantAdjustment === 0 && Object.keys(selectedVariants).length > 0;

  return (
    <div className="mb-6">
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-[var(--kc-accent)]">
          {formatPrice(price.finalPrice)}
        </span>
        {price.variantAdjustment > 0 && (
          <span className="text-sm text-muted-foreground">
            (base {formatPrice(price.basePrice)} + variante{' '}
            {formatPrice(price.variantAdjustment)})
          </span>
        )}
      </div>
      {hasError && (
        <p className="mt-1 text-xs text-muted-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-1 inline h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Precio final se confirmará al agregar al carrito
        </p>
      )}
    </div>
  );
}
