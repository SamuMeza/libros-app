'use client';

import { create } from 'zustand';
import type { SubOrder, OrderFilters } from '@/types/admin';
import { getAdminOrders } from '@/lib/actions/admin/orders';

interface OrderFiltersStore {
  filters: OrderFilters;
  orders: SubOrder[];
  total: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  setFilters: (filters: Partial<OrderFilters>) => void;
  resetFilters: () => void;
  fetchOrders: () => Promise<void>;
}

const defaultFilters: OrderFilters = {
  status: 'all',
  page: 1,
  limit: 20,
};

export const useOrderFilters = create<OrderFiltersStore>((set, get) => ({
  filters: defaultFilters,
  orders: [],
  total: 0,
  totalPages: 0,
  isLoading: true,
  error: null,

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  resetFilters: () => set({ filters: defaultFilters }),

  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const { filters } = get();
      const result = await getAdminOrders(filters);
      if (result.success && result.data) {
        set({
          orders: result.data.data,
          total: result.data.total,
          totalPages: result.data.totalPages,
          isLoading: false,
        });
      } else {
        set({ error: result.error || 'Error al cargar pedidos', isLoading: false });
      }
    } catch {
      set({ error: 'Error al cargar pedidos', isLoading: false });
    }
  },
}));
