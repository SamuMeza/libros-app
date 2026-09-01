'use client';

import { useState } from 'react';
import type { AdminOrderDetail, SubOrderStatus } from '@/types/admin';
import { getStatusLabel, formatAmount, getAllowedTransitions, getTransitionError } from '@/lib/utils/order-helpers';
import { updateOrderStatus } from '@/lib/actions/admin/orders';
import TrackingForm from './tracking-form';

interface OrderTabsProps {
  orderDetail: AdminOrderDetail;
  onUpdate: () => void;
}

type TabId = 'productos' | 'pagos' | 'envio' | 'cliente';

const tabs: { id: TabId; label: string }[] = [
  { id: 'productos', label: 'Productos' },
  { id: 'pagos', label: 'Pagos' },
  { id: 'envio', label: 'Envío' },
  { id: 'cliente', label: 'Cliente' },
];

export default function OrderTabs({ orderDetail, onUpdate }: OrderTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('productos');
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { subOrder, items, payments, trackingNotes, client, address } = orderDetail;

  const handleStatusChange = async (newStatus: SubOrderStatus) => {
    const transitionError = getTransitionError(subOrder.status, newStatus);
    if (transitionError) {
      setError(transitionError);
      return;
    }

    setIsUpdating(true);
    setError(null);
    try {
      const result = await updateOrderStatus(subOrder.id, newStatus);
      if (result.success) {
        onUpdate();
      } else {
        setError(result.error || 'Error al actualizar estado');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const allowedTransitions = getAllowedTransitions(subOrder.status);

  return (
    <div>
      <div className="p-4 border-b border-[var(--admin-border)]">
        <div className="mb-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            subOrder.brand === 'hl' 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-purple-100 text-purple-800'
          }`}>
            {subOrder.brand === 'hl' ? 'Hecho Letras' : 'KamCat'}
          </span>
        </div>
        <h3 className="font-semibold text-[var(--admin-text)]">{subOrder.order_number}</h3>
        <p className="text-sm text-[var(--admin-text-muted)]">
          {formatAmount(subOrder.subtotal)}
        </p>
      </div>

      <div className="p-4 border-b border-[var(--admin-border)]">
        <label htmlFor="status-select" className="block text-sm font-medium text-[var(--admin-text)] mb-2">
          Estado actual
        </label>
        <select
          id="status-select"
          value={subOrder.status}
          onChange={(e) => handleStatusChange(e.target.value as SubOrderStatus)}
          disabled={isUpdating || allowedTransitions.length === 0}
          className="admin-select"
          aria-describedby={error ? 'status-error' : undefined}
        >
          <option value={subOrder.status}>
            {getStatusLabel(subOrder.status)}
          </option>
          {allowedTransitions.map((status) => (
            <option key={status} value={status}>
              {getStatusLabel(status)}
            </option>
          ))}
        </select>
        {error && (
          <p id="status-error" className="mt-2 text-sm text-[var(--admin-danger)]" role="alert">{error}</p>
        )}
      </div>

      <div className="admin-tabs px-4" role="tablist" aria-label="Detalle del pedido">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-4">
        {activeTab === 'productos' && (
          <div id="panel-productos" role="tabpanel" aria-labelledby="tab-productos" className="space-y-3">
            {items.length === 0 ? (
              <p className="text-sm text-[var(--admin-text-muted)]">No hay productos</p>
            ) : (
              items.map((item) => (
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
              ))
            )}
          </div>
        )}

        {activeTab === 'pagos' && (
          <div id="panel-pagos" role="tabpanel" aria-labelledby="tab-pagos" className="space-y-3">
            {payments.length === 0 ? (
              <p className="text-sm text-[var(--admin-text-muted)]">No hay pagos registrados</p>
            ) : (
              payments.map((payment) => (
                <div key={payment.id} className="p-3 bg-[var(--admin-bg)] rounded-lg">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium text-[var(--admin-text)]">
                        {payment.method === 'pago_movil' ? 'Pago Móvil' : 'Binance USDT'}
                      </p>
                      <p className="text-sm text-[var(--admin-text-muted)]">
                        Ref: {payment.proof_number || 'N/A'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-[var(--admin-text)]">
                        {formatAmount(payment.amount)}
                      </p>
                      <span className={`admin-badge admin-badge-${payment.status}`}>
                        {payment.status === 'pending' ? 'Pendiente' : 
                         payment.status === 'verified' ? 'Verificado' : 'Rechazado'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'envio' && (
          <div id="panel-envio" role="tabpanel" aria-labelledby="tab-envio" className="space-y-4">
            <div className="p-3 bg-[var(--admin-bg)] rounded-lg">
              <p className="text-sm font-medium text-[var(--admin-text)] mb-1">Dirección</p>
              <p className="text-sm text-[var(--admin-text-muted)]">
                {address ? `${address.street}, ${address.city}, ${address.state}` : 'Sin dirección'}
              </p>
            </div>
            
            <div className="p-3 bg-[var(--admin-bg)] rounded-lg">
              <p className="text-sm font-medium text-[var(--admin-text)] mb-1">Tracking</p>
              <p className="text-sm text-[var(--admin-text-muted)]">
                {subOrder.tracking_number || 'Sin número de tracking'}
              </p>
            </div>

            <TrackingForm 
              subOrderId={subOrder.id} 
              existingNotes={trackingNotes}
              onNoteAdded={onUpdate}
            />
          </div>
        )}

        {activeTab === 'cliente' && (
          <div id="panel-cliente" role="tabpanel" aria-labelledby="tab-cliente" className="space-y-3">
            <div className="p-3 bg-[var(--admin-bg)] rounded-lg">
              <p className="text-sm font-medium text-[var(--admin-text)] mb-1">Nombre</p>
              <p className="text-sm text-[var(--admin-text-muted)]">
                {client?.full_name || 'Sin nombre'}
              </p>
            </div>
            <div className="p-3 bg-[var(--admin-bg)] rounded-lg">
              <p className="text-sm font-medium text-[var(--admin-text)] mb-1">Teléfono</p>
              <p className="text-sm text-[var(--admin-text-muted)]">
                {client?.phone || 'Sin teléfono'}
              </p>
            </div>
            <div className="p-3 bg-[var(--admin-bg)] rounded-lg">
              <p className="text-sm font-medium text-[var(--admin-text)] mb-1">Email</p>
              <p className="text-sm text-[var(--admin-text-muted)]">
                No disponible
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
