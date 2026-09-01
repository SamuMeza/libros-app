export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-16">
        <h1
          className="font-bold mb-4"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 'var(--font-h1)' }}
        >
          <span className="text-hl-primary">Hecho Letras</span>
          <span className="text-text-muted mx-2">&amp;</span>
          <span className="text-kc-primary">KamCat</span>
        </h1>
        <p className="text-text-secondary max-w-2xl mx-auto" style={{ fontSize: 'var(--font-body-lg)' }}>
          Libros por encargo y papelería creativa en Venezuela.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <a
          href="/libros"
          className="block p-8 rounded-xl border border-hl-primary/20 bg-hl-primary/5 hover:border-hl-primary/40 transition-colors"
        >
          <h2 className="font-bold text-hl-primary mb-2" style={{ fontSize: 'var(--font-h3)' }}>
            Hecho Letras
          </h2>
          <p className="text-text-secondary text-sm">
            Libros por encargo y stock limitado. Plan de pagos a plazos con cuotas quincenales.
          </p>
        </a>

        <a
          href="/kamcat"
          className="block p-8 rounded-xl border border-kc-primary/20 bg-kc-primary/5 hover:border-kc-primary/40 transition-colors"
        >
          <h2 className="font-bold text-kc-primary mb-2" style={{ fontSize: 'var(--font-h3)' }}>
            KamCat
          </h2>
          <p className="text-text-secondary text-sm">
            Papelería creativa y personalizada bajo pedido.
          </p>
        </a>
      </section>
    </div>
  );
}
