import type { PaymentStatus, PaymentMethod } from '@/types/admin';

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
