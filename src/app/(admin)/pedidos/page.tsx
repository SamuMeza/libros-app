'use client';

import { useState, useEffect } from 'react';
import type { SubOrder, OrderFilters as OrderFiltersType } from '@/types/admin';
import { getAdminOrders } from '@/lib/actions/admin/orders';
import OrderTable from '@/components/admin/order-table';
import OrderDrawer from '@/components/admin/order-drawer';
import OrderFilters from '@/components/admin/order-filters';

export default function PedidosPage() {
  const [orders, setOrders] = useState<SubOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<SubOrder | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<OrderFiltersType>({
    status: 'all',
    page: 1,
    limit: 20,
  });

  const fetchOrders = async () => {
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
  };

  useEffect(() => {
    fetchOrders();
  }, [filters]);

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
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="admin-skeleton h-12" />
            ))}
          </div>
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
                  onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                  disabled={filters.page === 1}
                  className="admin-button admin-button-ghost"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
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
