import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getProductBySlug } from '@/lib/actions/products';
import VariantSelector from '@/components/products/variant-selector';
import CustomizationForm from '@/components/products/customization-form';
import PriceDisplay from '@/components/products/price-display';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getProductBySlug(slug);
  const product = result.success ? result.data : null;

  if (!product) {
    return { title: 'Producto no encontrado - KamCat' };
  }

  return {
    title: `${product.name} - KamCat`,
    description: product.description || `Compra ${product.name} en KamCat`,
    openGraph: {
      title: `${product.name} - KamCat`,
      description: product.description || `Compra ${product.name} en KamCat`,
      images: product.images[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const result = await getProductBySlug(slug);

  if (!result.success || !result.data) {
    notFound();
  }

  const product = result.data;
  const hasCustomization = product.customization_options.length > 0;

  return (
    <div className="brand-kc">
      <div className="mx-auto max-w-[1200px] px-4 py-8">
        <nav
          className="mb-8 text-sm text-muted-foreground"
          aria-label="Breadcrumb"
        >
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link href="/" className="hover:text-foreground">
                Inicio
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/kamcat" className="hover:text-foreground">
                KamCat
              </Link>
            </li>
            {product.category && (
              <>
                <li aria-hidden="true">/</li>
                <li>
                  <Link
                    href={`/kamcat?category=${product.category.id}`}
                    className="hover:text-foreground"
                  >
                    {product.category.name}
                  </Link>
                </li>
              </>
            )}
            <li aria-hidden="true">/</li>
            <li className="text-foreground" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <div className="relative mb-4 aspect-[2/3] overflow-hidden rounded-xl shadow-lg">
              <Image
                src={product.images[0] || '/placeholder-product.png'}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="relative h-20 w-20 overflow-hidden rounded-lg border-2 border-border transition-colors hover:border-[var(--kc-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kc-primary)]"
                    aria-label={`Ver imagen ${idx + 1}`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} - imagen ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <span className="mb-2 inline-block rounded-full bg-[var(--kc-primary)]/10 px-3 py-1 text-xs font-medium text-[var(--kc-primary)]">
              KamCat
            </span>

            <h1 className="mb-2 text-3xl font-bold text-foreground">
              {product.name}
            </h1>

            <p className="mb-4 text-muted-foreground">
              {product.description || 'Sin descripción disponible'}
            </p>

            <div className="mb-6">
              <span className="inline-block rounded-full bg-[var(--kc-accent)]/10 px-2 py-0.5 text-xs text-[var(--kc-accent)]">
                {hasCustomization ? 'Personalizable' : 'Producto Estándar'}
              </span>
            </div>

            <PriceDisplay
              basePrice={Number(product.price)}
              productId={product.id}
              variants={product.variants}
            />

            <VariantSelector variants={product.variants} />

            {hasCustomization && (
              <CustomizationForm
                options={product.customization_options}
              />
            )}

            <button
              type="button"
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--kc-primary)] px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-[var(--kc-primary)]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kc-primary)] focus-visible:ring-offset-2"
              aria-label="Agregar al carrito"
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Agregar al carrito
            </button>

            <div className="mt-6 rounded-lg border border-border p-4">
              <h3 className="mb-2 text-sm font-semibold text-foreground">
                Información de envío
              </h3>
              <p className="text-sm text-muted-foreground">
                Envío disponible a través de MRW y Zoom. El costo se calculará
                al finalizar la compra según tu ubicación.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
