'use client';

import { useState } from 'react';
import type { ShippingAddress, ShippingMethod } from '@/types/order';
import { validateShippingAddress, getDeliveryDays } from '@/lib/utils/order-helpers';

interface ShippingStepProps {
  data: {
    shipping_address: ShippingAddress;
    shipping_method: ShippingMethod;
  };
  onComplete: (data: {
    shipping_address: ShippingAddress;
    shipping_method: ShippingMethod;
  }) => void;
}

const VENEZUELAN_STATES = [
  'Amazonas', 'Anzoátegui', 'Apure', 'Aragua', 'Barinas', 'Bolívar',
  'Carabobo', 'Cojedes', 'Delta Amacuro', 'Distrito Capital', 'Falcón',
  'Guárico', 'Lara', 'Mérida', 'Miranda', 'Monagas', 'Nueva Esparta',
  'Portuguesa', 'Sucre', 'Táchira', 'Trujillo', 'Vargas', 'Yaracuy', 'Zulia',
];

export default function ShippingStep({ data, onComplete }: ShippingStepProps) {
  const [address, setAddress] = useState<ShippingAddress>(data.shipping_address);
  const [method, setMethod] = useState<ShippingMethod>(data.shipping_method);
  const [errors, setErrors] = useState<string[]>([]);

  const handleFieldChange = (field: keyof ShippingAddress, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
    setErrors([]);
  };

  const handleSubmit = () => {
    const validationErrors = validateShippingAddress(address);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    onComplete({ shipping_address: address, shipping_method: method });
  };

  const deliveryDays = getDeliveryDays(method);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Dirección de Envío</h2>

      {errors.length > 0 && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <ul className="list-inside list-disc space-y-1">
            {errors.map((error) => (
              <li key={error} className="text-sm text-destructive">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="full_name" className="mb-1 block text-sm font-medium text-foreground">
            Nombre Completo *
          </label>
          <input
            id="full_name"
            type="text"
            value={address.full_name}
            onChange={(e) => handleFieldChange('full_name', e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:border-[var(--hl-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--hl-primary)]"
            placeholder="Juan Pérez"
          />
        </div>

        <div>
          <label htmlFor="cedula" className="mb-1 block text-sm font-medium text-foreground">
            Cédula *
          </label>
          <input
            id="cedula"
            type="text"
            value={address.cedula}
            onChange={(e) => handleFieldChange('cedula', e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:border-[var(--hl-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--hl-primary)]"
            placeholder="V-12345678"
          />
        </div>

        <div>
          <label htmlFor="phone" className="mb-1 block text-sm font-medium text-foreground">
            Teléfono *
          </label>
          <input
            id="phone"
            type="tel"
            value={address.phone}
            onChange={(e) => handleFieldChange('phone', e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:border-[var(--hl-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--hl-primary)]"
            placeholder="0412-1234567"
          />
        </div>

        <div>
          <label htmlFor="state" className="mb-1 block text-sm font-medium text-foreground">
            Estado *
          </label>
          <select
            id="state"
            value={address.state}
            onChange={(e) => handleFieldChange('state', e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-[var(--hl-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--hl-primary)]"
          >
            <option value="">Seleccionar estado</option>
            {VENEZUELAN_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="city" className="mb-1 block text-sm font-medium text-foreground">
            Ciudad *
          </label>
          <input
            id="city"
            type="text"
            value={address.city}
            onChange={(e) => handleFieldChange('city', e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:border-[var(--hl-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--hl-primary)]"
            placeholder="Caracas"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="address" className="mb-1 block text-sm font-medium text-foreground">
            Dirección Exacta *
          </label>
          <input
            id="address"
            type="text"
            value={address.address}
            onChange={(e) => handleFieldChange('address', e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:border-[var(--hl-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--hl-primary)]"
            placeholder="Av. Principal, Edif. 10, Piso 5, Apt. 52"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="reference" className="mb-1 block text-sm font-medium text-foreground">
            Punto de Referencia *
          </label>
          <input
            id="reference"
            type="text"
            value={address.reference}
            onChange={(e) => handleFieldChange('reference', e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground placeholder:text-muted-foreground focus:border-[var(--hl-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--hl-primary)]"
            placeholder="Frente al CCD Sambil"
          />
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-foreground">Método de Envío *</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setMethod('mrw')}
            className={`rounded-lg border-2 p-4 text-left transition-colors ${
              method === 'mrw'
                ? 'border-[var(--hl-primary)] bg-[var(--hl-primary)]/5'
                : 'border-border hover:border-[var(--hl-primary)]/50'
            }`}
          >
            <div className="font-medium text-foreground">MRW</div>
            <div className="text-sm text-muted-foreground">
              {deliveryDays.min}-{deliveryDays.max} días hábiles
            </div>
          </button>
          <button
            type="button"
            onClick={() => setMethod('zoom')}
            className={`rounded-lg border-2 p-4 text-left transition-colors ${
              method === 'zoom'
                ? 'border-[var(--hl-primary)] bg-[var(--hl-primary)]/5'
                : 'border-border hover:border-[var(--hl-primary)]/50'
            }`}
          >
            <div className="font-medium text-foreground">Zoom</div>
            <div className="text-sm text-muted-foreground">
              {deliveryDays.min}-{deliveryDays.max} días hábiles
            </div>
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        className="w-full rounded-lg bg-[var(--hl-primary)] px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-[var(--hl-primary)]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hl-primary)] focus-visible:ring-offset-2"
      >
        Continuar al Pago
      </button>
    </div>
  );
}
