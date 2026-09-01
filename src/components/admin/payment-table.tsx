'use client';

import type { Payment } from '@/types/admin';
import { getPaymentStatusLabel, getPaymentMethodLabel, formatPaymentAmount, formatPaymentDate } from '@/lib/utils/payment-helpers';

interface PaymentTableProps {
  payments: Payment[];
  onViewProof: (payment: Payment) => void;
  onApprove: (payment: Payment) => void;
  onReject: (payment: Payment) => void;
}

export default function PaymentTable({ 
  payments, 
  onViewProof, 
  onApprove, 
  onReject 
}: PaymentTableProps) {
  if (payments.length === 0) {
    return (
      <div className="admin-card text-center py-8" role="status">
        <p className="text-[var(--admin-text-muted)]">No hay pagos para mostrar</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="admin-table" role="table" aria-label="Lista de pagos">
        <thead>
          <tr>
            <th scope="col">Número Orden</th>
            <th scope="col">Cliente/Teléfono</th>
            <th scope="col">Método</th>
            <th scope="col">Monto</th>
            <th scope="col">Comprobante</th>
            <th scope="col">Estado</th>
            <th scope="col">Fecha</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td className="font-medium">{payment.order_id.slice(0, 8)}...</td>
              <td>
                <div className="text-sm">
                  <div className="font-medium">Cliente</div>
                  <div className="text-[var(--admin-text-muted)]">N/A</div>
                </div>
              </td>
              <td>{getPaymentMethodLabel(payment.method)}</td>
              <td>{formatPaymentAmount(payment.amount)}</td>
              <td>
                {payment.proof_url ? (
                  <button
                    onClick={() => onViewProof(payment)}
                    className="text-[var(--admin-primary)] hover:underline"
                    aria-label={`Ver comprobante de pago ${payment.order_id.slice(0, 8)}`}
                  >
                    Ver comprobante
                  </button>
                ) : (
                  <span className="text-[var(--admin-text-muted)]">Sin comprobante</span>
                )}
              </td>
              <td>
                <span className={`admin-badge admin-badge-${payment.status}`} aria-label={`Estado: ${getPaymentStatusLabel(payment.status)}`}>
                  {getPaymentStatusLabel(payment.status)}
                </span>
              </td>
              <td className="text-sm text-[var(--admin-text-muted)]">
                {formatPaymentDate(payment.created_at)}
              </td>
              <td>
                {payment.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => onApprove(payment)}
                      className="admin-button admin-button-success text-sm"
                      aria-label={`Aprobar pago de ${payment.order_id.slice(0, 8)}`}
                    >
                      Aprobar
                    </button>
                    <button
                      onClick={() => onReject(payment)}
                      className="admin-button admin-button-danger text-sm"
                      aria-label={`Rechazar pago de ${payment.order_id.slice(0, 8)}`}
                    >
                      Rechazar
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
