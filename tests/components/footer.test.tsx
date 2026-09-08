import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Footer from '@/components/layout/footer';

describe('Footer Component', () => {
  describe('Branding', () => {
    it('should render "Hecho Letras" with HL primary color class', () => {
      render(<Footer />);
      const hlText = screen.getByText('Hecho Letras');
      expect(hlText).toBeInTheDocument();
      expect(hlText).toHaveClass('text-hl-primary');
    });

    it('should render "KamCat" with KC primary color class', () => {
      render(<Footer />);
      const kcText = screen.getByText('KamCat');
      expect(kcText).toBeInTheDocument();
      expect(kcText).toHaveClass('text-kc-primary');
    });

    it('should render copyright with current year', () => {
      render(<Footer />);
      const year = new Date().getFullYear().toString();
      expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
    });
  });

  describe('Navigation Links', () => {
    it('should render Inicio link with correct href', () => {
      render(<Footer />);
      const link = screen.getByText('Inicio').closest('a');
      expect(link).toHaveAttribute('href', '/');
    });

    it('should render Libros link with correct href', () => {
      render(<Footer />);
      const link = screen.getByText('Libros').closest('a');
      expect(link).toHaveAttribute('href', '/libros');
    });

    it('should render Papelería link with correct href', () => {
      render(<Footer />);
      const link = screen.getByText('Papelería').closest('a');
      expect(link).toHaveAttribute('href', '/kamcat');
    });

    it('should render Contacto link with correct href', () => {
      render(<Footer />);
      const links = screen.getAllByText('Contacto');
      const link = links.find((el) => el.tagName === 'A');
      expect(link).toHaveAttribute('href', '/contact');
    });
  });

  describe('Social Links', () => {
    it('should render Instagram link', () => {
      render(<Footer />);
      const link = screen.getByText('Instagram').closest('a');
      expect(link).toHaveAttribute('href', 'https://instagram.com');
    });

    it('should render Facebook link', () => {
      render(<Footer />);
      const link = screen.getByText('Facebook').closest('a');
      expect(link).toHaveAttribute('href', 'https://facebook.com');
    });

    it('should render TikTok link', () => {
      render(<Footer />);
      const link = screen.getByText('TikTok').closest('a');
      expect(link).toHaveAttribute('href', 'https://tiktok.com');
    });
  });

  describe('Layout', () => {
    it('should have contentinfo landmark', () => {
      render(<Footer />);
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });

    it('should have 4 grid columns on desktop', () => {
      render(<Footer />);
      const grid = screen.getByRole('contentinfo').querySelector('.grid');
      expect(grid).toHaveClass('lg:grid-cols-4');
    });
  });
});
