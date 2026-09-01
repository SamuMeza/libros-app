'use client';

import type { Order, SubOrder } from '@/types/admin';
import { formatDate, formatAmount } from '@/lib/utils/order-helpers';

interface OrderListProps {
  orders: (Order & { subOrders: SubOrder[] })[];
  onSelectOrder: (orderId: string) => void;
}

export default function OrderList({ orders, onSelectOrder }: OrderListProps) {
  if (orders.length === 0) {
    return (
      <div className="admin-card text-center py-8">
        <p className="text-[var(--admin-text-muted)]">
          No tienes pedidos aún
        </p>
        <a 
          href="/libros" 
          className="text-[var(--admin-primary)] hover:underline mt-2 inline-block"
        >
          Explorar catálogo
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div 
          key={order.id} 
          className="admin-card cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onSelectOrder(order.id)}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-[var(--admin-text)]">
              Orden #{order.order_number}
            </h3>
            <span className="text-sm text-[var(--admin-text-muted)]">
              {formatDate(order.created_at)}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {order.subOrders.map((subOrder) => (
                <span 
                  key={subOrder.id}
                  className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                    subOrder.brand === 'hl' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {subOrder.brand === 'hl' ? 'HL' : 'KC'}: {subOrder.status}
                </span>
              ))}
            </div>
            <p className="font-semibold text-[var(--admin-text)]">
              {formatAmount(order.total_amount)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
