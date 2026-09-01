import { Suspense } from 'react';
import type { Metadata } from 'next';
import getBooks from '@/lib/actions/get-books';
import { createClient } from '@/lib/supabase/server';
import type { BookFilters } from '@/types/books';
import BookCard from '@/components/books/book-card';
import EmptyState from '@/components/shared/empty-state';
import SkeletonBookCard from '@/components/shared/skeleton-book-card';
import BookRequestForm from '@/components/books/book-request-form';
import CatalogClient from '@/components/books/catalog-client';

export const metadata: Metadata = {
  title: 'Libros — Hecho Letras',
  description: 'Explora nuestro catálogo de libros. Encuentra títulos por género, precio y disponibilidad. Envíos a toda Venezuela.',
};

interface CatalogPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

async function getCategoriesWithCount() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('categories')
    .select('id, name')
    .eq('brand', 'hl')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (!data) return [];

  const categories = await Promise.all(
    data.map(async (cat) => {
      const { count } = await supabase
        .from('books')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', cat.id)
        .eq('is_active', true);
      return { id: cat.id, name: cat.name, count: count ?? 0 };
    })
  );

  return categories.filter((c) => c.count > 0);
}

function CatalogSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 24 }).map((_, i) => (
        <SkeletonBookCard key={i} />
      ))}
    </div>
  );
}

async function CatalogContent({ searchParams }: CatalogPageProps) {
  const params = await searchParams;

  const filters: BookFilters = {
    categoryIds: params.category ? (Array.isArray(params.category) ? params.category : params.category.split(',').filter(Boolean)) : undefined,
    minPrice: params.minPrice ? parseFloat(params.minPrice as string) : undefined,
    maxPrice: params.maxPrice ? parseFloat(params.maxPrice as string) : undefined,
    availability: (params.availability as BookFilters['availability']) ?? 'all',
    search: params.q as string | undefined,
    sort: (params.sort as BookFilters['sort']) ?? 'relevance',
    page: params.page ? parseInt(params.page as string, 10) : 1,
  };

  let result;
  let error = false;

  try {
    result = await getBooks(filters);
  } catch {
    error = true;
    result = { books: [], total: 0, page: 1, pageSize: 24, totalPages: 0 };
  }

  const categories = await getCategoriesWithCount();

  if (error) {
    return (
      <EmptyState
        message="No pudimos cargar el catálogo. Verifica tu conexión e intenta de nuevo."
        suggestions={['Recarga la página', 'Verifica tu conexión a internet']}
        action={{ label: 'Reintentar', href: '/libros' }}
      />
    );
  }

  if (result.books.length === 0) {
    return (
      <EmptyState
        message="No encontramos libros que coincidan con tu búsqueda."
        suggestions={[
          'Intenta con otros filtros',
          'Revisa la ortografía del término de búsqueda',
          'Explora todas las categorías disponibles',
        ]}
        action={{ label: 'Limpiar filtros', href: '/libros' }}
      />
    );
  }

  const bookCards = result.books.map((book) => (
    <BookCard key={book.id} book={book} />
  ));

  return (
    <CatalogClient
      filters={filters}
      result={{ ...result, books: bookCards }}
      categories={categories}
    />
  );
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  return (
    <div className="brand-hl">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-hl-primary">Catálogo de Libros</h1>
          <p className="mt-2 text-hl-primary/60">Explora nuestra colección de libros Hecho Letras</p>
        </header>

        <Suspense fallback={<CatalogSkeleton />}>
          <CatalogContent searchParams={searchParams} />
        </Suspense>

        <section className="mt-12 rounded-xl border border-hl-primary/10 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-hl-primary">¿No encuentras tu libro?</h2>
          <p className="mt-2 text-sm text-hl-primary/60">
            Si el libro que buscas no está en nuestro catálogo, envíanos una solicitud y lo buscaremos para ti.
          </p>
          <div className="mt-4">
            <BookRequestForm />
          </div>
        </section>
      </div>
    </div>
  );
}
