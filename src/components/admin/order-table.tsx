'use client';

import type { SubOrder } from '@/types/admin';
import { getStatusLabel, getStatusColor, formatAmount, formatDate } from '@/lib/utils/order-helpers';

interface OrderTableProps {
  orders: SubOrder[];
  onSelectOrder: (order: SubOrder) => void;
}

export default function OrderTable({ orders, onSelectOrder }: OrderTableProps) {
  if (orders.length === 0) {
    return (
      <div className="admin-card text-center py-8" role="status">
        <p className="text-[var(--admin-text-muted)]">No hay pedidos para mostrar</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="admin-table" role="table" aria-label="Lista de pedidos">
        <thead>
          <tr>
            <th scope="col">Número</th>
            <th scope="col">Marca</th>
            <th scope="col">Estado</th>
            <th scope="col">Subtotal</th>
            <th scope="col">Tracking</th>
            <th scope="col">Fecha</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="font-medium">{order.order_number}</td>
              <td>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  order.brand === 'hl' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {order.brand === 'hl' ? 'Hecho Letras' : 'KamCat'}
                </span>
              </td>
              <td>
                <span className={`admin-badge admin-badge-${getStatusColor(order.status)}`} aria-label={`Estado: ${getStatusLabel(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
              </td>
              <td>{formatAmount(order.subtotal)}</td>
              <td className="text-sm text-[var(--admin-text-muted)]">
                {order.tracking_number || 'Sin tracking'}
              </td>
              <td className="text-sm text-[var(--admin-text-muted)]">
                {formatDate(order.created_at)}
              </td>
              <td>
                <button
                  onClick={() => onSelectOrder(order)}
                  className="admin-button admin-button-primary text-sm"
                  aria-label={`Ver detalle del pedido ${order.order_number}`}
                >
                  Ver detalle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
