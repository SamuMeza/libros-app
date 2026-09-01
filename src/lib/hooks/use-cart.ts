'use client';

import { create } from 'zustand';
import type { CartItemWithDetails, CartBrandGroup } from '@/types/cart';
import {
  getCart as fetchCart,
  addToCart as addAction,
  updateCartItem as updateAction,
  removeFromCart as removeAction,
} from '@/lib/actions/cart';

interface CartStore {
  items: CartItemWithDetails[];
  brands: CartBrandGroup[];
  total: number;
  total_items: number;
  loading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addToCart: (params: {
    item_type: 'book' | 'product';
    item_id: string;
    quantity: number;
    extras?: { id: string; name: string; price: number; quantity: number }[];
    customization?: Record<string, unknown>;
  }) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearError: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  brands: [],
  total: 0,
  total_items: 0,
  loading: false,
  error: null,

  fetchCart: async () => {
    set({ loading: true, error: null });
    try {
      const result = await fetchCart();
      if (result.success && result.data) {
        set({
          items: result.data.items,
          brands: result.data.brands,
          total: result.data.total,
          total_items: result.data.total_items,
          loading: false,
        });
      } else {
        set({ error: result.error || 'Error al cargar el carrito', loading: false });
      }
    } catch {
      set({ error: 'Error al cargar el carrito', loading: false });
    }
  },

  addToCart: async (params) => {
    set({ loading: true, error: null });
    try {
      const result = await addAction(params);
      if (result.success && result.data) {
        set({
          items: result.data.items,
          brands: result.data.brands,
          total: result.data.total,
          total_items: result.data.total_items,
          loading: false,
        });
      } else {
        set({ error: result.error || 'Error al agregar al carrito', loading: false });
      }
    } catch {
      set({ error: 'Error al agregar al carrito', loading: false });
    }
  },

  updateQuantity: async (itemId, quantity) => {
    set({ loading: true, error: null });
    try {
      const result = await updateAction({ item_id: itemId, quantity });
      if (result.success && result.data) {
        set({
          items: result.data.items,
          brands: result.data.brands,
          total: result.data.total,
          total_items: result.data.total_items,
          loading: false,
        });
      } else {
        set({ error: result.error || 'Error al actualizar cantidad', loading: false });
      }
    } catch {
      set({ error: 'Error al actualizar cantidad', loading: false });
    }
  },

  removeItem: async (itemId) => {
    set({ loading: true, error: null });
    try {
      const result = await removeAction({ item_id: itemId });
      if (result.success && result.data) {
        set({
          items: result.data.items,
          brands: result.data.brands,
          total: result.data.total,
          total_items: result.data.total_items,
          loading: false,
        });
      } else {
        set({ error: result.error || 'Error al eliminar del carrito', loading: false });
      }
    } catch {
      set({ error: 'Error al eliminar del carrito', loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
