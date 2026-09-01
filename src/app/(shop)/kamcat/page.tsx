import { Suspense } from 'react';
import { getProducts, getProductCategories } from '@/lib/actions/products';
import ProductCard from '@/components/products/product-card';
import FilterSidebar from '@/components/shared/filter-sidebar';
import Pagination from '@/components/shared/pagination';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KamCat - Papelería Creativa y Personalizada',
  description:
    'Explora nuestra colección de papelería creativa: stickers, photocards, posters, llaveros, pins y más. Personaliza tus productos favoritos.',
  openGraph: {
    title: 'KamCat - Papelería Creativa y Personalizada',
    description:
      'Explora nuestra colección de papelería creativa: stickers, photocards, posters, llaveros, pins y más.',
    type: 'website',
  },
};

interface KamCatPageProps {
  searchParams: Promise<{
    category?: string | string[];
    search?: string;
    sort?: string;
    page?: string;
  }>;
}

async function KamCatCatalog({ searchParams }: KamCatPageProps) {
  const params = await searchParams;
  const categoryIds = params.category
    ? Array.isArray(params.category)
      ? params.category
      : [params.category]
    : [];

  const page = parseInt(params.page || '1', 10);
  const sort = (params.sort as 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'alpha') || 'relevance';
  const search = params.search || '';

  const [productsResult, categoriesResult] = await Promise.all([
    getProducts({
      categoryIds,
      search,
      sort,
      page,
      pageSize: 24,
    }),
    getProductCategories(),
  ]);

  const products = productsResult.success ? productsResult.data?.products || [] : [];
  const total = productsResult.success ? productsResult.data?.total || 0 : 0;
  const totalPages = productsResult.success ? productsResult.data?.totalPages || 0 : 0;
  const categories = categoriesResult.success ? categoriesResult.data || [] : [];

  const productCounts = new Map(
    categories.map((c) => [c.id, c.productCount])
  );

  return (
    <div className="brand-kc">
      <div className="mx-auto max-w-[1200px] px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">KamCat</h1>
          <p className="mt-2 text-muted-foreground">
            Papelería creativa y personalizada
          </p>
        </div>

        <div className="flex gap-8">
          <FilterSidebar
            categories={categories.map((c) => ({
              ...c,
              brand: 'kc' as const,
              description: null,
              image_url: null,
              created_at: '',
            }))}
            selectedCategoryIds={categoryIds}
            onCategoryChange={() => {}}
            productCounts={productCounts}
          />

          <main className="flex-1">
            <div className="mb-6 flex items-center justify-between">
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
                currentPage={page}
                totalPages={totalPages}
                onPageChange={() => {}}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function KamCatPage({ searchParams }: KamCatPageProps) {
  return (
    <Suspense
      fallback={
        <div className="brand-kc">
          <div className="mx-auto max-w-[1200px] px-4 py-8">
            <div className="mb-8">
              <div className="h-8 w-32 animate-pulse rounded bg-muted" />
              <div className="mt-2 h-4 w-48 animate-pulse rounded bg-muted" />
            </div>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-xl border border-border p-4"
                >
                  <div className="mb-4 aspect-[2/3] rounded-lg bg-muted" />
                  <div className="mb-2 h-4 w-3/4 rounded bg-muted" />
                  <div className="mb-2 h-3 w-1/2 rounded bg-muted" />
                  <div className="h-5 w-16 rounded bg-muted" />
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <KamCatCatalog searchParams={searchParams} />
    </Suspense>
  );
}
