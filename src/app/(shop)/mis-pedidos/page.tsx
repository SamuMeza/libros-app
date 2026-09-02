'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Order, SubOrder } from '@/types/admin';
import { getClientOrders } from '@/lib/actions/orders';
import OrderList from '@/components/shop/order-list';

export default function MisPedidosPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<(Order & { subOrders: SubOrder[] })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const result = await getClientOrders({ page, limit: 10 });
      if (result.success && result.data) {
        setOrders(result.data.data);
        setTotalPages(result.data.totalPages);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const handleSelectOrder = (orderId: string) => {
    router.push(`/mis-pedidos/${orderId}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--admin-text)]">
          Mis Pedidos
        </h1>
        <p className="text-[var(--admin-text-muted)]">
          Historial y estado de tus pedidos
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="admin-skeleton h-24" />
          ))}
        </div>
      ) : (
        <>
          <OrderList orders={orders} onSelectOrder={handleSelectOrder} />

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="admin-button admin-button-ghost"
              >
                Anterior
              </button>
              <span className="text-sm text-[var(--admin-text-muted)]">
                Página {page} de {totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="admin-button admin-button-ghost"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
