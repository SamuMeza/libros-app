'use client';

import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="w-full border-t border-border bg-background pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Branding */}
          <div>
            <h3 className="text-lg font-bold mb-4">
              <span className="text-hl-primary">Hecho Letras</span>
              <span className="text-kc-primary ml-2">KamCat</span>
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Libros por encargo y papelería creativa en Venezuela.
            </p>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Hecho Letras & KamCat
            </p>
          </div>

          {/* Column 2: Links */}
          <div>
            <h4 className="font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Inicio</Link></li>
              <li><Link href="/libros" className="hover:text-primary transition-colors">Libros</Link></li>
              <li><Link href="/kamcat" className="hover:text-primary transition-colors">Papelería</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contacto</Link></li>
              {/* TODO: Descomentar cuando las páginas estén implementadas */}
              {/* <li><Link href="/about" className="hover:text-primary transition-colors">Sobre nosotros</Link></li> */}
              {/* <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacidad</Link></li> */}
              {/* <li><Link href="/terms" className="hover:text-primary transition-colors">Términos</Link></li> */}
              {/* <li><Link href="/shipping" className="hover:text-primary transition-colors">Envíos</Link></li> */}
              {/* <li><Link href="/returns" className="hover:text-primary transition-colors">Devoluciones</Link></li> */}
            </ul>
          </div>

          {/* Column 3: Social & Contact */}
          <div>
            <h4 className="font-semibold mb-4">Síguenos</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Instagram</a></li>
              <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Facebook</a></li>
              <li><a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">TikTok</a></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>+58 414 123 4567</li>
              <li>+58 424 987 6543</li>
              <li>info@hechoyletras.com</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
