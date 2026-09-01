import type {
  CalculateInstallmentsParams,
  InstallmentSchedule,
  ExchangeRate,
} from '@/types/payment';

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
