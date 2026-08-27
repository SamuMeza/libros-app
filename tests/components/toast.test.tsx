import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Toast from '@/components/shared/toast';

describe('Toast Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Variants', () => {
    it('should render success variant', () => {
      render(<Toast variant="success" message="Operación exitosa" onClose={vi.fn()} />);
      expect(screen.getByText('Operación exitosa')).toBeInTheDocument();
    });

    it('should render error variant', () => {
      render(<Toast variant="error" message="Error al procesar" onClose={vi.fn()} />);
      expect(screen.getByText('Error al procesar')).toBeInTheDocument();
    });

    it('should render info variant', () => {
      render(<Toast variant="info" message="Información" onClose={vi.fn()} />);
      expect(screen.getByText('Información')).toBeInTheDocument();
    });
  });

  describe('Auto-dismiss', () => {
    it('should auto-dismiss after default 5 seconds', () => {
      const onClose = vi.fn();
      render(<Toast variant="success" message="Test" onClose={onClose} />);
      vi.advanceTimersByTime(5000);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should auto-dismiss after custom duration', () => {
      const onClose = vi.fn();
      render(<Toast variant="success" message="Test" duration={3000} onClose={onClose} />);
      vi.advanceTimersByTime(3000);
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Close Button', () => {
    it('should have a close button', () => {
      render(<Toast variant="success" message="Test" onClose={vi.fn()} />);
      expect(screen.getByRole('button', { name: /cerrar/i })).toBeInTheDocument();
    });

    it('should call onClose when close button is clicked', () => {
      const onClose = vi.fn();
      render(<Toast variant="success" message="Test" onClose={onClose} />);
      fireEvent.click(screen.getByRole('button', { name: /cerrar/i }));
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
