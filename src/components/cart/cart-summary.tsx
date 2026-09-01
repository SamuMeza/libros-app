'use client';

import Link from 'next/link';
import { useCartStore } from '@/lib/hooks/use-cart';
import { formatCartTotal } from '@/lib/utils/cart-helpers';

export default function CartSummary() {
  const { brands, total, total_items } = useCartStore();

  return (
    <div className="rounded-xl border border-border p-6">
      <h2 className="mb-4 text-lg font-semibold text-foreground">Resumen del Carrito</h2>

      <div className="space-y-3">
        {brands.map((brand) => (
          <div key={brand.brand} className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {brand.brand_name} ({brand.items.length} ítems)
            </span>
            <span className="text-sm font-medium text-foreground">
              {formatCartTotal(brand.subtotal)}
            </span>
          </div>
        ))}

        <div className="border-t border-border pt-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Total ({total_items} ítems)</span>
            <span className="text-xl font-bold text-foreground">{formatCartTotal(total)}</span>
          </div>
        </div>
      </div>

      <Link
        href="/checkout"
        className="mt-6 flex w-full items-center justify-center rounded-lg bg-[var(--hl-primary)] px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-[var(--hl-primary)]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hl-primary)] focus-visible:ring-offset-2"
      >
        Proceder al Checkout
      </Link>

      <Link
        href="/libros"
        className="mt-3 flex w-full items-center justify-center rounded-lg border border-border px-6 py-3 text-base font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hl-primary)] focus-visible:ring-offset-2"
      >
        Seguir Comprando
      </Link>
    </div>
  );
}
