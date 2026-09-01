export interface Payment {
  id: string;
  order_id: string;
  amount: number;
  method: PaymentMethodType;
  status: PaymentStatusType;
  proof_url: string | null;
  proof_number: string | null;
  notes: string | null;
  verified_by: string | null;
  verified_at: string | null;
  created_at: string;
}

export type PaymentMethodType = 'pago_movil' | 'binance';

export type PaymentStatusType = 'pending' | 'verified' | 'rejected';

export interface PaymentSchedule {
  id: string;
  order_id: string;
  installment_number: number;
  amount: number;
  due_date: string;
  status: InstallmentStatus;
  payment_id: string | null;
  created_at: string;
}

export type InstallmentStatus = 'pending' | 'paid' | 'overdue';

export interface SubmitPaymentParams {
  order_id: string;
  amount: number;
  method: PaymentMethodType;
  proof_url?: string;
  proof_number: string;
}

export interface VerifyPaymentParams {
  payment_id: string;
  status: 'verified' | 'rejected';
  notes?: string;
}

export type PaymentActionResponse = {
  success: boolean;
  data?: Payment;
  error?: string;
};

export type PaymentsActionResponse = {
  success: boolean;
  data?: Payment[];
  error?: string;
};

export interface ExchangeRate {
  id: string;
  rate_usd_to_ves: number;
  updated_by: string;
  updated_at: string;
}

export interface ShippingRate {
  id: string;
  carrier: 'mrw' | 'zoom';
  min_weight_kg: number;
  max_weight_kg: number;
  rate_usd: number;
  is_active: boolean;
}

export interface InstallmentConfig {
  id: string;
  min_installments: number;
  max_installments: number;
  interest_rate: number;
  is_active: boolean;
}

export interface CalculateInstallmentsParams {
  total: number;
  num_installments: number;
  order_date: string;
}

export interface InstallmentSchedule {
  installment_number: number;
  amount: number;
  due_date: string;
}
