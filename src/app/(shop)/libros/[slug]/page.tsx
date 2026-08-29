import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import getBookBySlug from '@/lib/actions/get-book-by-slug';
import getBookExtras from '@/lib/actions/get-book-extras';
import BookGallery from '@/components/books/book-gallery';
import BookExtras from '@/components/books/book-extras';
import BookQuantity from '@/components/books/book-quantity';
import BookAccordions from '@/components/books/book-accordions';
import Breadcrumb from '@/components/ui/breadcrumb';

interface BookDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BookDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const book = await getBookBySlug(slug);

  if (!book) {
    return { title: 'Libro no encontrado — Hecho Letras' };
  }

  const description = book.description
    ? book.description.slice(0, 160)
    : `${book.title} de ${book.author} disponible en Hecho Letras`;

  return {
    title: `${book.title} — Hecho Letras`,
    description,
    openGraph: {
      title: book.title,
      description,
      images: book.images[0] ? [{ url: book.images[0] }] : [],
      type: 'website',
    },
  };
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { slug } = await params;
  const book = await getBookBySlug(slug);

  if (!book) notFound();

  const extras = await getBookExtras(book.id);

  function getStatusBadge(status: string) {
    switch (status) {
      case 'available':
        return { label: 'Disponible', className: 'bg-green-100 text-green-800' };
      case 'pre_order':
        return { label: 'Pre-venta', className: 'bg-yellow-100 text-yellow-800' };
      case 'out_of_stock':
        return { label: 'Agotado', className: 'bg-red-100 text-red-800' };
      default:
        return { label: status, className: 'bg-gray-100 text-gray-800' };
    }
  }

  const badge = getStatusBadge(book.status);

  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Libros', href: '/libros' },
    ...(book.categories ? [{ label: book.categories.name, href: `/libros?category=${book.categories.id}` }] : []),
    { label: book.title },
  ];

  return (
    <div className="brand-hl">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} />

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr,1fr]">
          <BookGallery images={book.images} title={book.title} />

          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-hl-primary">{book.title}</h1>
              <p className="mt-1 text-sm text-hl-primary/60">por {book.author}</p>
              {book.categories && (
                <p className="mt-1 text-xs text-hl-primary/40">{book.categories.name}</p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-hl-accent">${book.price.toFixed(2)}</span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.className}`}>
                {badge.label}
              </span>
            </div>

            {book.description && (
              <div className="max-w-[65ch] text-sm text-hl-primary/70 leading-relaxed">
                <h2 className="mb-2 font-semibold text-hl-primary">Sinopsis</h2>
                <p>{book.description}</p>
              </div>
            )}

            <div className="rounded-xl border border-hl-primary/10 bg-hl-secondary/5 p-4">
              <h2 className="mb-3 text-sm font-semibold text-hl-primary">Ficha técnica</h2>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                {book.editorial && (
                  <>
                    <dt className="text-hl-primary/50">Editorial</dt>
                    <dd className="text-hl-primary">{book.editorial}</dd>
                  </>
                )}
                {book.pages && (
                  <>
                    <dt className="text-hl-primary/50">Páginas</dt>
                    <dd className="text-hl-primary">{book.pages}</dd>
                  </>
                )}
                {book.language && (
                  <>
                    <dt className="text-hl-primary/50">Idioma</dt>
                    <dd className="text-hl-primary">{book.language}</dd>
                  </>
                )}
                {book.binding && (
                  <>
                    <dt className="text-hl-primary/50">Encuadernación</dt>
                    <dd className="text-hl-primary">{book.binding}</dd>
                  </>
                )}
                <dt className="text-hl-primary/50">Entrega estimada</dt>
                <dd className="text-hl-primary">{book.delivery_days} días hábiles</dd>
              </dl>
            </div>

            <div className="space-y-4">
              <div>
                <h2 className="mb-2 text-sm font-semibold text-hl-primary">Extras</h2>
                <BookExtras
                  extras={extras}
                  selectedExtras={extras.filter((e) => e.is_default).map((e) => e.id)}
                  onSelectionChange={() => {}}
                />
              </div>

              <div>
                <h2 className="mb-2 text-sm font-semibold text-hl-primary">Cantidad</h2>
                <BookQuantity value={1} onChange={() => {}} />
              </div>

              <button
                disabled={book.status === 'out_of_stock'}
                className="w-full rounded-xl bg-hl-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-hl-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {book.status === 'out_of_stock' ? 'Agotado' : 'Agregar al carrito'}
              </button>
            </div>

            <BookAccordions />
          </div>
        </div>
      </div>
    </div>
  );
}
