'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { HeaderProps } from '@/types';

const NAV_ITEMS = [
  { label: 'Libros', href: '/libros', brand: 'hl' as Brand },
  { label: 'Papelería', href: '/papeleria', brand: 'kc' as Brand },
  { label: 'Novedades', href: '/novedades', brand: null },
  { label: 'Ofertas', href: '/ofertas', brand: null },
];

export default function Header({ cartCount = 0 }: HeaderProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('theme-preference');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setIsDark(parsed.mode === 'dark');
      } catch {
        setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
      }
    } else {
      setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  const toggleDrawer = useCallback(() => {
    setIsDrawerOpen((prev) => !prev);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    hamburgerRef.current?.focus();
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      const theme = next ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', theme);
      try {
        localStorage.setItem(
          'theme-preference',
          JSON.stringify({ mode: theme, timestamp: Date.now() })
        );
      } catch {
        // fail silently
      }
      return next;
    });
  }, []);

  // Close drawer on Escape
  useEffect(() => {
    if (!isDrawerOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeDrawer();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  // Trap focus in drawer
  useEffect(() => {
    if (!isDrawerOpen || !drawerRef.current) return;

    const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
      'a, button, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement?.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [isDrawerOpen]);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center border-b backdrop-blur-md theme-transition"
      style={{
        height: '4rem',
        backgroundColor: 'color-mix(in srgb, var(--bg-primary) 95%, transparent)',
        borderColor: 'var(--border)',
        paddingLeft: 'var(--space-6)',
        paddingRight: 'var(--space-6)',
      }}
      role="banner"
    >
      {/* Hamburger (mobile) */}
      <button
        ref={hamburgerRef}
        className="flex items-center justify-center md:hidden"
        onClick={toggleDrawer}
        aria-label={isDrawerOpen ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={isDrawerOpen}
        aria-controls="mobile-drawer"
        style={{ width: '2.5rem', height: '2.5rem' }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          {isDrawerOpen ? (
            <>
              <line x1="4" y1="4" x2="16" y2="16" />
              <line x1="16" y1="4" x2="4" y2="16" />
            </>
          ) : (
            <>
              <line x1="2" y1="5" x2="18" y2="5" />
              <line x1="2" y1="10" x2="18" y2="10" />
              <line x1="2" y1="15" x2="18" y2="15" />
            </>
          )}
        </svg>
      </button>

      {/* Branding */}
      <a href="/" className="flex items-center" aria-label="Hecho Letras y KamCat - Inicio">
          <span className="hidden md:inline font-bold text-hl-primary" style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 'var(--font-h3)' }}>
            Hecho Letras
          </span>
          <span className="hidden md:inline text-text-muted mx-1" style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 'var(--font-h3)' }}>
            &amp;
          </span>
          <span className="hidden md:inline font-bold text-kc-primary" style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 'var(--font-h3)' }}>
            KamCat
          </span>
          <span className="md:hidden font-bold text-hl-primary" style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 'var(--font-h3)' }}>
            HL
          </span>
          <span className="md:hidden text-text-muted" style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 'var(--font-h3)', margin: '0 0.15em' }}>
            &amp;
          </span>
          <span className="md:hidden font-bold text-kc-primary" style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 'var(--font-h3)' }}>
            KC
          </span>
      </a>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-8 mx-auto" aria-label="Navegación principal">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="relative py-1 transition-colors"
            style={{
              fontFamily: 'var(--font-inter), sans-serif',
              fontSize: 'var(--font-nav)',
              fontWeight: 500,
              color: 'var(--text-secondary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            {item.label}
          </a>
        ))}
      </nav>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center transition-colors"
          style={{ width: '2.5rem', height: '2.5rem', color: 'var(--text-secondary)' }}
          aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {isDark ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        {/* Search */}
        <button
          className="flex items-center justify-center transition-colors hidden sm:flex"
          style={{ width: '2.5rem', height: '2.5rem', color: 'var(--text-secondary)' }}
          aria-label="Buscar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>

        {/* Favorites */}
        <button
          className="flex items-center justify-center transition-colors hidden sm:flex"
          style={{ width: '2.5rem', height: '2.5rem', color: 'var(--text-secondary)' }}
          aria-label="Favoritos"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Account */}
        <button
          className="flex items-center justify-center transition-colors hidden sm:flex"
          style={{ width: '2.5rem', height: '2.5rem', color: 'var(--text-secondary)' }}
          aria-label="Mi cuenta"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </button>

        {/* Cart */}
        <button
          className="relative flex items-center justify-center transition-colors"
          style={{ width: '2.5rem', height: '2.5rem', color: 'var(--text-secondary)' }}
          aria-label={`Carrito de compras, ${cartCount} artículos`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          {cartCount > 0 && (
            <span
              className="absolute flex items-center justify-center rounded-full"
              style={{
                top: '-0.25rem',
                right: '-0.25rem',
                minWidth: '1.125rem',
                height: '1.125rem',
                padding: '0 0.25rem',
                fontSize: 'var(--font-badge)',
                fontWeight: 600,
                backgroundColor: 'var(--hl-accent)',
                color: 'var(--text-primary)',
              }}
              aria-hidden="true"
            >
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden"
          style={{ top: '4rem', zIndex: 40 }}
          onClick={closeDrawer}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <div
        id="mobile-drawer"
        ref={drawerRef}
        className="fixed top-0 right-0 h-full md:hidden theme-transition"
        style={{
          width: '75vw',
          maxWidth: '20rem',
          zIndex: 50,
          backgroundColor: 'var(--bg-primary)',
          boxShadow: 'var(--shadow-lg)',
          transform: isDrawerOpen ? 'translateX(0)' : 'translateX(100%)',
          paddingTop: '4rem',
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
      >
        <nav className="flex flex-col p-6 gap-1" aria-label="Navegación móvil">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="py-3 px-4 rounded-lg transition-colors"
              style={{
                fontSize: 'var(--font-body)',
                fontWeight: 500,
                color: 'var(--text-secondary)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
