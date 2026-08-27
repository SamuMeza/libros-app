import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Modal from '@/components/shared/modal';

describe('Modal Component', () => {
  beforeEach(() => {
    document.body.style.overflow = '';
  });

  describe('Rendering', () => {
    it('should render children when open', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <p>Modal content</p>
        </Modal>
      );
      expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    it('should not render children when closed', () => {
      render(
        <Modal isOpen={false} onClose={vi.fn()}>
          <p>Modal content</p>
        </Modal>
      );
      expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
    });
  });

  describe('Close Behavior', () => {
    it('should close on Escape key', () => {
      const onClose = vi.fn();
      render(
        <Modal isOpen={true} onClose={onClose}>
          <p>Content</p>
        </Modal>
      );
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should close on overlay click', () => {
      const onClose = vi.fn();
      render(
        <Modal isOpen={true} onClose={onClose}>
          <p>Content</p>
        </Modal>
      );
      const overlay = screen.getByRole('dialog').parentElement;
      fireEvent.click(overlay!);
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('Scroll Prevention', () => {
    it('should prevent body scroll when open', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      );
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('should restore body scroll when closed', () => {
      const { rerender } = render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      );
      rerender(
        <Modal isOpen={false} onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      );
      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('Accessibility', () => {
    it('should have dialog role', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      );
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should have aria-modal attribute', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      );
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });
  });
});
