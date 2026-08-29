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
              <li><a href="/" className="hover:text-primary transition-colors">Inicio</a></li>
              <li><a href="/libros" className="hover:text-primary transition-colors">Libros</a></li>
              <li><a href="/papeleria" className="hover:text-primary transition-colors">Papelería</a></li>
              <li><a href="/about" className="hover:text-primary transition-colors">Sobre nosotros</a></li>
              <li><a href="/contact" className="hover:text-primary transition-colors">Contacto</a></li>
            </ul>
          </div>

          {/* Column 3: Policies */}
          <div>
            <h4 className="font-semibold mb-4">Políticas</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/privacy" className="hover:text-primary transition-colors">Privacidad</a></li>
              <li><a href="/terms" className="hover:text-primary transition-colors">Términos</a></li>
              <li><a href="/shipping" className="hover:text-primary transition-colors">Envíos</a></li>
              <li><a href="/returns" className="hover:text-primary transition-colors">Devoluciones</a></li>
            </ul>
          </div>

          {/* Column 4: Social & Contact */}
          <div>
            <h4 className="font-semibold mb-4">Síguenos</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="https://instagram.com" className="hover:text-primary transition-colors">Instagram</a></li>
              <li><a href="https://facebook.com" className="hover:text-primary transition-colors">Facebook</a></li>
              <li><a href="https://tiktok.com" className="hover:text-primary transition-colors">TikTok</a></li>
            </ul>
            <h4 className="font-semibold mt-6 mb-4">Contacto</h4>
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
