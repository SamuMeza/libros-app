# Server Actions: Panel Administrativo y Tracking

**Feature**: 006-admin-panels-tracking
**Date**: 2026-08-27
**Location**: `src/lib/actions/`

## Payment Verification Actions

### getPayments

**Purpose**: Obtener lista de pagos con filtros y paginación

**Input**:
```typescript
{
  status?: 'pending' | 'verified' | 'rejected' | 'all'
  method?: 'pago_movil' | 'binance' | 'all'
  dateFrom?: string // ISO date
  dateTo?: string // ISO date
  page?: number // default 1
  limit?: number // default 20
}
```

**Output**:
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

**RLS**: Admin sees only payments for orders with sub-orders of their brand

---

### approvePayment

**Purpose**: Aprobar un pago pendiente y actualizar estado de sub-orden

**Input**:
```typescript
{
  paymentId: string
}
```

**Output**:
```typescript
{
  success: boolean
  data?: {
    payment: Payment
    subOrder: SubOrder
  }
  error?: string
}
```

**Side Effects**:
- Payment status → 'verified'
- Sub-order status → 'payment_verified'
- Email notification sent to client

**Validation**:
- Payment must be in 'pending' state
- Payment amount must match order total

---

### rejectPayment

**Purpose**: Rechazar un pago con motivo

**Input**:
```typescript
{
  paymentId: string
  reason: string // Motivo obligatorio
}
```

**Output**:
```typescript
{
  success: boolean
  data?: {
    payment: Payment
  }
  error?: string
}
```

**Side Effects**:
- Payment status → 'rejected'
- Payment notes → reason
- Sub-order stays in 'pending_payment'

**Validation**:
- Payment must be in 'pending' state
- Reason must not be empty

---

## Order Management Actions

### getOrders

**Purpose**: Obtener sub-órdenes del admin con filtros y paginación

**Input**:
```typescript
{
  status?: string // Filtrar por estado
  page?: number // default 1
  limit?: number // default 20
}
```

**Output**:
```typescript
{
  success: boolean
  data?: {
    orders: SubOrder[]
    total: number
    page: number
    totalPages: number
  }
  error?: string
}
```

**RLS**: Admin sees only sub-orders of their brand (hl or kc)

---

### getOrder

**Purpose**: Obtener detalle completo de una sub-orden

**Input**:
```typescript
{
  orderId: string
}
```

**Output**:
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

**RLS**: Admin can only access sub-orders of their brand

---

### updateOrderStatus

**Purpose**: Actualizar estado de una sub-orden

**Input**:
```typescript
{
  orderId: string
  status: 'payment_verified' | 'preparing' | 'shipped' | 'in_transit' | 'delivered'
}
```

**Output**:
```typescript
{
  success: boolean
  data?: {
    subOrder: SubOrder
  }
  error?: string
}
```

**Side Effects**:
- Sub-order status updated
- Email notification sent to client
- State transition logged in bitácora

**Validation**:
- Transition must be allowed (no retroceso, no skip)
- Invalid transitions return error message

---

## Tracking Actions

### addTrackingNote

**Purpose**: Agregar nota de tracking geográfico

**Input**:
```typescript
{
  subOrderId: string
  location: string // Ubicación (ej: Maracaibo, Caracas)
  note: string // Descripción
}
```

**Output**:
```typescript
{
  success: boolean
  data?: {
    trackingNote: TrackingNote
  }
  error?: string
}
```

**Side Effects**:
- Tracking note created with timestamp
- Admin creator recorded (verified_by)

**RLS**: Admin can only add notes to sub-orders of their brand

---

### getTrackingNotes

**Purpose**: Obtener historial de tracking de una sub-orden

**Input**:
```typescript
{
  subOrderId: string
}
```

**Output**:
```typescript
{
  success: boolean
  data?: {
    notes: TrackingNote[]
  }
  error?: string
}
```

**RLS**: Admin can only view notes for sub-orders of their brand

---

## Client Actions (Shop)

### getClientOrders

**Purpose**: Obtener historial de pedidos del cliente

**Input**:
```typescript
{
  page?: number // default 1
  limit?: number // default 20
}
```

**Output**:
```typescript
{
  success: boolean
  data?: {
    orders: Order[]
    total: number
    page: number
    totalPages: number
  }
  error?: string
}
```

**RLS**: Client sees only their own orders

---

### getClientOrderDetail

**Purpose**: Obtener detalle de un pedido del cliente

**Input**:
```typescript
{
  orderId: string
}
```

**Output**:
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

**RLS**: Client can only access their own orders

---

## Return Pattern

All server actions follow the standard return pattern:

```typescript
type ActionResult<T> = {
  success: boolean
  data?: T
  error?: string
}
```

## Error Handling

| Error Type | Response | User Message |
|------------|----------|--------------|
| Unauthorized | 401 | "Debe iniciar sesión" |
| Forbidden | 403 | "No tiene permisos para esta acción" |
| Not Found | 404 | "Registro no encontrado" |
| Validation Error | 400 | Specific validation message |
| State Conflict | 409 | "Transición de estado no permitida" |
| Server Error | 500 | "Error interno del servidor" |
