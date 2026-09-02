'use client';

import { useState, useEffect, useCallback } from 'react';
import type { SubOrder } from '@/types/admin';
import { getAdminOrders } from '@/lib/actions/admin/orders';
import { useOrderFilters } from '@/lib/hooks/use-order-filters';
import OrderTable from '@/components/admin/order-table';
import OrderDrawer from '@/components/admin/order-drawer';
import OrderFilters from '@/components/admin/order-filters';
import TableSkeleton from '@/components/admin/skeletons';

export default function PedidosPage() {
  const [orders, setOrders] = useState<SubOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<SubOrder | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { filters, setFilters } = useOrderFilters();

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getAdminOrders(filters);
      if (result.success && result.data) {
        setOrders(result.data.data);
        setTotal(result.data.total);
        setTotalPages(result.data.totalPages);
      }
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleSelectOrder = (order: SubOrder) => {
    setSelectedOrder(order);
    setIsDrawerOpen(true);
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

      <OrderDrawer
        order={selectedOrder}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedOrder(null);
          fetchOrders();
        }}
      />
    </div>
  );
}
