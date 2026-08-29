'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import type { BookFilters, BookSort, AvailabilityFilter } from '@/types/books';
import SearchBar from '@/components/shared/search-bar';
import SortSelector from '@/components/shared/sort-selector';
import FilterSidebar from '@/components/shared/filter-sidebar';
import Pagination from '@/components/shared/pagination';

interface Category {
  id: string;
  name: string;
  count: number;
}

interface CatalogClientProps {
  filters: BookFilters;
  result: {
    books: unknown[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  categories: Category[];
}

export default function CatalogClient({ filters, result, categories }: CatalogClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === undefined || value === '' || value === 'all') {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      params.delete('page');
      router.push(`/libros?${params.toString()}`);
    },
    [router, searchParams]
  );

  function handleSearch(term: string) {
    updateParams({ q: term || undefined });
  }

  function handleSort(sort: BookSort) {
    updateParams({ sort: sort === 'relevance' ? undefined : sort });
  }

  function handleFilterChange(newFilters: BookFilters) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('category');
    params.delete('minPrice');
    params.delete('maxPrice');
    params.delete('availability');
    params.delete('page');

    if (newFilters.categoryIds && newFilters.categoryIds.length > 0) {
      params.set('category', newFilters.categoryIds.join(','));
    }
    if (newFilters.minPrice !== undefined) {
      params.set('minPrice', newFilters.minPrice.toString());
    }
    if (newFilters.maxPrice !== undefined) {
      params.set('maxPrice', newFilters.maxPrice.toString());
    }
    if (newFilters.availability && newFilters.availability !== 'all') {
      params.set('availability', newFilters.availability);
    }

    router.push(`/libros?${params.toString()}`);
  }

  function handlePageChange(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) {
      params.delete('page');
    } else {
      params.set('page', page.toString());
    }
    router.push(`/libros?${params.toString()}`);
  }

  function handleClearFilters() {
    router.push('/libros');
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-md">
          <SearchBar value={filters.search ?? ''} onSearch={handleSearch} />
        </div>
        <SortSelector value={filters.sort ?? 'relevance'} onChange={handleSort} />
      </div>

      <div className="flex gap-8">
        <FilterSidebar
          categories={categories}
          filters={filters}
          onFilterChange={handleFilterChange}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1">
          {result.books.length === 0 ? null : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {result.books as React.ReactNode[]}
            </div>
          )}

          {result.books.length > 0 && (
            <div className="mt-8">
              <Pagination
                page={result.page}
                totalPages={result.totalPages}
                onPageChange={handlePageChange}
                total={result.total}
                pageSize={result.pageSize}
              />
            </div>
          )}
        </main>
      </div>

      <button
        onClick={() => setSidebarOpen(true)}
        aria-label="Abrir filtros"
        className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-hl-accent text-white shadow-lg lg:hidden"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
      </button>
    </>
  );
}
