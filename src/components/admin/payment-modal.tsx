'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
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
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [showConfirmApprove, setShowConfirmApprove] = useState(false);

  const getFocusableElements = useCallback(() => {
    if (!modalRef.current) return [];
    return Array.from(
      modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    );
  }, []);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      setTimeout(() => closeButtonRef.current?.focus(), 0);
    } else {
      document.body.style.overflow = '';
      previousFocusRef.current?.focus();
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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

  if (!isOpen || !payment) return null;

  const paymentId = payment.id;

  return (
    <div
      key={paymentId}
      className="admin-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="admin-modal max-w-4xl w-full mx-4" ref={modalRef}>
        <div className="p-4 border-b border-[var(--admin-border)]">
          <div className="flex items-center justify-between">
            <h2 id="payment-modal-title" className="text-lg font-semibold text-[var(--admin-text)]">
              Comprobante de Pago
            </h2>
            <button
              ref={closeButtonRef}
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
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-[var(--admin-text-muted)]">Comprobante</p>
                <div className="flex items-center gap-2" role="group" aria-label="Controles de zoom">
                  <button
                    onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
                    className="admin-button admin-button-ghost text-sm px-2 py-1"
                    aria-label="Alejar"
                    disabled={zoom <= 0.5}
                  >
                    −
                  </button>
                  <span className="text-sm text-[var(--admin-text-muted)] min-w-12 text-center" aria-live="polite">
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
                    className="admin-button admin-button-ghost text-sm px-2 py-1"
                    aria-label="Acercar"
                    disabled={zoom >= 3}
                  >
                    +
                  </button>
                  <button
                    onClick={() => setZoom(1)}
                    className="admin-button admin-button-ghost text-sm px-2 py-1"
                    aria-label="Restablecer zoom"
                  >
                    Restablecer
                  </button>
                </div>
              </div>
              <div className="relative overflow-auto max-h-96 rounded-lg border border-[var(--admin-border)]">
                <img
                  src={payment.proof_url}
                  alt="Comprobante de pago"
                  className="w-full object-contain rounded-lg transition-transform duration-200"
                  style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
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
            {showConfirmApprove ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-[var(--admin-text-muted)]">¿Confirmar?</span>
                <button
                  onClick={() => {
                    setShowConfirmApprove(false);
                    onApprove(payment);
                  }}
                  className="admin-button admin-button-success"
                >
                  Sí, aprobar
                </button>
                <button
                  onClick={() => setShowConfirmApprove(false)}
                  className="admin-button admin-button-ghost"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirmApprove(true)}
                className="admin-button admin-button-success"
              >
                Aprobar
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
