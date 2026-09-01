'use client';

import { useState } from 'react';
import type { Payment } from '@/types/admin';

interface PaymentActionsProps {
  payment: Payment;
  onApprove: (payment: Payment) => void;
  onReject: (payment: Payment, reason: string) => void;
}

export default function PaymentActions({ payment, onApprove, onReject }: PaymentActionsProps) {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (payment.status !== 'pending') {
    return null;
  }

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      onApprove(payment);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason || rejectReason.trim().length < 5) {
      return;
    }
    setIsProcessing(true);
    try {
      onReject(payment, rejectReason);
      setShowRejectModal(false);
      setRejectReason('');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <button
          onClick={handleApprove}
          disabled={isProcessing}
          className="admin-button admin-button-success"
        >
          {isProcessing ? 'Procesando...' : 'Aprobar'}
        </button>
        <button
          onClick={() => setShowRejectModal(true)}
          disabled={isProcessing}
          className="admin-button admin-button-danger"
        >
          Rechazar
        </button>
      </div>

      {showRejectModal && (
        <div 
          className="admin-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowRejectModal(false);
              setRejectReason('');
            }
          }}
        >
          <div className="admin-modal max-w-md w-full mx-4">
            <div className="p-4 border-b border-[var(--admin-border)]">
              <h3 className="text-lg font-semibold text-[var(--admin-text)]">
                Rechazar Pago
              </h3>
            </div>
            <div className="p-4">
              <p className="text-sm text-[var(--admin-text-muted)] mb-4">
                Por favor, ingresa el motivo del rechazo. Este motivo será visible para el cliente.
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Motivo del rechazo (mínimo 5 caracteres)"
                className="admin-input min-h-24"
                rows={4}
              />
            </div>
            <div className="p-4 border-t border-[var(--admin-border)] flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                className="admin-button admin-button-ghost"
              >
                Cancelar
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason || rejectReason.trim().length < 5 || isProcessing}
                className="admin-button admin-button-danger"
              >
                {isProcessing ? 'Procesando...' : 'Confirmar Rechazo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
