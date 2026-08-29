import Link from 'next/link';
import Image from 'next/image';
import type { BookWithCategory } from '@/types/books';

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

export default function BookCard({ book }: { book: BookWithCategory }) {
  const badge = getStatusBadge(book.status);
  const coverImage = book.images[0];

  return (
    <Link
      href={`/libros/${book.slug}`}
      className="group block rounded-xl border border-hl-primary/10 bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-t-xl bg-hl-secondary/5">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={book.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-hl-primary/30">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        )}
        <span className={`absolute top-2 right-2 rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.className}`}>
          {badge.label}
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-hl-primary line-clamp-2 group-hover:text-hl-accent transition-colors">
          {book.title}
        </h3>
        <p className="mt-1 text-xs text-hl-primary/60">{book.author}</p>
        {book.categories && (
          <p className="mt-1 text-xs text-hl-primary/40">{book.categories.name}</p>
        )}
        <p className="mt-2 text-base font-bold text-hl-accent">
          ${book.price.toFixed(2)}
        </p>
      </div>
    </Link>
  );
}
