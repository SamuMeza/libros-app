import { describe, it, expect } from 'vitest';
import {
  getPaymentStatusLabel,
  getPaymentMethodLabel,
  getPaymentStatusColor,
  validatePaymentAmount,
  canApprovePayment,
  canRejectPayment,
  formatPaymentAmount,
  formatPaymentDate,
  getPaymentProofUrl,
  validatePaymentProofUrl,
} from '../payment-helpers';

describe('payment-helpers', () => {
  describe('getPaymentStatusLabel', () => {
    it('should return correct labels', () => {
      expect(getPaymentStatusLabel('pending')).toBe('Pendiente');
      expect(getPaymentStatusLabel('verified')).toBe('Verificado');
      expect(getPaymentStatusLabel('rejected')).toBe('Rechazado');
    });
  });

  describe('getPaymentMethodLabel', () => {
    it('should return correct labels', () => {
      expect(getPaymentMethodLabel('pago_movil')).toBe('Pago Móvil');
      expect(getPaymentMethodLabel('binance')).toBe('Binance USDT');
    });
  });

  describe('getPaymentStatusColor', () => {
    it('should return correct color classes', () => {
      expect(getPaymentStatusColor('pending')).toBe('pending');
      expect(getPaymentStatusColor('verified')).toBe('verified');
      expect(getPaymentStatusColor('rejected')).toBe('rejected');
    });
  });

  describe('validatePaymentAmount', () => {
    it('should return valid for matching amounts', () => {
      const result = validatePaymentAmount(25.00, 25.00);
      expect(result.valid).toBe(true);
    });

    it('should return valid for amounts within tolerance', () => {
      const result = validatePaymentAmount(25.005, 25.00);
      expect(result.valid).toBe(true);
    });

    it('should return invalid for mismatched amounts', () => {
      const result = validatePaymentAmount(20.00, 25.00);
      expect(result.valid).toBe(false);
      expect(result.difference).toBe(5);
      expect(result.message).toBeTruthy();
    });
  });

  describe('canApprovePayment', () => {
    it('should return true for pending payments', () => {
      expect(canApprovePayment('pending')).toBe(true);
    });

    it('should return false for non-pending payments', () => {
      expect(canApprovePayment('verified')).toBe(false);
      expect(canApprovePayment('rejected')).toBe(false);
    });
  });

  describe('canRejectPayment', () => {
    it('should return true for pending payments', () => {
      expect(canRejectPayment('pending')).toBe(true);
    });

    it('should return false for non-pending payments', () => {
      expect(canRejectPayment('verified')).toBe(false);
      expect(canRejectPayment('rejected')).toBe(false);
    });
  });

  describe('formatPaymentAmount', () => {
    it('should format amount as currency', () => {
      const result = formatPaymentAmount(25.5);
      expect(result).toContain('25');
      expect(result).toContain('50');
    });
  });

  describe('formatPaymentDate', () => {
    it('should format date string', () => {
      const result = formatPaymentDate('2026-01-15T10:30:00Z');
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });
  });

  describe('getPaymentProofUrl', () => {
    it('should return URL when provided', () => {
      expect(getPaymentProofUrl('https://example.com/proof.jpg')).toBe('https://example.com/proof.jpg');
    });

    it('should return null when no URL', () => {
      expect(getPaymentProofUrl(null)).toBeNull();
    });
  });

  describe('validatePaymentProofUrl', () => {
    it('should return true for valid URLs', () => {
      expect(validatePaymentProofUrl('https://example.com/proof.jpg')).toBe(true);
      expect(validatePaymentProofUrl('http://localhost:3000/image.png')).toBe(true);
    });

    it('should return false for invalid URLs', () => {
      expect(validatePaymentProofUrl('not-a-url')).toBe(false);
      expect(validatePaymentProofUrl('')).toBe(false);
    });
  });
});
