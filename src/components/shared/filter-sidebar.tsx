'use client';

import { useState } from 'react';
import type { BookFilters, AvailabilityFilter } from '@/types/books';

interface Category {
  id: string;
  name: string;
  count: number;
}

interface FilterSidebarProps {
  categories: Category[];
  filters: BookFilters;
  onFilterChange: (filters: BookFilters) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterSidebar({ categories, filters, onFilterChange, isOpen, onClose }: FilterSidebarProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(filters.categoryIds ?? []);
  const [minPrice, setMinPrice] = useState(filters.minPrice?.toString() ?? '');
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice?.toString() ?? '');
  const [availability, setAvailability] = useState<AvailabilityFilter>(filters.availability ?? 'all');

  function applyFilters() {
    onFilterChange({
      ...filters,
      categoryIds: selectedCategories.length > 0 ? selectedCategories : undefined,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      availability,
      page: 1,
    });
    onClose();
  }

  function toggleCategory(id: string) {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  function clearAll() {
    setSelectedCategories([]);
    setMinPrice('');
    setMaxPrice('');
    setAvailability('all');
    onFilterChange({ ...filters, categoryIds: undefined, minPrice: undefined, maxPrice: undefined, availability: 'all', page: 1 });
    onClose();
  }

  const sidebarContent = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-hl-primary">Filtros</h2>
        <button onClick={clearAll} className="text-xs text-hl-accent hover:underline">
          Limpiar todo
        </button>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium text-hl-primary">Categorías</h3>
        <div className="space-y-1.5">
          {categories.map((cat) => (
            <label key={cat.id} className="flex cursor-pointer items-center gap-2 text-sm text-hl-primary/70 hover:text-hl-primary">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.id)}
                onChange={() => toggleCategory(cat.id)}
                className="h-4 w-4 rounded border-hl-primary/30 text-hl-accent accent-hl-accent"
              />
              <span className="flex-1">{cat.name}</span>
              <span className="text-xs text-hl-primary/40">({cat.count})</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium text-hl-primary">Precio (USD)</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Mín"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full rounded-lg border border-hl-primary/20 px-3 py-1.5 text-sm focus:border-hl-accent focus:outline-none"
            min="0"
          />
          <span className="text-hl-primary/40">—</span>
          <input
            type="number"
            placeholder="Máx"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full rounded-lg border border-hl-primary/20 px-3 py-1.5 text-sm focus:border-hl-accent focus:outline-none"
            min="0"
          />
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium text-hl-primary">Disponibilidad</h3>
        <div className="space-y-1.5">
          {(['all', 'in_stock', 'on_demand'] as const).map((opt) => (
            <label key={opt} className="flex cursor-pointer items-center gap-2 text-sm text-hl-primary/70 hover:text-hl-primary">
              <input
                type="radio"
                name="availability"
                checked={availability === opt}
                onChange={() => setAvailability(opt)}
                className="h-4 w-4 border-hl-primary/30 text-hl-accent accent-hl-accent"
              />
              {opt === 'all' ? 'Todos' : opt === 'in_stock' ? 'En stock' : 'Bajo demanda'}
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={applyFilters}
        className="w-full rounded-lg bg-hl-accent px-4 py-2 text-sm font-medium text-white hover:bg-hl-accent/90 transition-colors"
      >
        Aplicar filtros
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:block w-64 shrink-0 rounded-xl border border-hl-primary/10 bg-white p-5 shadow-sm sticky top-24 self-start">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-white p-5 shadow-xl overflow-y-auto animate-slide-in-left">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
