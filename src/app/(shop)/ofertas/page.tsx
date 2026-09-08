import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Ofertas — Hecho Letras & KamCat',
  description: 'Aprovecha las ofertas y descuentos especiales en libros y papelería.',
};

export default function OfertasPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Ofertas</h1>
        <p className="mt-2 text-muted-foreground">
          Aprovecha los descuentos especiales en nuestra tienda.
        </p>
      </header>

      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <h2 className="text-xl font-semibold text-foreground">Próximamente</h2>
        <p className="mt-2 text-muted-foreground">
          Estamos preparando ofertas especiales para ti. Vuelve pronto para descubrir descuentos en libros y papelería.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link
            href="/libros"
            className="rounded-lg bg-hl-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hl-primary/90"
          >
            Explorar libros
          </Link>
          <Link
            href="/kamcat"
            className="rounded-lg bg-kc-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-kc-primary/90"
          >
            Explorar papelería
          </Link>
        </div>
      </div>
    </div>
  );
}
