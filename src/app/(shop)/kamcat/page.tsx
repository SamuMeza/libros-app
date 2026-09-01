import { Suspense } from 'react';
import { getProducts, getProductCategories } from '@/lib/actions/products';
import CatalogFilters from './catalog-filters';
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

        <CatalogFilters
          categories={categories}
          selectedCategoryIds={categoryIds}
          productCounts={productCounts}
          currentSort={sort}
          currentSearch={search}
          currentPage={page}
          totalPages={totalPages}
          total={total}
          products={products}
        />
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
