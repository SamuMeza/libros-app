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
  validatePaymentProof,
  applyBinanceDiscount,
  convertUsdToVes,
  formatCurrency,
  formatCurrencyVes,
  calculateInstallments,
} from '@/lib/utils/payment-helpers';

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

  describe('applyBinanceDiscount', () => {
    it('should apply 5% discount when paying with Binance', () => {
      const original = 100;
      const discounted = applyBinanceDiscount(original);
      expect(discounted).toBe(95);
    });

    it('should handle zero and negative totals safely', () => {
      expect(applyBinanceDiscount(0)).toBe(0);
      expect(applyBinanceDiscount(-10)).toBe(0);
    });

    it('should round to two decimal places', () => {
      const discounted = applyBinanceDiscount(33.33);
      expect(discounted).toBe(31.66);
    });
  });

  describe('convertUsdToVes', () => {
    it('should convert USD to VES using provided exchange rate', () => {
      const ves = convertUsdToVes(10, 36.5);
      expect(ves).toBe(365);
    });

    it('should use default fallback exchange rate if not provided', () => {
      const ves = convertUsdToVes(10);
      expect(ves).toBeGreaterThan(0);
    });

    it('should round correctly to two decimal places', () => {
      const ves = convertUsdToVes(15.55, 36.5);
      expect(ves).toBe(567.58);
    });
  });

  describe('formatCurrency and formatCurrencyVes', () => {
    it('should format USD currency strings', () => {
      const formatted = formatCurrency(25.5);
      expect(formatted).toContain('$');
      expect(formatted).toContain('25.50');
    });

    it('should format VES currency strings with Bs prefix/suffix', () => {
      const formatted = formatCurrencyVes(365);
      expect(formatted).toContain('Bs');
      expect(formatted).toContain('365');
    });
  });

  describe('validatePaymentProof', () => {
    it('should accept valid image files under 5MB', () => {
      const file = new File(['dummy-content'], 'comprobante.jpg', { type: 'image/jpeg' });
      const result = validatePaymentProof(file);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept PDF files under 5MB', () => {
      const file = new File(['dummy-pdf'], 'pago.pdf', { type: 'application/pdf' });
      const result = validatePaymentProof(file);
      expect(result.valid).toBe(true);
    });

    it('should reject non-image/non-pdf formats', () => {
      const file = new File(['text'], 'comprobante.txt', { type: 'text/plain' });
      const result = validatePaymentProof(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('formato');
    });

    it('should reject files exceeding 5MB', () => {
      const largeContent = new Uint8Array(6 * 1024 * 1024);
      const file = new File([largeContent], 'pesado.jpg', { type: 'image/jpeg' });
      const result = validatePaymentProof(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('5MB');
    });
  });

  describe('calculateInstallments', () => {
    it('should split total into 2 equal fortnightly installments', () => {
      const result = calculateInstallments(20, 2, '2026-09-01');

      expect(result).toHaveLength(2);
      expect(result[0].installment_number).toBe(1);
      expect(result[0].amount).toBe(10);
      expect(result[0].due_date).toBe('2026-09-16');
      expect(result[1].installment_number).toBe(2);
      expect(result[1].amount).toBe(10);
      expect(result[1].due_date).toBe('2026-10-01');
    });

    it('should split total into 3 equal fortnightly installments', () => {
      const result = calculateInstallments(30, 3, '2026-09-01');

      expect(result).toHaveLength(3);
      expect(result[0].amount).toBe(10);
      expect(result[0].due_date).toBe('2026-09-16');
      expect(result[1].amount).toBe(10);
      expect(result[1].due_date).toBe('2026-10-01');
      expect(result[2].amount).toBe(10);
      expect(result[2].due_date).toBe('2026-10-16');
    });

    it('should split total into 4 equal fortnightly installments', () => {
      const result = calculateInstallments(40, 4, '2026-09-01');

      expect(result).toHaveLength(4);
      result.forEach((item, i) => {
        expect(item.installment_number).toBe(i + 1);
        expect(item.amount).toBe(10);
      });
    });

    it('should make last installment absorb rounding difference', () => {
      const result = calculateInstallments(10, 3, '2026-09-01');

      expect(result).toHaveLength(3);
      expect(result[0].amount).toBe(3.33);
      expect(result[1].amount).toBe(3.33);
      expect(result[2].amount).toBe(3.34);
      const totalCheck = result.reduce((sum, item) => sum + item.amount, 0);
      expect(totalCheck).toBe(10);
    });

    it('should handle odd totals correctly', () => {
      const result = calculateInstallments(25, 2, '2026-09-01');

      expect(result).toHaveLength(2);
      expect(result[0].amount).toBe(12.5);
      expect(result[1].amount).toBe(12.5);
    });

    it('should throw for numInstallments less than 2', () => {
      expect(() => calculateInstallments(20, 1, '2026-09-01')).toThrow();
    });

    it('should throw for numInstallments greater than 4', () => {
      expect(() => calculateInstallments(20, 5, '2026-09-01')).toThrow();
    });

    it('should handle decimal totals with proper rounding', () => {
      const result = calculateInstallments(33.33, 3, '2026-09-01');

      expect(result).toHaveLength(3);
      expect(result[0].amount).toBe(11.11);
      expect(result[1].amount).toBe(11.11);
      expect(result[2].amount).toBe(11.11);
      const totalCheck = result.reduce((sum, item) => sum + item.amount, 0);
      expect(totalCheck).toBe(33.33);
    });

    it('should generate correct dates from any starting date', () => {
      const result = calculateInstallments(20, 2, '2026-12-25');

      expect(result[0].due_date).toBe('2027-01-09');
      expect(result[1].due_date).toBe('2027-01-24');
    });
  });
});
