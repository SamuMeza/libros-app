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
} from '../order-helpers';

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

    it('should reject invalid transitions', () => {
      expect(isValidTransition('delivered', 'pending_payment')).toBe(false);
      expect(isValidTransition('cancelled', 'pending_payment')).toBe(false);
      expect(isValidTransition('pending_payment', 'preparing')).toBe(false);
      expect(isValidTransition('pending_payment', 'delivered')).toBe(false);
    });
  });

  describe('getAllowedTransitions', () => {
    it('should return allowed transitions for pending_payment', () => {
      const transitions = getAllowedTransitions('pending_payment');
      expect(transitions).toContain('payment_verified');
      expect(transitions).toContain('cancelled');
    });

    it('should return empty array for delivered', () => {
      const transitions = getAllowedTransitions('delivered');
      expect(transitions).toHaveLength(0);
    });

    it('should return empty array for cancelled', () => {
      const transitions = getAllowedTransitions('cancelled');
      expect(transitions).toHaveLength(0);
    });
  });

  describe('getStatusLabel', () => {
    it('should return correct labels', () => {
      expect(getStatusLabel('pending_payment')).toBe('Pendiente de Pago');
      expect(getStatusLabel('payment_verified')).toBe('Pago Verificado');
      expect(getStatusLabel('preparing')).toBe('Preparando');
      expect(getStatusLabel('shipped')).toBe('Enviado');
      expect(getStatusLabel('in_transit')).toBe('En Tránsito');
      expect(getStatusLabel('delivered')).toBe('Entregado');
      expect(getStatusLabel('cancelled')).toBe('Cancelado');
    });
  });

  describe('getStatusColor', () => {
    it('should return correct color classes', () => {
      expect(getStatusColor('pending_payment')).toBe('pending');
      expect(getStatusColor('payment_verified')).toBe('verified');
      expect(getStatusColor('preparing')).toBe('preparing');
      expect(getStatusColor('shipped')).toBe('shipped');
      expect(getStatusColor('in_transit')).toBe('in_transit');
      expect(getStatusColor('delivered')).toBe('delivered');
      expect(getStatusColor('cancelled')).toBe('cancelled');
    });
  });

  describe('getTransitionError', () => {
    it('should return null for valid transitions', () => {
      expect(getTransitionError('pending_payment', 'payment_verified')).toBeNull();
      expect(getTransitionError('payment_verified', 'preparing')).toBeNull();
    });

    it('should return error for delivered state', () => {
      expect(getTransitionError('delivered', 'preparing')).toBe('La orden ya fue entregada');
    });

    it('should return error for cancelled state', () => {
      expect(getTransitionError('cancelled', 'preparing')).toBe('La orden fue cancelada');
    });

    it('should return error for backward transitions', () => {
      expect(getTransitionError('payment_verified', 'pending_payment')).toBe('No se puede volver a un estado anterior');
    });

    it('should return error for skipped states', () => {
      expect(getTransitionError('pending_payment', 'preparing')).toBe('No se puede saltar a este estado');
    });
  });

  describe('formatOrderNumber', () => {
    it('should format order number to uppercase', () => {
      expect(formatOrderNumber('ord-123')).toBe('ORD-123');
      expect(formatOrderNumber('abc')).toBe('ABC');
    });
  });

  describe('formatAmount', () => {
    it('should format amount as currency', () => {
      const result = formatAmount(25.5);
      expect(result).toContain('25');
      expect(result).toContain('50');
    });
  });

  describe('formatDate', () => {
    it('should format date string', () => {
      const result = formatDate('2026-01-15T10:30:00Z');
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });
  });

  describe('formatShortDate', () => {
    it('should format short date', () => {
      const result = formatShortDate('2026-01-15T10:30:00Z');
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });
  });
});
