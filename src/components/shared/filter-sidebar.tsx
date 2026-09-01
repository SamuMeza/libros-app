'use client';

import { useState } from 'react';
import type { Category } from '@/types/product';

interface FilterSidebarProps {
  categories: Category[];
  selectedCategoryIds: string[];
  onCategoryChange: (ids: string[]) => void;
  productCounts?: Map<string, number>;
}

export default function FilterSidebar({
  categories,
  selectedCategoryIds,
  onCategoryChange,
  productCounts = new Map(),
}: FilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (categoryId: string) => {
    const newIds = selectedCategoryIds.includes(categoryId)
      ? selectedCategoryIds.filter((id) => id !== categoryId)
      : [...selectedCategoryIds, categoryId];
    onCategoryChange(newIds);
  };

  const sidebarContent = (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold uppercase text-muted-foreground">
        Categorías
      </h3>
      <div className="space-y-2">
        {categories.map((category) => (
          <label
            key={category.id}
            className="flex cursor-pointer items-center gap-2 rounded-md p-2 transition-colors hover:bg-muted"
          >
            <input
              type="checkbox"
              checked={selectedCategoryIds.includes(category.id)}
              onChange={() => handleToggle(category.id)}
              className="h-4 w-4 rounded border-border text-[var(--kc-primary)] focus:ring-[var(--kc-primary)]"
              aria-label={`Filtrar por ${category.name}`}
            />
            <span className="flex-1 text-sm">{category.name}</span>
            <span className="text-xs text-muted-foreground">
              {productCounts.get(category.id) || 0}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        className="fixed bottom-4 right-4 z-40 rounded-full bg-[var(--kc-primary)] p-3 text-white shadow-lg lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Toggle filtros"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 h-full w-[280px] overflow-y-auto bg-card p-4 shadow-lg transition-transform duration-200 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="complementary"
        aria-label="Filtros de productos"
      >
        <div className="mb-4 flex items-center justify-between lg:hidden">
          <h2 className="text-lg font-semibold">Filtros</h2>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-md p-1 hover:bg-muted"
            aria-label="Cerrar filtros"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        {sidebarContent}
      </aside>
    </>
  );
}
