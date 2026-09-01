export interface CartItem {
  id: string;
  user_id: string;
  item_type: 'book' | 'product';
  item_id: string;
  quantity: number;
  extras: CartItemExtra[];
  customization: CartItemCustomization;
  added_at: string;
}

export interface CartItemExtra {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CartItemCustomization {
  text?: string;
  color?: string;
  size?: string;
  [key: string]: unknown;
}

export interface CartItemWithDetails extends CartItem {
  item_name: string;
  item_price: number;
  item_image: string;
  brand: 'hl' | 'kc';
  subtotal: number;
}

export interface CartBrandGroup {
  brand: 'hl' | 'kc';
  brand_name: string;
  items: CartItemWithDetails[];
  subtotal: number;
}

export interface CartSummary {
  items: CartItemWithDetails[];
  brands: CartBrandGroup[];
  total: number;
  total_items: number;
}

export interface CartState {
  items: CartItemWithDetails[];
  brands: CartBrandGroup[];
  total: number;
  total_items: number;
  loading: boolean;
  error: string | null;
}

export interface AddToCartParams {
  item_type: 'book' | 'product';
  item_id: string;
  quantity: number;
  extras?: CartItemExtra[];
  customization?: CartItemCustomization;
}

export interface UpdateCartItemParams {
  item_id: string;
  quantity: number;
}

export interface RemoveFromCartParams {
  item_id: string;
}

export type CartActionResponse = {
  success: boolean;
  data?: CartSummary;
  error?: string;
};
