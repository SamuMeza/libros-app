'use client';

import { useEffect } from 'react';
import type { Payment } from '@/types/admin';
import { formatPaymentAmount, formatPaymentDate } from '@/lib/utils/payment-helpers';

interface PaymentModalProps {
  payment: Payment | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (payment: Payment) => void;
  onReject: (payment: Payment) => void;
}

export default function PaymentModal({
  payment,
  isOpen,
  onClose,
  onApprove,
  onReject,
}: PaymentModalProps) {
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

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !payment) return null;

  return (
    <div 
      className="admin-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="admin-modal max-w-4xl w-full mx-4">
        <div className="p-4 border-b border-[var(--admin-border)]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--admin-text)]">
              Comprobante de Pago
            </h2>
            <button
              onClick={onClose}
              className="admin-button admin-button-ghost p-2"
              aria-label="Cerrar modal"
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

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-[var(--admin-text-muted)]">Monto</p>
              <p className="font-semibold text-[var(--admin-text)]">
                {formatPaymentAmount(payment.amount)}
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--admin-text-muted)]">Método</p>
              <p className="font-semibold text-[var(--admin-text)]">
                {payment.method === 'pago_movil' ? 'Pago Móvil' : 'Binance USDT'}
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--admin-text-muted)]">Referencia</p>
              <p className="font-semibold text-[var(--admin-text)]">
                {payment.proof_number || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--admin-text-muted)]">Fecha</p>
              <p className="font-semibold text-[var(--admin-text)]">
                {formatPaymentDate(payment.created_at)}
              </p>
            </div>
          </div>

          {payment.proof_url ? (
            <div className="mb-4">
              <p className="text-sm text-[var(--admin-text-muted)] mb-2">
                Comprobante
              </p>
              <div className="relative">
                <img
                  src={payment.proof_url}
                  alt="Comprobante de pago"
                  className="w-full max-h-96 object-contain rounded-lg border border-[var(--admin-border)]"
                />
              </div>
            </div>
          ) : (
            <div className="mb-4 p-8 text-center bg-[var(--admin-bg)] rounded-lg">
              <p className="text-[var(--admin-text-muted)]">
                No hay comprobante disponible
              </p>
            </div>
          )}
        </div>

        {payment.status === 'pending' && (
          <div className="p-4 border-t border-[var(--admin-border)] flex justify-end gap-2">
            <button
              onClick={() => onReject(payment)}
              className="admin-button admin-button-danger"
            >
              Rechazar
            </button>
            <button
              onClick={() => onApprove(payment)}
              className="admin-button admin-button-success"
            >
              Aprobar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
