'use client';

import { create } from 'zustand';
import type { Payment, PaymentFilters } from '@/types/admin';
import { getAdminPayments } from '@/lib/actions/admin/payments';

interface PaymentFiltersStore {
  filters: PaymentFilters;
  payments: Payment[];
  total: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  selectedPayment: Payment | null;
  isModalOpen: boolean;
  setFilters: (filters: Partial<PaymentFilters>) => void;
  resetFilters: () => void;
  fetchPayments: () => Promise<void>;
  setSelectedPayment: (payment: Payment | null) => void;
  openModal: (payment: Payment) => void;
  closeModal: () => void;
}

const defaultFilters: PaymentFilters = {
  status: 'all',
  method: 'all',
  dateFrom: null,
  dateTo: null,
  page: 1,
  limit: 20,
};

export const usePaymentFilters = create<PaymentFiltersStore>((set, get) => ({
  filters: defaultFilters,
  payments: [],
  total: 0,
  totalPages: 0,
  isLoading: true,
  error: null,
  selectedPayment: null,
  isModalOpen: false,

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  resetFilters: () => set({ filters: defaultFilters }),

  fetchPayments: async () => {
    set({ isLoading: true, error: null });
    try {
      const { filters } = get();
      const result = await getAdminPayments(filters);
      if (result.success && result.data) {
        set({
          payments: result.data.data,
          total: result.data.total,
          totalPages: result.data.totalPages,
          isLoading: false,
        });
      } else {
        set({ error: result.error || 'Error al cargar pagos', isLoading: false });
      }
    } catch {
      set({ error: 'Error al cargar pagos', isLoading: false });
    }
  },

  setSelectedPayment: (payment) => set({ selectedPayment: payment }),

  openModal: (payment) => set({ selectedPayment: payment, isModalOpen: true }),

  closeModal: () => set({ selectedPayment: null, isModalOpen: false }),
}));
