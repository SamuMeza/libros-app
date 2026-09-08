import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contacto — Hecho Letras & KamCat',
  description: 'Ponte en contacto con nosotros. Estamos aquí para ayudarte.',
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Contacto</h1>
        <p className="mt-2 text-muted-foreground">
          Estamos aquí para ayudarte. Escríbenos por cualquiera de estos medios.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Información de contacto */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Información de contacto</h2>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li className="flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-hl-primary shrink-0">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <div>
                <p className="font-medium text-foreground">Teléfono</p>
                <p>+58 414 123 4567</p>
                <p>+58 424 987 6543</p>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-hl-primary shrink-0">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <div>
                <p className="font-medium text-foreground">Email</p>
                <p>info@hechoyletras.com</p>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-hl-primary shrink-0">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div>
                <p className="font-medium text-foreground">Ubicación</p>
                <p>Venezuela</p>
              </div>
            </li>
          </ul>

          <div className="mt-6">
            <h3 className="font-medium text-foreground mb-2">Síguenos</h3>
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-hl-primary transition-colors" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-hl-primary transition-colors" aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-hl-primary transition-colors" aria-label="TikTok">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Formulario de contacto */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Envíanos un mensaje</h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                Nombre
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-hl-primary focus:outline-none focus:ring-1 focus:ring-hl-primary"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-hl-primary focus:outline-none focus:ring-1 focus:ring-hl-primary"
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-1">
                Asunto
              </label>
              <select
                id="subject"
                name="subject"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-hl-primary focus:outline-none focus:ring-1 focus:ring-hl-primary"
              >
                <option value="general">Consulta general</option>
                <option value="books">Hecho Letras — Libros</option>
                <option value="kamcat">KamCat — Papelería</option>
                <option value="order">Estado de pedido</option>
                <option value="other">Otro</option>
              </select>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">
                Mensaje
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-hl-primary focus:outline-none focus:ring-1 focus:ring-hl-primary resize-none"
                placeholder="¿En qué podemos ayudarte?"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-hl-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hl-primary/90"
            >
              Enviar mensaje
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
