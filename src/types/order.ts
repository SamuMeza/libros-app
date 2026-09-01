export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: OrderStatus;
  total_amount: number;
  shipping_cost: number;
  shipping_method: ShippingMethod;
  shipping_address: ShippingAddress;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type OrderStatus =
  | 'pending_payment'
  | 'payment_verified'
  | 'preparing'
  | 'shipped'
  | 'in_transit'
  | 'delivered'
  | 'cancelled';

export type ShippingMethod = 'mrw' | 'zoom';

export type PaymentMethod = 'pago_movil' | 'binance' | 'installments';

export type PaymentStatus = 'pending' | 'partial' | 'completed' | 'failed';

export interface ShippingAddress {
  full_name: string;
  cedula: string;
  phone: string;
  state: string;
  city: string;
  address: string;
  reference: string;
}

export interface SubOrder {
  id: string;
  order_id: string;
  brand: 'hl' | 'kc';
  order_number: string;
  status: OrderStatus;
  subtotal: number;
  tracking_number: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  sub_order_id: string;
  item_type: 'book' | 'product';
  item_id: string;
  item_name: string;
  item_price: number;
  quantity: number;
  extras: OrderItemExtra[];
  customization: OrderItemCustomization;
  subtotal: number;
}

export interface OrderItemExtra {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderItemCustomization {
  text?: string;
  color?: string;
  size?: string;
  [key: string]: unknown;
}

export interface OrderWithSubOrders extends Order {
  sub_orders: SubOrderWithItems[];
}

export interface SubOrderWithItems extends SubOrder {
  items: OrderItem[];
}

export interface CreateOrderParams {
  shipping_address: ShippingAddress;
  shipping_method: ShippingMethod;
  payment_method: PaymentMethod;
  notes?: string;
}

export type OrderActionResponse = {
  success: boolean;
  data?: OrderWithSubOrders;
  error?: string;
};

export type OrdersActionResponse = {
  success: boolean;
  data?: {
    orders: Order[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  error?: string;
};
