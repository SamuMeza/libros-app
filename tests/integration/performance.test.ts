import { describe, it, expect } from 'vitest';
import { calculateCartSummary } from '@/lib/utils/cart-helpers';
import { calculateInstallments, applyBinanceDiscount, convertUsdToVes } from '@/lib/utils/payment-helpers';
import type { CartItemWithDetails } from '@/types/cart';

function createMockCartItem(overrides: Partial<CartItemWithDetails> = {}): CartItemWithDetails {
  return {
    id: crypto.randomUUID(),
    user_id: crypto.randomUUID(),
    item_type: 'book',
    item_id: crypto.randomUUID(),
    quantity: 1,
    extras: [],
    customization: {},
    added_at: new Date().toISOString(),
    item_name: 'Libro de prueba',
    item_price: 10,
    item_image: '/placeholder.jpg',
    brand: 'hl',
    subtotal: 10,
    ...overrides,
  };
}

describe('Performance Benchmarks (SC-002, SC-004)', () => {
  describe('SC-002: Cart calculation < 100ms', () => {
    it('should calculate cart summary for 10 items in under 100ms', () => {
      const items = Array.from({ length: 10 }, (_, i) =>
        createMockCartItem({
          item_price: 10 + i,
          quantity: i + 1,
          brand: i % 2 === 0 ? 'hl' : 'kc',
          extras: [
            { id: '1', name: 'Extra', price: 2, quantity: 1 },
          ],
        })
      );

      const start = performance.now();
      const summary = calculateCartSummary(items);
      const elapsed = performance.now() - start;

      expect(summary.total).toBeGreaterThan(0);
      expect(elapsed).toBeLessThan(100);
    });

    it('should calculate cart summary for 50 items in under 100ms', () => {
      const items = Array.from({ length: 50 }, (_, i) =>
        createMockCartItem({
          item_price: 5 + (i % 20),
          quantity: (i % 5) + 1,
          brand: i % 2 === 0 ? 'hl' : 'kc',
        })
      );

      const start = performance.now();
      const summary = calculateCartSummary(items);
      const elapsed = performance.now() - start;

      expect(summary.total).toBeGreaterThan(0);
      expect(summary.total_items).toBeGreaterThan(0);
      expect(elapsed).toBeLessThan(100);
    });

    it('should calculate cart summary for 100 items in under 100ms', () => {
      const items = Array.from({ length: 100 }, (_, i) =>
        createMockCartItem({
          item_price: 3 + (i % 10),
          quantity: (i % 3) + 1,
          brand: i % 2 === 0 ? 'hl' : 'kc',
          extras: i % 4 === 0
            ? [{ id: '1', name: 'Extra', price: 1.5, quantity: 2 }]
            : [],
        })
      );

      const start = performance.now();
      const summary = calculateCartSummary(items);
      const elapsed = performance.now() - start;

      expect(summary.total).toBeGreaterThan(0);
      expect(summary.brands).toHaveLength(2);
      expect(elapsed).toBeLessThan(100);
    });
  });

  describe('Payment helpers performance', () => {
    it('should calculate installments in under 10ms', () => {
      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        calculateInstallments(30, 3, '2026-09-01');
      }
      const elapsed = performance.now() - start;

      expect(elapsed).toBeLessThan(10);
    });

    it('should apply binance discount in under 10ms', () => {
      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        applyBinanceDiscount(100);
      }
      const elapsed = performance.now() - start;

      expect(elapsed).toBeLessThan(10);
    });

    it('should convert USD to VES in under 10ms', () => {
      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        convertUsdToVes(100, 36.5);
      }
      const elapsed = performance.now() - start;

      expect(elapsed).toBeLessThan(10);
    });
  });
});
