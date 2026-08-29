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
      // ARRANGE & ACT
      render(<Header />);

      // ASSERT
      const hlText = screen.getByText('Hecho Letras');
      expect(hlText).toBeInTheDocument();
      expect(hlText).toHaveClass('text-hl-primary');
    });

    it('should render "KamCat" with KC primary color class', () => {
      // ARRANGE & ACT
      render(<Header />);

      // ASSERT
      const kcText = screen.getByText('KamCat');
      expect(kcText).toBeInTheDocument();
      expect(kcText).toHaveClass('text-kc-primary');
    });
  });

  describe('Desktop Navigation', () => {
    it('should render all navigation items in desktop nav', () => {
      // ARRANGE
      render(<Header />);
      const nav = screen.getByRole('navigation', { name: /navegación principal/i });

      // ACT & ASSERT
      expect(within(nav).getByText('Libros')).toBeInTheDocument();
      expect(within(nav).getByText('Papelería')).toBeInTheDocument();
      expect(within(nav).getByText('Novedades')).toBeInTheDocument();
      expect(within(nav).getByText('Ofertas')).toBeInTheDocument();
    });

    it('should have correct href for Libros in desktop nav', () => {
      // ARRANGE
      render(<Header />);
      const nav = screen.getByRole('navigation', { name: /navegación principal/i });

      // ACT & ASSERT
      const librosLink = within(nav).getByText('Libros').closest('a');
      expect(librosLink).toHaveAttribute('href', '/libros');
    });

    it('should have correct href for Papelería in desktop nav', () => {
      // ARRANGE
      render(<Header />);
      const nav = screen.getByRole('navigation', { name: /navegación principal/i });

      // ACT & ASSERT
      const pапеleriaLink = within(nav).getByText('Papelería').closest('a');
      expect(pапеleriaLink).toHaveAttribute('href', '/papeleria');
    });
  });

  describe('Cart Badge', () => {
    it('should show cart badge when count > 0', () => {
      // ARRANGE & ACT
      render(<Header cartCount={3} />);

      // ASSERT
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('should not show cart badge when count is 0', () => {
      // ARRANGE & ACT
      render(<Header cartCount={0} />);

      // ASSERT
      const cartButton = screen.getByRole('button', { name: /carrito/i });
      expect(cartButton).not.toHaveTextContent('0');
    });

    it('should have correct aria-label with count', () => {
      // ARRANGE & ACT
      render(<Header cartCount={5} />);

      // ASSERT
      const cartButton = screen.getByRole('button', { name: /5 artículos/i });
      expect(cartButton).toBeInTheDocument();
    });
  });

  describe('Mobile Drawer', () => {
    it('should have hamburger button on mobile', () => {
      // ARRANGE & ACT
      render(<Header />);

      // ASSERT
      const hamburger = screen.getByRole('button', { name: /abrir menú/i });
      expect(hamburger).toBeInTheDocument();
    });

    it('should toggle drawer on hamburger click', () => {
      // ARRANGE
      render(<Header />);
      const hamburger = screen.getByRole('button', { name: /abrir menú/i });

      // ACT
      fireEvent.click(hamburger);

      // ASSERT
      expect(screen.getByRole('button', { name: /cerrar menú/i })).toBeInTheDocument();
    });

    it('should close drawer on Escape key', () => {
      // ARRANGE
      render(<Header />);
      const hamburger = screen.getByRole('button', { name: /abrir menú/i });
      fireEvent.click(hamburger);

      // ACT
      fireEvent.keyDown(document, { key: 'Escape' });

      // ASSERT
      expect(screen.queryByRole('button', { name: /cerrar menú/i })).not.toBeInTheDocument();
    });
  });

  describe('Theme Toggle', () => {
    it('should have theme toggle button', () => {
      // ARRANGE & ACT
      render(<Header />);

      // ASSERT
      const themeButton = screen.getByRole('button', { name: /modo/i });
      expect(themeButton).toBeInTheDocument();
    });

    it('should toggle theme on click', () => {
      // ARRANGE
      render(<Header />);
      const themeButton = screen.getByRole('button', { name: /modo oscuro/i });

      // ACT
      fireEvent.click(themeButton);

      // ASSERT
      expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    });
  });

  describe('Accessibility', () => {
    it('should have banner role', () => {
      // ARRANGE & ACT
      render(<Header />);

      // ASSERT
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('should have navigation landmark', () => {
      // ARRANGE & ACT
      render(<Header />);

      // ASSERT
      expect(screen.getByRole('navigation', { name: /navegación principal/i })).toBeInTheDocument();
    });

    it('should have aria-label on branding link', () => {
      // ARRANGE & ACT
      render(<Header />);

      // ASSERT
      const brandLink = screen.getByRole('link', { name: /hecho letras y kamcat/i });
      expect(brandLink).toHaveAttribute('href', '/');
    });
  });

  describe('Fixed Positioning', () => {
    it('should have fixed position', () => {
      // ARRANGE & ACT
      render(<Header />);

      // ASSERT
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('fixed');
    });
  });
});
