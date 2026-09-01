# Server Actions API Reference

## Overview

All server actions follow the standard return pattern:

```typescript
type ActionResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
}
```

## Admin Payment Actions (`src/lib/actions/admin/payments.ts`)

### getAdminPayments

Obtener lista de pagos con filtros y paginación.

**Input:**
```typescript
{
  status?: 'pending' | 'verified' | 'rejected' | 'all'
  method?: 'pago_movil' | 'binance' | 'all'
  dateFrom?: string
  dateTo?: string
  page?: number
  limit?: number
}
```

**Output:**
```typescript
{
  success: boolean
  data?: {
    payments: Payment[]
    total: number
    page: number
    totalPages: number
  }
  error?: string
}
```

### approvePayment

Aprobar un pago pendiente y actualizar estado de sub-orden.

**Input:**
```typescript
{ paymentId: string }
```

**Side Effects:**
- Payment status → 'verified'
- Sub-order status → 'payment_verified'

### rejectPayment

Rechazar un pago con motivo.

**Input:**
```typescript
{ paymentId: string; reason: string }
```

**Side Effects:**
- Payment status → 'rejected'
- Payment notes → reason

---

## Admin Order Actions (`src/lib/actions/admin/orders.ts`)

### getAdminOrders

Obtener sub-órdenes del admin con filtros y paginación.

**Input:**
```typescript
{
  status?: string
  page?: number
  limit?: number
}
```

### getAdminOrder

Obtener detalle completo de una sub-orden.

**Input:**
```typescript
{ orderId: string }
```

**Output:**
```typescript
{
  success: boolean
  data?: {
    subOrder: SubOrder
    items: OrderItem[]
    payments: Payment[]
    trackingNotes: TrackingNote[]
    client: Profile
    address: Address
  }
  error?: string
}
```

### updateOrderStatus

Actualizar estado de una sub-orden.

**Input:**
```typescript
{
  orderId: string
  status: 'payment_verified' | 'preparing' | 'shipped' | 'in_transit' | 'delivered'
}
```

**Validation:**
- Transition must be allowed (no retroceso, no skip)

---

## Admin Tracking Actions (`src/lib/actions/admin/tracking.ts`)

### addTrackingNote

Agregar nota de tracking geográfico.

**Input:**
```typescript
{
  subOrderId: string
  location: string
  note: string
}
```

### getTrackingNotes

Obtener historial de tracking de una sub-orden.

**Input:**
```typescript
{ subOrderId: string }
```

---

## Client Order Actions (`src/lib/actions/orders.ts`)

### getClientOrders

Obtener historial de pedidos del cliente.

**Input:**
```typescript
{
  page?: number
  limit?: number
}
```

### getClientOrderDetail

Obtener detalle de un pedido del cliente.

**Input:**
```typescript
{ orderId: string }
```

**Output:**
```typescript
{
  success: boolean
  data?: {
    order: Order
    subOrders: {
      hl: SubOrder | null
      kc: SubOrder | null
    }
    items: OrderItem[]
    payments: Payment[]
    paymentSchedule?: PaymentSchedule[]
  }
  error?: string
}
```

---

## Error Handling

| Error Type | Response | User Message |
|------------|----------|--------------|
| Unauthorized | 401 | "Debe iniciar sesión" |
| Forbidden | 403 | "No tiene permisos para esta acción" |
| Not Found | 404 | "Registro no encontrado" |
| Validation Error | 400 | Specific validation message |
| State Conflict | 409 | "Transición de estado no permitida" |
| Server Error | 500 | "Error interno del servidor" |
