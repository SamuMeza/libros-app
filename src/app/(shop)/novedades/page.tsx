import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Novedades — Hecho Letras & KamCat',
  description: 'Descubre los últimos títulos y productos añadidos a nuestro catálogo.',
};

export default function NovedadesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Novedades</h1>
        <p className="mt-2 text-muted-foreground">
          Los últimos títulos y productos añadidos a nuestro catálogo.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 text-center">
          <h2 className="text-xl font-semibold text-hl-primary">Libros nuevos</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Explora los últimos libros añadidos al catálogo de Hecho Letras.
          </p>
          <Link
            href="/libros?sort=newest"
            className="mt-4 inline-block rounded-lg bg-hl-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hl-primary/90"
          >
            Ver novedades de libros
          </Link>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 text-center">
          <h2 className="text-xl font-semibold text-kc-primary">Papelería nueva</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Descubre los nuevos productos de papelería creativa KamCat.
          </p>
          <Link
            href="/kamcat?sort=newest"
            className="mt-4 inline-block rounded-lg bg-kc-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-kc-primary/90"
          >
            Ver novedades de papelería
          </Link>
        </div>
      </div>
    </div>
  );
}
