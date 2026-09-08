import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Header from '@/components/layout/header';

describe('Header Component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('Branding', () => {
    it('should render "Hecho Letras" with HL primary color class', () => {
      render(<Header />);
      const hlText = screen.getByText('Hecho Letras');
      expect(hlText).toBeInTheDocument();
      expect(hlText).toHaveClass('text-hl-primary');
    });

    it('should render "KamCat" with KC primary color class', () => {
      render(<Header />);
      const kcText = screen.getByText('KamCat');
      expect(kcText).toBeInTheDocument();
      expect(kcText).toHaveClass('text-kc-primary');
    });
  });

  describe('Desktop Navigation', () => {
    it('should render navigation items in desktop nav', () => {
      render(<Header />);
      const nav = screen.getByRole('navigation', { name: /navegación principal/i });

      expect(within(nav).getByText('Libros')).toBeInTheDocument();
      expect(within(nav).getByText('Papelería')).toBeInTheDocument();
    });

    it('should have correct href for Libros in desktop nav', () => {
      render(<Header />);
      const nav = screen.getByRole('navigation', { name: /navegación principal/i });

      const librosLink = within(nav).getByText('Libros').closest('a');
      expect(librosLink).toHaveAttribute('href', '/libros');
    });

    it('should have correct href for Papelería in desktop nav', () => {
      render(<Header />);
      const nav = screen.getByRole('navigation', { name: /navegación principal/i });

      const pапеleriaLink = within(nav).getByText('Papelería').closest('a');
      expect(pапеleriaLink).toHaveAttribute('href', '/kamcat');
    });
  });

  describe('Cart Badge', () => {
    it('should show cart badge when count > 0', () => {
      render(<Header cartCount={3} />);
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('should not show cart badge when count is 0', () => {
      render(<Header cartCount={0} />);
      const cartLink = screen.getByRole('link', { name: /carrito/i });
      expect(cartLink).not.toHaveTextContent('0');
    });

    it('should have correct aria-label with count', () => {
      render(<Header cartCount={5} />);
      const cartLink = screen.getByRole('link', { name: /5 artículos/i });
      expect(cartLink).toBeInTheDocument();
    });
  });

  describe('Mobile Drawer', () => {
    it('should have hamburger button on mobile', () => {
      render(<Header />);
      const hamburger = screen.getByRole('button', { name: /abrir menú/i });
      expect(hamburger).toBeInTheDocument();
    });

    it('should toggle drawer on hamburger click', () => {
      render(<Header />);
      const hamburger = screen.getByRole('button', { name: /abrir menú/i });

      fireEvent.click(hamburger);

      expect(screen.getByRole('button', { name: /cerrar menú/i })).toBeInTheDocument();
    });

    it('should close drawer on Escape key', () => {
      render(<Header />);
      const hamburger = screen.getByRole('button', { name: /abrir menú/i });
      fireEvent.click(hamburger);

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(screen.queryByRole('button', { name: /cerrar menú/i })).not.toBeInTheDocument();
    });
  });

  describe('Theme Toggle', () => {
    it('should have theme toggle button', () => {
      render(<Header />);
      const themeButton = screen.getByRole('button', { name: /modo/i });
      expect(themeButton).toBeInTheDocument();
    });

    it('should toggle theme on click', () => {
      render(<Header />);
      const themeButton = screen.getByRole('button', { name: /modo oscuro/i });

      fireEvent.click(themeButton);

      expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    });
  });

  describe('Accessibility', () => {
    it('should have banner role', () => {
      render(<Header />);
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('should have navigation landmark', () => {
      render(<Header />);
      expect(screen.getByRole('navigation', { name: /navegación principal/i })).toBeInTheDocument();
    });

    it('should have aria-label on branding link', () => {
      render(<Header />);
      const brandLink = screen.getByRole('link', { name: /hecho letras y kamcat/i });
      expect(brandLink).toHaveAttribute('href', '/');
    });
  });

  describe('Fixed Positioning', () => {
    it('should have fixed position', () => {
      render(<Header />);
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('fixed');
    });
  });
});
