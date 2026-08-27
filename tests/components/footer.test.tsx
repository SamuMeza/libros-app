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
    it('should render Libros link with correct href', () => {
      render(<Footer />);
      const link = screen.getByText('Libros').closest('a');
      expect(link).toHaveAttribute('href', '/libros');
    });

    it('should render Papelería link with correct href', () => {
      render(<Footer />);
      const link = screen.getByText('Papelería').closest('a');
      expect(link).toHaveAttribute('href', '/papeleria');
    });

    it('should render Sobre nosotros link with correct href', () => {
      render(<Footer />);
      const link = screen.getByText('Sobre nosotros').closest('a');
      expect(link).toHaveAttribute('href', '/about');
    });

    it('should render Contacto link with correct href', () => {
      render(<Footer />);
      const link = screen.getByText('Contacto').closest('a');
      expect(link).toHaveAttribute('href', '/contact');
    });
  });

  describe('Policies', () => {
    it('should render Privacidad link', () => {
      render(<Footer />);
      const link = screen.getByText('Privacidad').closest('a');
      expect(link).toHaveAttribute('href', '/privacy');
    });

    it('should render Términos link', () => {
      render(<Footer />);
      const link = screen.getByText('Términos').closest('a');
      expect(link).toHaveAttribute('href', '/terms');
    });

    it('should render Envíos link', () => {
      render(<Footer />);
      const link = screen.getByText('Envíos').closest('a');
      expect(link).toHaveAttribute('href', '/shipping');
    });

    it('should render Devoluciones link', () => {
      render(<Footer />);
      const link = screen.getByText('Devoluciones').closest('a');
      expect(link).toHaveAttribute('href', '/returns');
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
