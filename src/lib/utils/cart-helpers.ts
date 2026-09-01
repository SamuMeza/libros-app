import type { CartItemWithDetails, CartBrandGroup, CartSummary } from '@/types/cart';

export function calculateCartItemSubtotal(item: CartItemWithDetails): number {
  const extrasTotal = item.extras.reduce(
    (sum, extra) => sum + extra.price * extra.quantity,
    0
  );
  return (item.item_price + extrasTotal) * item.quantity;
}

export function groupItemsByBrand(items: CartItemWithDetails[]): CartBrandGroup[] {
  const brandMap = new Map<'hl' | 'kc', CartItemWithDetails[]>();

  for (const item of items) {
    const existing = brandMap.get(item.brand) || [];
    existing.push(item);
    brandMap.set(item.brand, existing);
  }

  const brandNames: Record<'hl' | 'kc', string> = {
    hl: 'Hecho Letras',
    kc: 'KamCat',
  };

  const groups: CartBrandGroup[] = [];

  for (const [brand, brandItems] of brandMap) {
    const subtotal = brandItems.reduce(
      (sum, item) => sum + calculateCartItemSubtotal(item),
      0
    );
    groups.push({
      brand,
      brand_name: brandNames[brand],
      items: brandItems,
      subtotal,
    });
  }

  return groups;
}

export function calculateCartSummary(items: CartItemWithDetails[]): CartSummary {
  const brands = groupItemsByBrand(items);
  const total = brands.reduce((sum, brand) => sum + brand.subtotal, 0);
  const total_items = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items,
    brands,
    total,
    total_items,
  };
}

export function formatCartTotal(total: number): string {
  return `$${total.toFixed(2)}`;
}

export function getBrandColor(brand: 'hl' | 'kc'): string {
  return brand === 'hl' ? 'var(--hl-primary)' : 'var(--kc-primary)';
}

export function getBrandBadgeClass(brand: 'hl' | 'kc'): string {
  return brand === 'hl' ? 'bg-[var(--hl-primary)]/10 text-[var(--hl-primary)]' : 'bg-[var(--kc-primary)]/10 text-[var(--kc-primary)]';
}
