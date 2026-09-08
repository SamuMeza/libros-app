'use client';

import { useState } from 'react';
import type { Variant, CustomizationOption } from '@/types/product';
import VariantSelector from '@/components/products/variant-selector';
import CustomizationForm from '@/components/products/customization-form';
import { useCartStore } from '@/lib/hooks/use-cart';

interface KamCatProductActionsProps {
  productId: string;
  variants: Variant[];
  customizationOptions: CustomizationOption[];
}

export default function KamCatProductActions({
  productId,
  variants,
  customizationOptions,
}: KamCatProductActionsProps) {
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [customization, setCustomization] = useState<Record<string, string>>({});
  const [isAdding, setIsAdding] = useState(false);
  const addToCart = useCartStore((s) => s.addToCart);

  const hasCustomization = customizationOptions.length > 0;

  async function handleAddToCart() {
    if (isAdding) return;
    setIsAdding(true);
    try {
      await addToCart({
        item_type: 'product',
        item_id: productId,
        quantity: 1,
        customization: {
          ...selectedVariants,
          ...customization,
        },
      });
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <>
      {variants.length > 0 && (
        <VariantSelector
          variants={variants}
          selectedVariants={selectedVariants}
          onSelectionChange={setSelectedVariants}
        />
      )}

      {hasCustomization && (
        <CustomizationForm
          options={customizationOptions}
          onValuesChange={setCustomization}
        />
      )}

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={isAdding}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--kc-primary)] px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-[var(--kc-primary)]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kc-primary)] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Agregar al carrito"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        {isAdding ? 'Agregando...' : 'Agregar al carrito'}
      </button>
    </>
  );
}
