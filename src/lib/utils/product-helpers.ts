import type { Variant, VariantOption } from '@/types/product';

export function calculatePrice(
  basePrice: number,
  variants: Variant[],
  selectedVariants?: { size?: string; color?: string }
): { basePrice: number; variantAdjustment: number; finalPrice: number } {
  let variantAdjustment = 0;

  if (selectedVariants) {
    for (const variant of variants) {
      const selectedValue =
        variant.name.toLowerCase() === 'tamaño'
          ? selectedVariants.size
          : variant.name.toLowerCase() === 'color'
            ? selectedVariants.color
            : undefined;

      if (selectedValue) {
        const option = variant.options.find(
          (o: VariantOption) => o.value === selectedValue
        );
        if (option) {
          variantAdjustment += Number(option.price_adjustment);
        }
      }
    }
  }

  return {
    basePrice,
    variantAdjustment,
    finalPrice: basePrice + variantAdjustment,
  };
}

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

export function getSizeVariants(variants: Variant[]): Variant | undefined {
  return variants.find(
    (v) => v.name.toLowerCase() === 'tamaño' || v.name.toLowerCase() === 'size'
  );
}

export function getColorVariants(variants: Variant[]): Variant | undefined {
  return variants.find(
    (v) => v.name.toLowerCase() === 'color'
  );
}
