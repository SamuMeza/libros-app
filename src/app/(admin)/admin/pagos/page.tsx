'use client';

import { useEffect } from 'react';
import { usePaymentFilters } from '@/lib/hooks/use-payment-filters';
import { approvePayment, rejectPayment } from '@/lib/actions/admin/payments';
import type { Payment } from '@/types/admin';
import PaymentTable from '@/components/admin/payment-table';
import PaymentModal from '@/components/admin/payment-modal';
import PaymentFilters from '@/components/admin/payment-filters';
import TableSkeleton from '@/components/admin/skeletons';

export default function PagosAdminPage() {
  const {
    filters,
    payments,
    total,
    totalPages,
    isLoading,
    selectedPayment,
    isModalOpen,
    setFilters,
    fetchPayments,
    openModal,
    closeModal,
  } = usePaymentFilters();

  useEffect(() => {
    fetchPayments();
  }, [filters, fetchPayments]);

  const handleViewProof = (payment: Payment) => {
    openModal(payment);
  };

  const handleApprove = async (payment: Payment) => {
    const result = await approvePayment(payment.id);
    if (result.success) {
      fetchPayments();
    }
  };

  const handleReject = (payment: Payment) => {
    openModal(payment);
  };

  const handleRejectConfirm = async (payment: Payment) => {
    const result = await rejectPayment(payment.id, 'Rechazado por el administrador');
    if (result.success) {
      closeModal();
      fetchPayments();
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--admin-text)]">
          Verificación de Pagos
        </h1>
        <p className="text-[var(--admin-text-muted)]">
          Gestiona y verifica los pagos pendientes
        </p>
      </div>

      <PaymentFilters filters={filters} onFiltersChange={setFilters} />

      {isLoading ? (
        <div className="admin-card">
          <TableSkeleton rows={5} />
        </div>
      ) : (
        <div className="admin-card">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-[var(--admin-text-muted)]">
              {total} pago{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}
            </p>
          </div>

          <PaymentTable
            payments={payments}
            onViewProof={handleViewProof}
            onApprove={handleApprove}
            onReject={handleReject}
          />

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-[var(--admin-text-muted)]">
                Página {filters.page} de {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilters({ page: filters.page - 1 })}
                  disabled={filters.page === 1}
                  className="admin-button admin-button-ghost"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setFilters({ page: filters.page + 1 })}
                  disabled={filters.page === totalPages}
                  className="admin-button admin-button-ghost"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <PaymentModal
        payment={selectedPayment}
        isOpen={isModalOpen}
        onClose={closeModal}
        onApprove={handleApprove}
        onReject={handleRejectConfirm}
      />
    </div>
  );
}
