import Link from 'next/link';

export default function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="mb-4 h-16 w-16 text-muted-foreground"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      <h3 className="mb-2 text-xl font-semibold text-foreground">Tu carrito está vacío</h3>
      <p className="mb-6 text-center text-muted-foreground">
        Explora nuestros catálogos y encuentra productos increíbles
      </p>
      <div className="flex gap-4">
        <Link
          href="/libros"
          className="rounded-lg bg-[var(--hl-primary)] px-6 py-3 font-semibold text-white transition-colors hover:bg-[var(--hl-primary)]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hl-primary)] focus-visible:ring-offset-2"
        >
          Hecho Letras
        </Link>
        <Link
          href="/kamcat"
          className="rounded-lg bg-[var(--kc-primary)] px-6 py-3 font-semibold text-white transition-colors hover:bg-[var(--kc-primary)]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--kc-primary)] focus-visible:ring-offset-2"
        >
          KamCat
        </Link>
      </div>
    </div>
  );
}
