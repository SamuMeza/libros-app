'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/lib/hooks/use-cart';
import CartItem from './cart-item';
import CartSummary from './cart-summary';
import EmptyCart from './empty-cart';

export default function CartPage() {
  const { items, loading, error, fetchCart, clearError } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (loading && items.length === 0) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-xl border border-border p-4">
            <div className="flex gap-4">
              <div className="h-24 w-20 rounded-lg bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 rounded bg-muted" />
                <div className="h-3 w-1/2 rounded bg-muted" />
                <div className="h-8 w-24 rounded bg-muted" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-4">
        <p className="text-destructive">{error}</p>
        <button
          type="button"
          onClick={() => {
            clearError();
            fetchCart();
          }}
          className="mt-2 text-sm font-medium text-destructive hover:underline"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <h1 className="text-2xl font-bold text-foreground">Tu Carrito</h1>
        {items.map((item) => (
          <CartItem key={item.item_id} item={item} />
        ))}
      </div>
      <div className="lg:col-span-1">
        <CartSummary />
      </div>
    </div>
  );
}
