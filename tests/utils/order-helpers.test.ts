import { describe, it, expect } from 'vitest';
import {
  isValidTransition,
  getAllowedTransitions,
  getStatusLabel,
  getStatusColor,
  getTransitionError,
  formatOrderNumber,
  formatAmount,
  formatDate,
  formatShortDate,
  validateShippingAddress,
  getDeliveryDays,
} from '@/lib/utils/order-helpers';
import type { ShippingAddress } from '@/types/order';

describe('order-helpers', () => {
  describe('isValidTransition', () => {
    it('should allow valid transitions', () => {
      expect(isValidTransition('pending_payment', 'payment_verified')).toBe(true);
      expect(isValidTransition('payment_verified', 'preparing')).toBe(true);
      expect(isValidTransition('preparing', 'shipped')).toBe(true);
      expect(isValidTransition('shipped', 'in_transit')).toBe(true);
      expect(isValidTransition('in_transit', 'delivered')).toBe(true);
    });

    it('should allow cancellation from any non-terminal state', () => {
      expect(isValidTransition('pending_payment', 'cancelled')).toBe(true);
      expect(isValidTransition('payment_verified', 'cancelled')).toBe(true);
      expect(isValidTransition('preparing', 'cancelled')).toBe(true);
      expect(isValidTransition('shipped', 'cancelled')).toBe(true);
      expect(isValidTransition('in_transit', 'cancelled')).toBe(true);
    });

    it('should disallow invalid transitions', () => {
      expect(isValidTransition('pending_payment', 'shipped')).toBe(false);
      expect(isValidTransition('delivered', 'cancelled')).toBe(false);
      expect(isValidTransition('cancelled', 'delivered')).toBe(false);
    });
  });

  describe('validateShippingAddress', () => {
    const validAddress: ShippingAddress = {
      full_name: 'Juan Pérez',
      cedula: 'V-12345678',
      phone: '04141234567',
      state: 'Distrito Capital',
      city: 'Caracas',
      address: 'Av. Urdaneta, Edif Centro',
      reference: 'Frente a la plaza',
    };

    it('should return empty errors array for a valid Venezuelan address', () => {
      const errors = validateShippingAddress(validAddress);
      expect(errors).toEqual([]);
    });

    it('should fail when full_name is too short or empty', () => {
      const errors = validateShippingAddress({ ...validAddress, full_name: '' });
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.toLowerCase().includes('nombre'))).toBe(true);
    });

    it('should fail when cedula is invalid or empty', () => {
      const errors = validateShippingAddress({ ...validAddress, cedula: '' });
      expect(errors.some((e) => e.toLowerCase().includes('cédula'))).toBe(true);
    });

    it('should fail when state or city is missing', () => {
      const errors = validateShippingAddress({ ...validAddress, state: '', city: '' });
      expect(errors.length).toBeGreaterThanOrEqual(2);
    });

    it('should fail when address is too short', () => {
      const errors = validateShippingAddress({ ...validAddress, address: 'calle' });
      expect(errors.some((e) => e.toLowerCase().includes('dirección'))).toBe(true);
    });
  });

  describe('getDeliveryDays', () => {
    it('should return estimated delivery range for MRW', () => {
      const days = getDeliveryDays('mrw');
      expect(days).toBeDefined();
      expect(days.min).toBe(2);
      expect(days.max).toBe(4);
      expect(days.toString()).toContain('días');
    });

    it('should return estimated delivery range for Zoom', () => {
      const days = getDeliveryDays('zoom');
      expect(days).toBeDefined();
      expect(days.min).toBe(1);
      expect(days.max).toBe(3);
      expect(days.toString()).toContain('días');
    });
  });

  describe('formatOrderNumber', () => {
    it('should format order numbers correctly in uppercase', () => {
      expect(formatOrderNumber('hl-2026-0001')).toBe('HL-2026-0001');
      expect(formatOrderNumber('order-123')).toBe('ORDER-123');
    });
  });
});
