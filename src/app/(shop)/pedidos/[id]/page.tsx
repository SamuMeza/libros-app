'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import type { Order, SubOrder, OrderItem, Payment, PaymentSchedule } from '@/types/admin';
import { getClientOrderDetail } from '@/lib/actions/orders';
import OrderDetail from '@/components/shop/order-detail';

export default function PedidoDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [subOrders, setSubOrders] = useState<SubOrder[]>([]);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentSchedule, setPaymentSchedule] = useState<PaymentSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId]);

  const fetchOrderDetail = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getClientOrderDetail(orderId);
      if (result.success && result.data) {
        setOrder(result.data.order);
        setSubOrders([result.data.subOrders.hl, result.data.subOrders.kc].filter(Boolean) as SubOrder[]);
        setItems(result.data.items);
        setPayments(result.data.payments);
        if (result.data.paymentSchedule) {
          setPaymentSchedule(result.data.paymentSchedule);
        }
      } else {
        setError(result.error || 'Error al cargar el pedido');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="admin-skeleton h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="admin-card text-center py-8">
          <p className="text-[var(--admin-danger)]">{error}</p>
          <button 
            onClick={() => window.history.back()}
            className="admin-button admin-button-primary mt-4"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="admin-card text-center py-8">
          <p className="text-[var(--admin-text-muted)]">Pedido no encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button 
        onClick={() => window.history.back()}
        className="admin-button admin-button-ghost mb-4"
      >
        ← Volver
      </button>
      
      <OrderDetail
        order={order}
        subOrders={subOrders}
        items={items}
        payments={payments}
        paymentSchedule={paymentSchedule}
      />
    </div>
  );
}
