'use client';

import type { BookSort } from '@/types/books';

const SORT_OPTIONS: { value: BookSort; label: string }[] = [
  { value: 'relevance', label: 'Relevancia' },
  { value: 'newest', label: 'Novedades' },
  { value: 'price_asc', label: 'Precio (menor a mayor)' },
  { value: 'price_desc', label: 'Precio (mayor a menor)' },
  { value: 'alpha', label: 'A — Z' },
];

interface SortSelectorProps {
  value: BookSort;
  onChange: (sort: BookSort) => void;
}

export default function SortSelector({ value, onChange }: SortSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-select" className="text-sm text-hl-primary/60 whitespace-nowrap">
        Ordenar por:
      </label>
      <select
        id="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value as BookSort)}
        className="rounded-lg border border-hl-primary/20 bg-white px-3 py-1.5 text-sm text-hl-primary focus:border-hl-accent focus:outline-none focus:ring-1 focus:ring-hl-accent/30"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
