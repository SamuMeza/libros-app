'use client';

import { useState } from 'react';
import type { BookExtraWithProduct } from '@/types/books';
import BookExtras from '@/components/books/book-extras';
import BookQuantity from '@/components/books/book-quantity';

interface BookDetailClientProps {
  extras: BookExtraWithProduct[];
  bookStatus: string;
}

export default function BookDetailClient({ extras, bookStatus }: BookDetailClientProps) {
  const validExtras = extras.filter((e) => e.products !== null);
  const [selectedExtras, setSelectedExtras] = useState<string[]>(
    validExtras.filter((e) => e.is_default).map((e) => e.id)
  );
  const [quantity, setQuantity] = useState(1);

  const extrasTotal = validExtras
    .filter((e) => selectedExtras.includes(e.id))
    .reduce((sum, e) => sum + e.products.price, 0);

  const unitPrice = extrasTotal;
  const totalPrice = unitPrice * quantity;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="mb-2 text-sm font-semibold text-hl-primary">Extras</h2>
        <BookExtras
          extras={validExtras}
          selectedExtras={selectedExtras}
          onSelectionChange={setSelectedExtras}
        />
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold text-hl-primary">Cantidad</h2>
        <BookQuantity value={quantity} onChange={setQuantity} />
      </div>

      {(unitPrice > 0 || quantity > 1) && (
        <div className="rounded-lg bg-hl-secondary/5 p-3 text-sm">
          {unitPrice > 0 && (
            <p className="text-hl-primary/60">
              Extras: <span className="font-semibold text-hl-accent">+${unitPrice.toFixed(2)}</span>
            </p>
          )}
          {quantity > 1 && (
            <p className="text-hl-primary/60">
              Subtotal: <span className="font-semibold text-hl-accent">${totalPrice.toFixed(2)}</span>
            </p>
          )}
        </div>
      )}

      <button
        disabled={bookStatus === 'out_of_stock'}
        className="w-full rounded-xl bg-hl-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-hl-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {bookStatus === 'out_of_stock' ? 'Agotado' : 'Agregar al carrito'}
      </button>
    </div>
  );
}
