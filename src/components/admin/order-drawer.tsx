'use client';

import { useEffect, useState } from 'react';
import type { SubOrder, AdminOrderDetail } from '@/types/admin';
import { getAdminOrder } from '@/lib/actions/admin/orders';
import OrderTabs from './order-tabs';

interface OrderDrawerProps {
  order: SubOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderDrawer({ order, isOpen, onClose }: OrderDrawerProps) {
  const [orderDetail, setOrderDetail] = useState<AdminOrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && order) {
      loadOrderDetail();
    }
  }, [isOpen, order]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const loadOrderDetail = async () => {
    if (!order) return;
    setIsLoading(true);
    try {
      const result = await getAdminOrder(order.id);
      if (result.success && result.data) {
        setOrderDetail(result.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      <aside className="admin-drawer open">
        <div className="p-4 border-b border-[var(--admin-border)]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--admin-text)]">
              Detalle de Pedido
            </h2>
            <button
              onClick={onClose}
              className="admin-button admin-button-ghost p-2"
              aria-label="Cerrar drawer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="p-4 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="admin-skeleton h-24" />
              ))}
            </div>
          ) : orderDetail ? (
            <OrderTabs orderDetail={orderDetail} onUpdate={loadOrderDetail} />
          ) : (
            <div className="p-4 text-center text-[var(--admin-text-muted)]">
              No se pudo cargar el detalle del pedido
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
