'use client';

import type { PaymentFilters as PaymentFiltersType } from '@/types/admin';

interface PaymentFiltersProps {
  filters: PaymentFiltersType;
  onFiltersChange: (filters: PaymentFiltersType) => void;
}

export default function PaymentFilters({ filters, onFiltersChange }: PaymentFiltersProps) {
  const handleChange = (key: keyof PaymentFiltersType, value: string | number) => {
    onFiltersChange({
      ...filters,
      [key]: value,
      page: 1,
    });
  };

  return (
    <div className="admin-card mb-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label htmlFor="filter-status" className="block text-sm font-medium text-[var(--admin-text)] mb-1">
            Estado
          </label>
          <select
            id="filter-status"
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="admin-select"
          >
            <option value="all">Todos</option>
            <option value="pending">Pendientes</option>
            <option value="verified">Verificados</option>
            <option value="rejected">Rechazados</option>
          </select>
        </div>

        <div>
          <label htmlFor="filter-method" className="block text-sm font-medium text-[var(--admin-text)] mb-1">
            Método
          </label>
          <select
            id="filter-method"
            value={filters.method}
            onChange={(e) => handleChange('method', e.target.value)}
            className="admin-select"
          >
            <option value="all">Todos</option>
            <option value="pago_movil">Pago Móvil</option>
            <option value="binance">Binance USDT</option>
            <option value="cuotas">Cuotas</option>
          </select>
        </div>

        <div>
          <label htmlFor="filter-date-from" className="block text-sm font-medium text-[var(--admin-text)] mb-1">
            Fecha desde
          </label>
          <input
            id="filter-date-from"
            type="date"
            value={filters.dateFrom || ''}
            onChange={(e) => handleChange('dateFrom', e.target.value || null)}
            className="admin-input"
          />
        </div>

        <div>
          <label htmlFor="filter-date-to" className="block text-sm font-medium text-[var(--admin-text)] mb-1">
            Fecha hasta
          </label>
          <input
            id="filter-date-to"
            type="date"
            value={filters.dateTo || ''}
            onChange={(e) => handleChange('dateTo', e.target.value || null)}
            className="admin-input"
          />
        </div>
      </div>
    </div>
  );
}
