import type { PaymentStatus, PaymentMethod } from '@/types/admin';
import type {
  CalculateInstallmentsParams,
  InstallmentSchedule,
  ExchangeRate,
} from '@/types/payment';

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

const DEFAULT_EXCHANGE_RATE: ExchangeRate = {
  id: '1',
  rate_usd_to_ves: 36.5,
  updated_by: 'system',
  updated_at: new Date().toISOString(),
};

export function calculateInstallments(
  params: CalculateInstallmentsParams
): InstallmentSchedule[] {
  const { total, num_installments, order_date } = params;

  if (num_installments < 2 || num_installments > 4) {
    return [];
  }

  const amountPerInstallment = total / num_installments;
  const schedule: InstallmentSchedule[] = [];
  const startDate = new Date(order_date);

  for (let i = 0; i < num_installments; i++) {
    const dueDate = new Date(startDate);
    dueDate.setDate(dueDate.getDate() + (i + 1) * 15);

    schedule.push({
      installment_number: i + 1,
      amount: Math.round(amountPerInstallment * 100) / 100,
      due_date: dueDate.toISOString().split('T')[0],
    });
  }

  return schedule;
}

export function convertUsdToVes(
  amountUsd: number,
  exchangeRate: ExchangeRate = DEFAULT_EXCHANGE_RATE
): number {
  return Math.round(amountUsd * exchangeRate.rate_usd_to_ves * 100) / 100;
}

export function applyBinanceDiscount(total: number, discountPercent: number = 5): number {
  const discount = total * (discountPercent / 100);
  return Math.round((total - discount) * 100) / 100;
}

export function validatePaymentProof(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  const maxSizeMB = 5;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Formato no permitido. Use JPG, PNG o PDF.',
    };
  }

  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `El archivo excede el tamaño máximo de ${maxSizeMB}MB.`,
    };
  }

  return { valid: true };
}

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function formatCurrencyVes(amount: number): string {
  return `Bs. ${amount.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatInstallmentDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-VE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
