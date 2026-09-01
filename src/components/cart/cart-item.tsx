'use client';

import Image from 'next/image';
import { useCartStore } from '@/lib/hooks/use-cart';
import type { CartItemWithDetails } from '@/types/cart';
import { formatCartTotal, getBrandBadgeClass } from '@/lib/utils/cart-helpers';

interface CartItemProps {
  item: CartItemWithDetails;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem, loading } = useCartStore();

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    await updateQuantity(item.item_id, newQuantity);
  };

  const handleRemove = async () => {
    await removeItem(item.item_id);
  };

  return (
    <div className="flex gap-4 rounded-xl border border-border p-4">
      <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-lg">
        <Image
          src={item.item_image || '/placeholder-product.png'}
          alt={item.item_name}
          fill
          className="object-cover"
          sizes="6rem"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-foreground">{item.item_name}</h3>
            <span
              className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${getBrandBadgeClass(item.brand)}`}
            >
              {item.brand === 'hl' ? 'HL' : 'KC'}
            </span>
          </div>

          {item.extras && item.extras.length > 0 && (
            <p className="mt-1 text-sm text-muted-foreground">
              Extras: {item.extras.map((e) => e.name).join(', ')}
            </p>
          )}

          {item.customization && Object.keys(item.customization).length > 0 && (
            <p className="mt-1 text-sm text-muted-foreground">
              {item.customization.text && `Texto: ${item.customization.text}`}
              {item.customization.color && ` | Color: ${item.customization.color}`}
              {item.customization.size && ` | Tamaño: ${item.customization.size}`}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={loading || item.quantity <= 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Disminuir cantidad"
            >
              -
            </button>
            <span className="w-8 text-center text-sm font-medium" aria-live="polite">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={loading}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Aumentar cantidad"
            >
              +
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-semibold text-foreground">
              {formatCartTotal(item.subtotal)}
            </span>
            <button
              type="button"
              onClick={handleRemove}
              disabled={loading}
              className="text-sm text-destructive hover:underline disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={`Eliminar ${item.item_name} del carrito`}
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
