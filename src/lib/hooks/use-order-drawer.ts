import { create } from 'zustand';
import type { SubOrder } from '@/types/admin';

interface OrderDrawerStore {
  isOpen: boolean;
  selectedOrder: SubOrder | null;
  openDrawer: (order: SubOrder) => void;
  closeDrawer: () => void;
}

export const useOrderDrawer = create<OrderDrawerStore>((set) => ({
  isOpen: false,
  selectedOrder: null,
  openDrawer: (order) => set({ isOpen: true, selectedOrder: order }),
  closeDrawer: () => set({ isOpen: false, selectedOrder: null }),
}));
