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
            aria-describedby="filter-status-desc"
          >
            <option value="all">Todos</option>
            <option value="pending">Pendientes</option>
            <option value="verified">Verificados</option>
            <option value="rejected">Rechazados</option>
          </select>
          <p id="filter-status-desc" className="sr-only">Filtra pagos por estado de verificación</p>
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
            aria-describedby="filter-method-desc"
          >
            <option value="all">Todos</option>
            <option value="pago_movil">Pago Móvil</option>
            <option value="binance">Binance USDT</option>
          </select>
          <p id="filter-method-desc" className="sr-only">Filtra pagos por método de pago</p>
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
            aria-describedby="filter-date-from-desc"
          />
          <p id="filter-date-from-desc" className="sr-only">Filtra pagos desde esta fecha</p>
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
            aria-describedby="filter-date-to-desc"
          />
          <p id="filter-date-to-desc" className="sr-only">Filtra pagos hasta esta fecha</p>
        </div>
      </div>
    </div>
  );
}
