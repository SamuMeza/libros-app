'use client';

import { useState, useEffect } from 'react';
import type { SubOrder } from '@/types/admin';
import { getAdminOrders } from '@/lib/actions/admin/orders';
import { useOrderFilters } from '@/lib/hooks/use-order-filters';
import { useOrderDrawer } from '@/lib/hooks/use-order-drawer';
import OrderTable from '@/components/admin/order-table';
import OrderDrawer from '@/components/admin/order-drawer';
import OrderFilters from '@/components/admin/order-filters';
import TableSkeleton from '@/components/admin/skeletons';
import ErrorMessage from '@/components/admin/error-message';

export default function PedidosPage() {
  const { filters, setFilters } = useOrderFilters();
  const { isOpen: isDrawerOpen, selectedOrder, openDrawer, closeDrawer } = useOrderDrawer();
  const [orders, setOrders] = useState<SubOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getAdminOrders(filters);
      if (result.success && result.data) {
        setOrders(result.data.data);
        setTotal(result.data.total);
        setTotalPages(result.data.totalPages);
      } else {
        setError(result.error || 'Error al cargar pedidos');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const handleSelectOrder = (order: SubOrder) => {
    openDrawer(order);
  };

  const handleCloseDrawer = () => {
    closeDrawer();
    fetchOrders();
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--admin-text)]">
          Gestión de Pedidos
        </h1>
        <p className="text-[var(--admin-text-muted)]">
          Administra las sub-órdenes y su seguimiento
        </p>
      </div>

      <OrderFilters filters={filters} onFiltersChange={setFilters} />

      {error && (
        <ErrorMessage 
          message={error} 
          onRetry={fetchOrders} 
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
              {total} pedido{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}
            </p>
          </div>

          <OrderTable orders={orders} onSelectOrder={handleSelectOrder} />

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
                  aria-label="Página anterior"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setFilters({ page: filters.page + 1 })}
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

      <OrderDrawer
        order={selectedOrder}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}
