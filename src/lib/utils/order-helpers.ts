import type { SubOrderStatus } from '@/types/admin';

const STATUS_TRANSITIONS: Record<SubOrderStatus, SubOrderStatus[]> = {
  pending_payment: ['payment_verified', 'cancelled'],
  payment_verified: ['preparing', 'cancelled'],
  preparing: ['shipped', 'cancelled'],
  shipped: ['in_transit', 'cancelled'],
  in_transit: ['delivered', 'cancelled'],
  delivered: [],
  cancelled: [],
};

const STATUS_LABELS: Record<SubOrderStatus, string> = {
  pending_payment: 'Pendiente de Pago',
  payment_verified: 'Pago Verificado',
  preparing: 'Preparando',
  shipped: 'Enviado',
  in_transit: 'En Tránsito',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

const STATUS_COLORS: Record<SubOrderStatus, string> = {
  pending_payment: 'pending',
  payment_verified: 'verified',
  preparing: 'preparing',
  shipped: 'shipped',
  in_transit: 'in_transit',
  delivered: 'delivered',
  cancelled: 'cancelled',
};

export function isValidTransition(
  currentStatus: SubOrderStatus,
  newStatus: SubOrderStatus
): boolean {
  return STATUS_TRANSITIONS[currentStatus]?.includes(newStatus) ?? false;
}

export function getAllowedTransitions(currentStatus: SubOrderStatus): SubOrderStatus[] {
  return STATUS_TRANSITIONS[currentStatus] || [];
}

export function getStatusLabel(status: SubOrderStatus): string {
  return STATUS_LABELS[status] || status;
}

export function getStatusColor(status: SubOrderStatus): string {
  return STATUS_COLORS[status] || 'pending';
}

export function getTransitionError(
  currentStatus: SubOrderStatus,
  newStatus: SubOrderStatus
): string | null {
  if (currentStatus === 'delivered') {
    return 'La orden ya fue entregada';
  }

  if (currentStatus === 'cancelled') {
    return 'La orden fue cancelada';
  }

  if (newStatus === 'pending_payment' && currentStatus !== 'pending_payment') {
    return 'No se puede volver a un estado anterior';
  }

  const allowed = STATUS_TRANSITIONS[currentStatus] || [];
  if (!allowed.includes(newStatus)) {
    return 'No se puede saltar a este estado';
  }

  return null;
}

export function formatOrderNumber(orderNumber: string): string {
  return orderNumber.toUpperCase();
}

export function formatAmount(amount: number): string {
  return new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-VE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatShortDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-VE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function validateShippingAddress(address: {
  full_name: string;
  cedula: string;
  phone: string;
  state: string;
  city: string;
  address: string;
  reference?: string;
}): string[] {
  const errors: string[] = [];

  if (!address.full_name || address.full_name.trim().length < 3) {
    errors.push('El nombre completo debe tener al menos 3 caracteres.');
  }

  if (!address.cedula || address.cedula.trim().length < 6) {
    errors.push('La cédula de identidad es obligatoria y debe ser válida.');
  }

  if (!address.phone || address.phone.trim().length < 10) {
    errors.push('El teléfono de contacto debe tener al menos 10 dígitos.');
  }

  if (!address.state || address.state.trim().length === 0) {
    errors.push('El estado es obligatorio.');
  }

  if (!address.city || address.city.trim().length === 0) {
    errors.push('La ciudad es obligatoria.');
  }

  if (!address.address || address.address.trim().length < 8) {
    errors.push('La dirección detallada debe tener al menos 8 caracteres.');
  }

  return errors;
}

export function getDeliveryDays(method: 'mrw' | 'zoom' | string): { min: number; max: number; toString(): string } {
  if (method === 'zoom') {
    return {
      min: 1,
      max: 3,
      toString() {
        return '1 a 3 días hábiles';
      },
    };
  }
  return {
    min: 2,
    max: 4,
    toString() {
      return '2 a 4 días hábiles';
    },
  };
}
