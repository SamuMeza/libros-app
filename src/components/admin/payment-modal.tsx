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
  const previousActiveRef = useRef<HTMLElement | null>(null);
  const [zoom, setZoom] = useState(1);

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
  }, [isOpen, getFocusableElements]);

  useEffect(() => {
    if (!isOpen) {
      setZoom(1);
    }
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

  return (
    <div
      ref={modalRef}
      className="admin-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Comprobante de pago"
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
            <div className="flex items-center gap-2">
              {payment.proof_url && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
                    className="admin-button admin-button-ghost p-1"
                    aria-label="Reducir zoom"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line>
                    </svg>
                  </button>
                  <span className="text-xs text-[var(--admin-text-muted)] min-w-[3rem] text-center">
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    onClick={() => setZoom(Math.min(3, zoom + 0.25))}
                    className="admin-button admin-button-ghost p-1"
                    aria-label="Aumentar zoom"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line>
                    </svg>
                  </button>
                  <button
                    onClick={() => setZoom(1)}
                    className="admin-button admin-button-ghost p-1 text-xs"
                    aria-label="Restablecer zoom"
                  >
                    1:1
                  </button>
                </div>
              )}
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
              <div className="relative overflow-auto max-h-[70vh] border border-[var(--admin-border)] rounded-lg">
                <img
                  src={payment.proof_url}
                  alt="Comprobante de pago"
                  className="w-full object-contain transition-transform duration-200"
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
