'use client';

import type { Order, SubOrder, OrderItem, Payment, PaymentSchedule } from '@/types/admin';
import { getStatusLabel, getStatusColor, formatAmount, formatDate } from '@/lib/utils/order-helpers';
import { getPaymentStatusLabel, getPaymentMethodLabel, formatPaymentAmount } from '@/lib/utils/payment-helpers';
import OrderTimeline from './order-timeline';
import PaymentScheduleComponent from './payment-schedule';

interface OrderDetailProps {
  order: Order;
  subOrders: SubOrder[];
  items: OrderItem[];
  payments: Payment[];
  paymentSchedule?: PaymentSchedule[];
}

export default function OrderDetail({ 
  order, 
  subOrders, 
  items, 
  payments, 
  paymentSchedule 
}: OrderDetailProps) {
  return (
    <div className="space-y-6">
      <div className="admin-card">
        <h2 className="text-lg font-semibold text-[var(--admin-text)] mb-4">
          Resumen de la Orden
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-[var(--admin-text-muted)]">Número de orden</p>
            <p className="font-medium text-[var(--admin-text)]">{order.order_number}</p>
          </div>
          <div>
            <p className="text-sm text-[var(--admin-text-muted)]">Fecha</p>
            <p className="font-medium text-[var(--admin-text)]">{formatDate(order.created_at)}</p>
          </div>
          <div>
            <p className="text-sm text-[var(--admin-text-muted)]">Total</p>
            <p className="font-medium text-[var(--admin-text)]">{formatAmount(order.total_amount)}</p>
          </div>
          <div>
            <p className="text-sm text-[var(--admin-text-muted)]">Estado</p>
            <span className={`admin-badge admin-badge-${getStatusColor(order.status)}`}>
              {getStatusLabel(order.status)}
            </span>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="text-lg font-semibold text-[var(--admin-text)] mb-4">
          Estado por Marca
        </h2>
        <OrderTimeline orders={subOrders} />
      </div>

      <div className="admin-card">
        <h2 className="text-lg font-semibold text-[var(--admin-text)] mb-4">
          Productos
        </h2>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="p-3 bg-[var(--admin-bg)] rounded-lg">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium text-[var(--admin-text)]">{item.item_name}</p>
                  <p className="text-sm text-[var(--admin-text-muted)]">
                    Cantidad: {item.quantity}
                  </p>
                </div>
                <p className="font-medium text-[var(--admin-text)]">
                  {formatAmount(item.subtotal)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <h2 className="text-lg font-semibold text-[var(--admin-text)] mb-4">
          Pagos
        </h2>
        <div className="space-y-3">
          {payments.length === 0 ? (
            <p className="text-sm text-[var(--admin-text-muted)]">No hay pagos registrados</p>
          ) : (
            payments.map((payment) => (
              <div key={payment.id} className="p-3 bg-[var(--admin-bg)] rounded-lg">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium text-[var(--admin-text)]">
                      {getPaymentMethodLabel(payment.method)}
                    </p>
                    <p className="text-sm text-[var(--admin-text-muted)]">
                      Ref: {payment.proof_number || 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-[var(--admin-text)]">
                      {formatPaymentAmount(payment.amount)}
                    </p>
                    <span className={`admin-badge admin-badge-${payment.status}`}>
                      {getPaymentStatusLabel(payment.status)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {paymentSchedule && paymentSchedule.length > 0 && (
        <div className="admin-card">
          <h2 className="text-lg font-semibold text-[var(--admin-text)] mb-4">
            Plan de Pagos
          </h2>
          <PaymentScheduleComponent schedule={paymentSchedule} />
        </div>
      )}
    </div>
  );
}
