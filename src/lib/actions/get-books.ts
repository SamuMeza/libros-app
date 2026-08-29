'use server';

import { createServerClient } from '@/lib/supabase/server';
import type { BookFilters, BookListResult, BookSort } from '@/types/books';

const DEFAULT_PAGE_SIZE = 24;
const MAX_PAGE_SIZE = 100;

function applySorting(query: ReturnType<ReturnType<typeof createServerClient>['from']>, sort?: BookSort) {
  switch (sort) {
    case 'price_asc':
      return query.order('price', { ascending: true });
    case 'price_desc':
      return query.order('price', { ascending: false });
    case 'newest':
      return query.order('created_at', { ascending: false });
    case 'alpha':
      return query.order('title', { ascending: true });
    case 'relevance':
    default:
      return query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
  }
}

export default async function getBooks(filters: BookFilters = {}): Promise<BookListResult> {
  const supabase = await createServerClient();

  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, filters.pageSize ?? DEFAULT_PAGE_SIZE));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('books')
    .select('*, categories(id, name, slug)', { count: 'exact' })
    .eq('is_active', true);

  if (filters.categoryIds && filters.categoryIds.length > 0) {
    query = query.in('category_id', filters.categoryIds);
  }

  if (filters.minPrice !== undefined) {
    query = query.gte('price', filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    query = query.lte('price', filters.maxPrice);
  }

  if (filters.availability && filters.availability !== 'all') {
    query = query.eq('stock_status', filters.availability);
  }

  if (filters.search && filters.search.trim()) {
    const searchTerm = filters.search
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
    query = query.textSearch('title', searchTerm, { type: 'websearch', config: 'spanish' });
  }

  query = applySorting(query, filters.sort);

  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    throw new Error(`Error al obtener libros: ${error.message}`);
  }

  const total = count ?? 0;
  const totalPages = Math.ceil(total / pageSize);

  return {
    books: data ?? [],
    total,
    page,
    pageSize,
    totalPages,
  };
}
