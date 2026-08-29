import getBooks from '@/lib/actions/get-books';
import type { BookFilters } from '@/types/books';
import BookCard from '@/components/books/book-card';
import SkeletonBookCard from '@/components/shared/skeleton-book-card';
import EmptyState from '@/components/shared/empty-state';
import FilterSidebar from '@/components/shared/filter-sidebar';
import SearchBar from '@/components/shared/search-bar';
import SortSelector from '@/components/shared/sort-selector';
import Pagination from '@/components/shared/pagination';
import BookRequestForm from '@/components/books/book-request-form';

interface CatalogPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
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

  return (
    <div className="brand-hl">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-hl-primary">Catálogo de Libros</h1>
          <p className="mt-2 text-hl-primary/60">Explora nuestra colección de libros Hecho Letras</p>
        </header>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:max-w-md">
            <SearchBar value={filters.search ?? ''} onSearch={() => {}} />
          </div>
          <SortSelector value={filters.sort ?? 'relevance'} onChange={() => {}} />
        </div>

        <div className="flex gap-8">
          <FilterSidebar
            categories={[]}
            filters={filters}
            onFilterChange={() => {}}
            isOpen={false}
            onClose={() => {}}
          />

          <main className="flex-1">
            {error ? (
              <EmptyState
                message="Hubo un error al cargar el catálogo. Por favor, intenta de nuevo."
                suggestions={['Verifica tu conexión a internet', 'Recarga la página']}
              />
            ) : result.books.length === 0 ? (
              <EmptyState
                message="No encontramos libros que coincidan con tu búsqueda."
                suggestions={[
                  'Intenta con otros filtros',
                  'Revisa la ortografía del término de búsqueda',
                  'Explora todas las categorías disponibles',
                ]}
              />
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {result.books.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>

                <div className="mt-8">
                  <Pagination
                    page={result.page}
                    totalPages={result.totalPages}
                    onPageChange={() => {}}
                    total={result.total}
                    pageSize={result.pageSize}
                  />
                </div>
              </>
            )}

            <section className="mt-12 rounded-xl border border-hl-primary/10 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-hl-primary">¿No encuentras tu libro?</h2>
              <p className="mt-2 text-sm text-hl-primary/60">
                Si el libro que buscas no está en nuestro catálogo, envíanos una solicitud y lo buscaremos para ti.
              </p>
              <div className="mt-4">
                <BookRequestForm />
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
