import type { ShippingAddress, ShippingMethod } from '@/types/order';
import type { ShippingRate } from '@/types/payment';

const SHIPPING_RATES: ShippingRate[] = [
  { id: '1', carrier: 'mrw', min_weight_kg: 0, max_weight_kg: 1, rate_usd: 5, is_active: true },
  { id: '2', carrier: 'mrw', min_weight_kg: 1, max_weight_kg: 3, rate_usd: 8, is_active: true },
  { id: '3', carrier: 'mrw', min_weight_kg: 3, max_weight_kg: 5, rate_usd: 12, is_active: true },
  { id: '4', carrier: 'mrw', min_weight_kg: 5, max_weight_kg: 10, rate_usd: 18, is_active: true },
  { id: '5', carrier: 'zoom', min_weight_kg: 0, max_weight_kg: 1, rate_usd: 4, is_active: true },
  { id: '6', carrier: 'zoom', min_weight_kg: 1, max_weight_kg: 3, rate_usd: 7, is_active: true },
  { id: '7', carrier: 'zoom', min_weight_kg: 3, max_weight_kg: 5, rate_usd: 10, is_active: true },
  { id: '8', carrier: 'zoom', min_weight_kg: 5, max_weight_kg: 10, rate_usd: 15, is_active: true },
];

const SHIPPING_DELIVERY_DAYS: Record<ShippingMethod, { min: number; max: number }> = {
  mrw: { min: 2, max: 5 },
  zoom: { min: 3, max: 7 },
};

export function calculateShippingCost(
  weightKg: number,
  method: ShippingMethod
): number {
  const rate = SHIPPING_RATES.find(
    (r) =>
      r.carrier === method &&
      r.is_active &&
      weightKg >= r.min_weight_kg &&
      weightKg <= r.max_weight_kg
  );

  return rate?.rate_usd || 0;
}

export function getDeliveryDays(method: ShippingMethod): { min: number; max: number } {
  return SHIPPING_DELIVERY_DAYS[method];
}

export function validateShippingAddress(address: ShippingAddress): string[] {
  const errors: string[] = [];

  if (!address.full_name || address.full_name.trim().length < 3) {
    errors.push('El nombre completo es requerido (mínimo 3 caracteres)');
  }

  if (!address.cedula || address.cedula.trim().length < 5) {
    errors.push('La cédula es requerida (mínimo 5 caracteres)');
  }

  if (!address.phone || address.phone.trim().length < 10) {
    errors.push('El teléfono es requerido (mínimo 10 dígitos)');
  }

  if (!address.state || address.state.trim().length === 0) {
    errors.push('El estado es requerido');
  }

  if (!address.city || address.city.trim().length === 0) {
    errors.push('La ciudad es requerida');
  }

  if (!address.address || address.address.trim().length < 10) {
    errors.push('La dirección exacta es requerida (mínimo 10 caracteres)');
  }

  if (!address.reference || address.reference.trim().length < 5) {
    errors.push('El punto de referencia es requerido (mínimo 5 caracteres)');
  }

  return errors;
}

export function generateOrderNumber(brands: ('hl' | 'kc')[], sequence: number): string {
  const year = new Date().getFullYear();
  const brandPrefix = brands.length > 1
    ? 'HL-KC'
    : brands[0] === 'hl'
    ? 'HL'
    : 'KC';
  return `${brandPrefix}-${year}-${sequence.toString().padStart(4, '0')}`;
}

export function calculateOrderTotal(
  itemsSubtotal: number,
  shippingCost: number,
  discountPercent: number = 0
): number {
  const discount = itemsSubtotal * (discountPercent / 100);
  return itemsSubtotal - discount + shippingCost;
}
