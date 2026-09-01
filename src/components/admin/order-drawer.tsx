'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
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
  const drawerRef = useRef<aside>(null);
  const previousActiveRef = useRef<HTMLElement | null>(null);

  const getFocusableElements = useCallback(() => {
    if (!drawerRef.current) return [];
    return Array.from(
      drawerRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    );
  }, []);

  const loadOrderDetail = useCallback(async () => {
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
  }, [order]);

  useEffect(() => {
    if (isOpen && order) {
      loadOrderDetail();
      previousActiveRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';

      const timer = setTimeout(() => {
        const focusable = getFocusableElements();
        if (focusable.length > 0) {
          focusable[0].focus();
        }
      }, 100);

      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = '';
      previousActiveRef.current?.focus();
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, order, loadOrderDetail, getFocusableElements]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const focusable = getFocusableElements();
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, getFocusableElements]);

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
        aria-hidden="true"
      />
      
      <aside 
        ref={drawerRef}
        className="admin-drawer open"
        role="dialog"
        aria-modal="true"
        aria-label="Detalle de pedido"
      >
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
                <div key={i} className="admin-skeleton h-24" aria-hidden="true" />
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
