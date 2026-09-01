import { create } from 'zustand';
import type { OrderFilters } from '@/types/admin';

interface OrderFiltersStore {
  filters: OrderFilters;
  setFilters: (filters: Partial<OrderFilters>) => void;
  resetFilters: () => void;
}

const defaultFilters: OrderFilters = {
  status: 'all',
  page: 1,
  limit: 20,
};

export const useOrderFilters = create<OrderFiltersStore>((set) => ({
  filters: defaultFilters,
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
  resetFilters: () => set({ filters: defaultFilters }),
}));
