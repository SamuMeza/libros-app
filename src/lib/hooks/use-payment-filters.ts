import { create } from 'zustand';
import type { PaymentFilters } from '@/types/admin';

interface PaymentFiltersStore {
  filters: PaymentFilters;
  setFilters: (filters: Partial<PaymentFilters>) => void;
  resetFilters: () => void;
}

const defaultFilters: PaymentFilters = {
  status: 'all',
  method: 'all',
  dateFrom: null,
  dateTo: null,
  page: 1,
  limit: 20,
};

export const usePaymentFilters = create<PaymentFiltersStore>((set) => ({
  filters: defaultFilters,
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
  resetFilters: () => set({ filters: defaultFilters }),
}));
