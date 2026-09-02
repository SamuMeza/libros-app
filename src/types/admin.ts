export type AdminRole = 'admin_hl' | 'admin_kc' | 'superadmin';

export type SubOrderStatus = 
  | 'pending_payment' 
  | 'payment_verified' 
  | 'preparing' 
  | 'shipped' 
  | 'in_transit' 
  | 'delivered' 
  | 'cancelled';

export type PaymentStatus = 'pending' | 'verified' | 'rejected';

export type PaymentMethod = 'pago_movil' | 'binance' | 'cuotas';

export interface AdminProfile {
  id: string;
  full_name: string | null;
  phone: string | null;
  email?: string | null;
  avatar_url: string | null;
  role: AdminRole;
  created_at: string;
  updated_at: string;
}

export interface SubOrder {
  id: string;
  order_id: string;
  brand: 'hl' | 'kc';
  order_number: string;
  status: SubOrderStatus;
  subtotal: number;
  tracking_number: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  order_id: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  proof_url: string | null;
  proof_number: string | null;
  notes: string | null;
  verified_by: string | null;
  verified_at: string | null;
  created_at: string;
  customer_name?: string | null;
  customer_phone?: string | null;
}

export interface TrackingNote {
  id: string;
  sub_order_id: string;
  location: string;
  note: string | null;
  created_by: string | null;
  created_at: string;
}

export interface OrderItem {
  id: string;
  sub_order_id: string;
  item_type: 'book' | 'product';
  item_id: string;
  item_name: string;
  item_price: number;
  quantity: number;
  extras: unknown[];
  customization: Record<string, unknown>;
  subtotal: number;
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: SubOrderStatus;
  total_amount: number;
  shipping_cost: number;
  shipping_method: string | null;
  shipping_address: Record<string, unknown>;
  payment_method: string;
  payment_status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  label: string | null;
  street: string;
  city: string;
  state: string;
  zip_code: string | null;
  phone: string | null;
  is_default: boolean;
  created_at: string;
}

export interface AdminOrderDetail {
  subOrder: SubOrder;
  items: OrderItem[];
  payments: Payment[];
  trackingNotes: TrackingNote[];
  client: AdminProfile;
  address: Address | null;
}

export interface PaymentFilters {
  status: PaymentStatus | 'all';
  method: PaymentMethod | 'all';
  dateFrom: string | null;
  dateTo: string | null;
  page: number;
  limit: number;
}

export interface OrderFilters {
  status: SubOrderStatus | 'all';
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export const SUB_ORDER_STATUS_TRANSITIONS: Record<SubOrderStatus, SubOrderStatus[]> = {
  pending_payment: ['payment_verified', 'cancelled'],
  payment_verified: ['preparing', 'cancelled'],
  preparing: ['shipped', 'cancelled'],
  shipped: ['in_transit', 'cancelled'],
  in_transit: ['delivered', 'cancelled'],
  delivered: [],
  cancelled: [],
};

export const SUB_ORDER_STATUS_LABELS: Record<SubOrderStatus, string> = {
  pending_payment: 'Pendiente de Pago',
  payment_verified: 'Pago Verificado',
  preparing: 'Preparando',
  shipped: 'Enviado',
  in_transit: 'En Tránsito',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: 'Pendiente',
  verified: 'Verificado',
  rejected: 'Rechazado',
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  pago_movil: 'Pago Móvil',
  binance: 'Binance USDT',
  cuotas: 'Cuotas',
};
