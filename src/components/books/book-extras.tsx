'use client';

import { useState } from 'react';
import type { BookExtraWithProduct } from '@/types/books';

interface BookExtrasProps {
  extras: BookExtraWithProduct[];
  selectedExtras: string[];
  onSelectionChange: (selectedIds: string[]) => void;
}

export default function BookExtras({ extras, selectedExtras, onSelectionChange }: BookExtrasProps) {
  const validExtras = (extras ?? []).filter((e) => e.products !== null);
  if (validExtras.length === 0) return null;

  function toggle(id: string) {
    onSelectionChange(
      selectedExtras.includes(id)
        ? selectedExtras.filter((e) => e !== id)
        : [...selectedExtras, id]
    );
  }

  const totalPrice = validExtras
    .filter((e) => selectedExtras.includes(e.id))
    .reduce((sum, e) => sum + e.products.price, 0);

  return (
    <div className="rounded-xl border border-hl-primary/10 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-hl-primary">Extras KamCat</h3>
      <p className="mt-1 text-xs text-hl-primary/50">Agrega productos personalizados a tu pedido</p>
      <div className="mt-3 space-y-2">
        {validExtras.map((extra) => (
          <label
            key={extra.id}
            className="flex cursor-pointer items-center gap-3 rounded-lg border border-hl-primary/10 p-3 transition-colors hover:bg-hl-secondary/5"
          >
            <input
              type="checkbox"
              checked={selectedExtras.includes(extra.id)}
              onChange={() => toggle(extra.id)}
              defaultChecked={extra.is_default}
              className="h-4 w-4 rounded border-hl-primary/30 text-hl-accent accent-hl-accent"
            />
            <div className="flex-1">
              <span className="text-sm font-medium text-hl-primary">{extra.products.name}</span>
            </div>
            <span className="text-sm font-semibold text-hl-accent">+${extra.products.price.toFixed(2)}</span>
          </label>
        ))}
      </div>
      {totalPrice > 0 && (
        <p className="mt-3 text-xs text-hl-primary/60">
          Total extras: <span className="font-semibold text-hl-accent">${totalPrice.toFixed(2)}</span>
        </p>
      )}
    </div>
  );
}
