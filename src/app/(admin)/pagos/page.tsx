'use client';

import { useState, useEffect } from 'react';
import type { Payment } from '@/types/admin';
import { getAdminPayments, approvePayment, rejectPayment } from '@/lib/actions/admin/payments';
import { usePaymentFilters } from '@/lib/hooks/use-payment-filters';
import PaymentTable from '@/components/admin/payment-table';
import PaymentModal from '@/components/admin/payment-modal';
import PaymentFilters from '@/components/admin/payment-filters';
import TableSkeleton from '@/components/admin/skeletons';
import ErrorMessage from '@/components/admin/error-message';

export default function PagosPage() {
  const { filters, setFilters } = usePaymentFilters();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPayments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getAdminPayments(filters);
      if (result.success && result.data) {
        setPayments(result.data.data);
        setTotal(result.data.total);
        setTotalPages(result.data.totalPages);
      } else {
        setError(result.error || 'Error al cargar pagos');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [filters]);

  const handleViewProof = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const handleApprove = async (payment: Payment) => {
    const result = await approvePayment(payment.id);
    if (result.success) {
      fetchPayments();
    }
  };

  const handleReject = async (payment: Payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const handleRejectConfirm = async (reason: string) => {
    if (!selectedPayment) return;
    const result = await rejectPayment(selectedPayment.id, reason);
    if (result.success) {
      setIsModalOpen(false);
      setSelectedPayment(null);
      fetchPayments();
    }
  };

  const handlePageChange = (page: number) => {
    setFilters({ page });
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

      {error && (
        <ErrorMessage 
          message={error} 
          onRetry={fetchPayments} 
        />
      )}

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
                  onClick={() => handlePageChange(filters.page - 1)}
                  disabled={filters.page === 1}
                  className="admin-button admin-button-ghost"
                  aria-label="Página anterior"
                >
                  Anterior
                </button>
                <button
                  onClick={() => handlePageChange(filters.page + 1)}
                  disabled={filters.page === totalPages}
                  className="admin-button admin-button-ghost"
                  aria-label="Página siguiente"
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
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPayment(null);
        }}
        onApprove={handleApprove}
        onReject={handleRejectConfirm}
      />
    </div>
  );
}
