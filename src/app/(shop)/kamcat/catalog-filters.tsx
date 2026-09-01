'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import FilterSidebar from '@/components/shared/filter-sidebar';
import Pagination from '@/components/shared/pagination';
import SearchBar from '@/components/shared/search-bar';
import SortSelector from '@/components/shared/sort-selector';
import ProductCard from '@/components/products/product-card';
import type { Product } from '@/types/product';

interface CategoryData {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

interface CatalogFiltersProps {
  categories: CategoryData[];
  selectedCategoryIds: string[];
  productCounts: Map<string, number>;
  currentSort: string;
  currentSearch: string;
  currentPage: number;
  totalPages: number;
  total: number;
  products: Product[];
}

export default function CatalogFilters({
  categories,
  selectedCategoryIds,
  productCounts,
  currentSort,
  currentSearch,
  currentPage,
  totalPages,
  total,
  products,
}: CatalogFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (key: string, value: string | string[] | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null || (Array.isArray(value) && value.length === 0)) {
        params.delete(key);
      } else if (Array.isArray(value)) {
        params.delete(key);
        value.forEach((v) => params.append(key, v));
      } else {
        params.set(key, value);
      }
      params.delete('page');
      router.push(`/kamcat?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleSearch = useCallback(
    (value: string) => {
      updateParams('search', value || null);
    },
    [updateParams]
  );

  const handleSort = useCallback(
    (value: string) => {
      updateParams('sort', value === 'relevance' ? null : value);
    },
    [updateParams]
  );

  const handleCategoryChange = useCallback(
    (ids: string[]) => {
      updateParams('category', ids.length > 0 ? ids : null);
    },
    [updateParams]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (page === 1) {
        params.delete('page');
      } else {
        params.set('page', page.toString());
      }
      router.push(`/kamcat?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="flex gap-8">
      <FilterSidebar
        categories={categories.map((c) => ({
          ...c,
          brand: 'kc' as const,
          description: null,
          image_url: null,
          created_at: '',
          is_active: true,
          sort_order: 0,
        }))}
        selectedCategoryIds={selectedCategoryIds}
        onCategoryChange={handleCategoryChange}
        productCounts={productCounts}
      />

      <main className="flex-1">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SearchBar
            defaultValue={currentSearch}
            onSearch={handleSearch}
            placeholder="Buscar productos KamCat..."
          />
          <SortSelector value={currentSort} onChange={handleSort} />
        </div>

        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Mostrando {products.length} de {total} resultados
          </p>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mb-4 h-12 w-12 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="mb-1 text-lg font-medium text-foreground">
              No se encontraron productos
            </h3>
            <p className="text-sm text-muted-foreground">
              Intenta ajustar los filtros o la búsqueda
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </main>
    </div>
  );
}
