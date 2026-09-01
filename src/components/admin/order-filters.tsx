'use client';

import type { OrderFilters as OrderFiltersType } from '@/types/admin';

interface OrderFiltersProps {
  filters: OrderFiltersType;
  onFiltersChange: (filters: OrderFiltersType) => void;
}

export default function OrderFilters({ filters, onFiltersChange }: OrderFiltersProps) {
  const handleChange = (key: keyof OrderFiltersType, value: string | number) => {
    onFiltersChange({
      ...filters,
      [key]: value,
      page: 1,
    });
  };

  return (
    <div className="admin-card mb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="filter-order-status" className="block text-sm font-medium text-[var(--admin-text)] mb-1">
            Estado
          </label>
          <select
            id="filter-order-status"
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="admin-select"
            aria-describedby="filter-order-status-desc"
          >
            <option value="all">Todos</option>
            <option value="pending_payment">Pendiente de Pago</option>
            <option value="payment_verified">Pago Verificado</option>
            <option value="preparing">Preparando</option>
            <option value="shipped">Enviado</option>
            <option value="in_transit">En Tránsito</option>
            <option value="delivered">Entregado</option>
            <option value="cancelled">Cancelado</option>
          </select>
          <p id="filter-order-status-desc" className="sr-only">Filtra pedidos por estado de la sub-orden</p>
        </div>

        <div>
          <label htmlFor="filter-order-page" className="block text-sm font-medium text-[var(--admin-text)] mb-1">
            Página
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleChange('page', Math.max(1, filters.page - 1))}
              disabled={filters.page === 1}
              className="admin-button admin-button-ghost"
              aria-label="Página anterior"
            >
              Anterior
            </button>
            <span id="filter-order-page" className="text-sm text-[var(--admin-text-muted)]" aria-live="polite">
              {filters.page}
            </span>
            <button
              onClick={() => handleChange('page', filters.page + 1)}
              className="admin-button admin-button-ghost"
              aria-label="Página siguiente"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
