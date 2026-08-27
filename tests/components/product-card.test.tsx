import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, getAllByText } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import ProductCard from '@/components/shared/product-card';

const mockHLProduct = {
  id: '1',
  name: 'Cien Años de Soledad',
  author: 'Gabriel García Márquez',
  price: 25,
  image: '/images/book.jpg',
  stockStatus: 'in_stock' as const,
};

const mockKCProduct = {
  id: '2',
  name: 'Cuaderno Arcoíris',
  category: 'Cuadernos',
  price: 8,
  image: '/images/notebook.jpg',
  stockStatus: 'customizable' as const,
};

describe('ProductCard Component', () => {
  describe('Branding', () => {
    it('should render HL brand indicator in info section', () => {
      render(<ProductCard product={mockHLProduct} brand="hl" onAddToCart={vi.fn()} />);
      const brandElements = screen.getAllByText('Hecho Letras');
      expect(brandElements.length).toBeGreaterThanOrEqual(1);
    });

    it('should render KC brand indicator in info section', () => {
      render(<ProductCard product={mockKCProduct} brand="kc" onAddToCart={vi.fn()} />);
      const brandElements = screen.getAllByText('KamCat');
      expect(brandElements.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Image Aspect Ratio', () => {
    it('should apply 3:4 aspect ratio for HL products', () => {
      render(<ProductCard product={mockHLProduct} brand="hl" onAddToCart={vi.fn()} />);
      const imgContainer = screen.getByRole('img', { name: /cien años/i }).parentElement;
      expect(imgContainer).toHaveClass('aspect-[3/4]');
    });

    it('should apply 1:1 aspect ratio for KC products', () => {
      render(<ProductCard product={mockKCProduct} brand="kc" onAddToCart={vi.fn()} />);
      const imgContainer = screen.getByRole('img', { name: /cuaderno arcoíris/i }).parentElement;
      expect(imgContainer).toHaveClass('aspect-square');
    });
  });

  describe('Stock Badges', () => {
    it('should show "EN STOCK" badge for in_stock products', () => {
      render(<ProductCard product={mockHLProduct} brand="hl" onAddToCart={vi.fn()} />);
      expect(screen.getByText('EN STOCK')).toBeInTheDocument();
    });

    it('should show "POR ENCARGO" badge for pre_order products', () => {
      const preOrderProduct = { ...mockHLProduct, stockStatus: 'pre_order' as const };
      render(<ProductCard product={preOrderProduct} brand="hl" onAddToCart={vi.fn()} />);
      expect(screen.getByText('POR ENCARGO')).toBeInTheDocument();
    });

    it('should show "PERSONALIZABLE" badge for customizable products', () => {
      render(<ProductCard product={mockKCProduct} brand="kc" onAddToCart={vi.fn()} />);
      expect(screen.getByText('PERSONALIZABLE')).toBeInTheDocument();
    });
  });

  describe('Product Information', () => {
    it('should render product name', () => {
      render(<ProductCard product={mockHLProduct} brand="hl" onAddToCart={vi.fn()} />);
      expect(screen.getByText('Cien Años de Soledad')).toBeInTheDocument();
    });

    it('should render author for HL products', () => {
      render(<ProductCard product={mockHLProduct} brand="hl" onAddToCart={vi.fn()} />);
      expect(screen.getByText('Gabriel García Márquez')).toBeInTheDocument();
    });

    it('should render category for KC products', () => {
      render(<ProductCard product={mockKCProduct} brand="kc" onAddToCart={vi.fn()} />);
      expect(screen.getByText('Cuadernos')).toBeInTheDocument();
    });

    it('should render formatted price', () => {
      render(<ProductCard product={mockHLProduct} brand="hl" onAddToCart={vi.fn()} />);
      expect(screen.getByText(/\$25/)).toBeInTheDocument();
    });
  });

  describe('Add to Cart', () => {
    it('should call onAddToCart with product id', () => {
      const onAddToCart = vi.fn();
      render(<ProductCard product={mockHLProduct} brand="hl" onAddToCart={onAddToCart} />);
      const button = screen.getByRole('button', { name: /Cien Años de Soledad/ });
      fireEvent.click(button);
      expect(onAddToCart).toHaveBeenCalledWith('1');
    });

    it('should have accessible button with product name in label', () => {
      render(<ProductCard product={mockHLProduct} brand="hl" onAddToCart={vi.fn()} />);
      expect(screen.getByRole('button', { name: /Cien Años de Soledad/ })).toBeInTheDocument();
    });
  });

  describe('Hover Effects', () => {
    it('should have transition classes', () => {
      render(<ProductCard product={mockHLProduct} brand="hl" onAddToCart={vi.fn()} />);
      const card = screen.getByText('Cien Años de Soledad').closest('div[class*="group"]');
      expect(card).toHaveClass('transition-all');
    });
  });
});
