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
          <label htmlFor="order-filter-status" className="block text-sm font-medium text-[var(--admin-text)] mb-1">
            Estado
          </label>
          <select
            id="order-filter-status"
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="admin-select"
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
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--admin-text)] mb-1">
            Página
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleChange('page', Math.max(1, filters.page - 1))}
              disabled={filters.page === 1}
              className="admin-button admin-button-ghost"
            >
              Anterior
            </button>
            <span className="text-sm text-[var(--admin-text-muted)]">
              {filters.page}
            </span>
            <button
              onClick={() => handleChange('page', filters.page + 1)}
              className="admin-button admin-button-ghost"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
