import type { PaymentStatus, PaymentMethod } from '@/types/admin';
import type { InstallmentSchedule } from '@/types/payment';

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: 'Pendiente',
  verified: 'Verificado',
  rejected: 'Rechazado',
};

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  pago_movil: 'Pago Móvil',
  binance: 'Binance USDT',
  cuotas: 'Cuotas',
};

export function getPaymentStatusLabel(status: PaymentStatus): string {
  return PAYMENT_STATUS_LABELS[status] || status;
}

export function getPaymentMethodLabel(method: PaymentMethod): string {
  return PAYMENT_METHOD_LABELS[method] || method;
}

export function getPaymentStatusColor(status: PaymentStatus): string {
  const colors: Record<PaymentStatus, string> = {
    pending: 'pending',
    verified: 'verified',
    rejected: 'rejected',
  };
  return colors[status] || 'pending';
}

export function validatePaymentAmount(
  paymentAmount: number,
  orderAmount: number
): { valid: boolean; difference?: number; message?: string } {
  const difference = Math.abs(paymentAmount - orderAmount);
  const tolerance = 0.01;

  if (difference < tolerance) {
    return { valid: true };
  }

  return {
    valid: false,
    difference,
    message: `El monto ($${paymentAmount}) no coincide con el total de la orden ($${orderAmount})`,
  };
}

export function canApprovePayment(status: PaymentStatus): boolean {
  return status === 'pending';
}

export function canRejectPayment(status: PaymentStatus): boolean {
  return status === 'pending';
}

export function formatPaymentAmount(amount: number): string {
  return new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatPaymentDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-VE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getPaymentProofUrl(proofUrl: string | null): string | null {
  if (!proofUrl) return null;
  return proofUrl;
}

export function validatePaymentProofUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export const DEFAULT_BCV_RATE = 36.5;

export function applyBinanceDiscount(total: number): number {
  if (!total || total <= 0) return 0;
  const discounted = total * 0.95;
  return Math.round(discounted * 100) / 100;
}

export function convertUsdToVes(amountUsd: number, exchangeRate: number = DEFAULT_BCV_RATE): number {
  if (!amountUsd || amountUsd <= 0) return 0;
  const ves = amountUsd * exchangeRate;
  return Math.round(ves * 100) / 100;
}

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function formatCurrencyVes(amount: number): string {
  return `${amount.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs.`;
}

export function validatePaymentProof(file: File): { valid: boolean; error?: string } {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  const maxSizeBytes = 5 * 1024 * 1024; // 5MB

  if (!allowedMimeTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'El formato del archivo no es válido. Solo se admiten JPG, PNG, WEBP o PDF.',
    };
  }

  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: 'El archivo supera el tamaño máximo permitido de 5MB.',
    };
  }

  return { valid: true };
}

const MIN_INSTALLMENTS_DEFAULT = 2;
const MAX_INSTALLMENTS_DEFAULT = 4;
const FORTNIGHT_DAYS_DEFAULT = 15;

export function calculateInstallments(
  total: number,
  numInstallments: number,
  orderDate: string,
  config?: { min_installments?: number; max_installments?: number; fortnight_days?: number }
): InstallmentSchedule[] {
  const min = config?.min_installments ?? MIN_INSTALLMENTS_DEFAULT;
  const max = config?.max_installments ?? MAX_INSTALLMENTS_DEFAULT;
  const fortnightDays = config?.fortnight_days ?? FORTNIGHT_DAYS_DEFAULT;

  if (numInstallments < min || numInstallments > max) {
    throw new Error(
      `El número de cuotas debe estar entre ${min} y ${max}`
    );
  }

  const baseAmount = Math.round((total / numInstallments) * 100) / 100;
  const baseDate = new Date(orderDate + 'T00:00:00');

  const schedule: InstallmentSchedule[] = [];
  let accumulated = 0;

  for (let i = 0; i < numInstallments; i++) {
    const isLast = i === numInstallments - 1;
    const amount = isLast
      ? Math.round((total - accumulated) * 100) / 100
      : baseAmount;

    const dueDate = new Date(baseDate);
    dueDate.setDate(dueDate.getDate() + (i + 1) * fortnightDays);

    schedule.push({
      installment_number: i + 1,
      amount,
      due_date: dueDate.toISOString().split('T')[0],
    });

    accumulated += amount;
  }

  return schedule;
}
