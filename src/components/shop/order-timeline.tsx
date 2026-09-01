'use client';

import type { SubOrder } from '@/types/admin';
import { getStatusLabel, getStatusColor, formatDate } from '@/lib/utils/order-helpers';

interface OrderTimelineProps {
  orders: SubOrder[];
}

export default function OrderTimeline({ orders }: OrderTimelineProps) {
  if (orders.length === 0) {
    return null;
  }

  return (
    <div className="admin-timeline">
      {orders.map((order) => (
        <div key={order.id} className="admin-timeline-item">
          <div className={`admin-timeline-dot bg-[var(--admin-${getStatusColor(order.status)})]`} />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[var(--admin-text)]">
                  {order.order_number}
                </p>
                <p className="text-sm text-[var(--admin-text-muted)]">
                  {order.brand === 'hl' ? 'Hecho Letras' : 'KamCat'}
                </p>
              </div>
              <span className={`admin-badge admin-badge-${getStatusColor(order.status)}`}>
                {getStatusLabel(order.status)}
              </span>
            </div>
            <p className="text-xs text-[var(--admin-text-muted)] mt-1">
              {formatDate(order.created_at)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
