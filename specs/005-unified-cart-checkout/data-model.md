# Data Model: Carrito Unificado y Checkout

**Date**: 2026-08-27

## Entities

### CartItem (carrito_items)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Identificador único |
| user_id | UUID | FK → auth.users(id), ON DELETE CASCADE | Usuario propietario |
| item_type | TEXT | NOT NULL, CHECK IN ('book', 'product') | Tipo de ítem |
| item_id | UUID | NOT NULL | ID del libro o producto |
| quantity | INTEGER | NOT NULL, CHECK > 0 | Cantidad |
| extras | JSONB | DEFAULT '[]' | Extras seleccionados (libros) |
| customization | JSONB | DEFAULT '{}' | Personalización (productos) |
| added_at | TIMESTAMPTZ | DEFAULT NOW() | Fecha de agregado |

**Relationships**:
- `user_id` → `auth.users(id)` — Un usuario tiene muchos ítems en carrito
- `item_id` → `books(id)` o `products(id)` — Polimórfico según item_type

**RLS Policies**:
- Usuarios pueden ver/modificar sus propios ítems: `user_id = auth.uid()`

---

### Order (ordenes)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Identificador único |
| user_id | UUID | FK → auth.users(id), NOT NULL | Usuario propietario |
| order_number | TEXT | NOT NULL, UNIQUE | Número de orden (HL-KC-2026-0089) |
| status | TEXT | NOT NULL, DEFAULT 'pending_payment' | Estado de la orden |
| total_amount | DECIMAL(10,2) | NOT NULL | Total de la orden |
| shipping_cost | DECIMAL(10,2) | DEFAULT 0 | Costo de envío |
| shipping_method | TEXT | CHECK IN ('mrw', 'zoom') | Empresa de envío |
| shipping_address | JSONB | NOT NULL | Dirección de envío |
| payment_method | TEXT | NOT NULL, CHECK IN ('pago_movil', 'binance', 'installments') | Método de pago |
| payment_status | TEXT | NOT NULL, DEFAULT 'pending' | Estado del pago |
| notes | TEXT | | Notas adicionales |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Fecha de creación |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Fecha de actualización |

**State Transitions**:
```
pending_payment → payment_verified → preparing → shipped → in_transit → delivered
                  ↘ cancelled
```

**RLS Policies**:
- Usuarios pueden ver sus propias órdenes: `user_id = auth.uid()`
- Admins pueden gestionar todas las órdenes

---

### SubOrder (sub_ordenes)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Identificador único |
| order_id | UUID | FK → orders(id), ON DELETE CASCADE | Orden maestra |
| brand | TEXT | NOT NULL, CHECK IN ('hl', 'kc') | Marca |
| order_number | TEXT | NOT NULL, UNIQUE | Número de sub-orden |
| status | TEXT | NOT NULL, DEFAULT 'pending_payment' | Estado |
| subtotal | DECIMAL(10,2) | NOT NULL | Subtotal de la marca |
| tracking_number | TEXT | | Número de tracking |
| notes | TEXT | | Notas |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Fecha de creación |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Fecha de actualización |

**Relationships**:
- `order_id` → `orders(id)` — Una orden maestra tiene muchas sub-órdenes

**RLS Policies**:
- Admin HL puede gestionar sub-órdenes HL
- Admin KC puede gestionar sub-órdenes KC

---

### OrderItem (orden_items)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Identificador único |
| sub_order_id | UUID | FK → sub_orders(id), ON DELETE CASCADE | Sub-orden |
| item_type | TEXT | NOT NULL, CHECK IN ('book', 'product') | Tipo de ítem |
| item_id | UUID | NOT NULL | ID del libro o producto |
| item_name | TEXT | NOT NULL | Nombre del ítem |
| item_price | DECIMAL(10,2) | NOT NULL | Precio unitario |
| quantity | INTEGER | NOT NULL | Cantidad |
| extras | JSONB | DEFAULT '[]' | Extras |
| customization | JSONB | DEFAULT '{}' | Personalización |
| subtotal | DECIMAL(10,2) | NOT NULL | Subtotal (price × quantity) |

**Relationships**:
- `sub_order_id` → `sub_orders(id)` — Una sub-orden tiene muchos ítems

---

### Payment (pagos)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Identificador único |
| order_id | UUID | FK → orders(id), NOT NULL | Orden asociada |
| amount | DECIMAL(10,2) | NOT NULL | Monto pagado |
| method | TEXT | NOT NULL, CHECK IN ('pago_movil', 'binance') | Método de pago |
| status | TEXT | NOT NULL, DEFAULT 'pending' | Estado de verificación |
| proof_url | TEXT | | URL del comprobante (Cloudinary) |
| proof_number | TEXT | | Número de referencia/hash |
| notes | TEXT | | Notas del admin |
| verified_by | UUID | FK → auth.users(id) | Admin que verificó |
| verified_at | TIMESTAMPTZ | | Fecha de verificación |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Fecha de creación |

**State Transitions**:
```
pending → verified → (final)
        → rejected → (final)
```

**RLS Policies**:
- Usuarios pueden ver sus propios pagos
- Admins pueden gestionar todos los pagos

---

### PaymentSchedule (cronograma_cuotas)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Identificador único |
| order_id | UUID | FK → orders(id), NOT NULL | Orden asociada |
| installment_number | INTEGER | NOT NULL | Número de cuota (1-4) |
| amount | DECIMAL(10,2) | NOT NULL | Monto de la cuota |
| due_date | DATE | NOT NULL | Fecha límite de pago |
| status | TEXT | NOT NULL, DEFAULT 'pending' | Estado de la cuota |
| payment_id | UUID | FK → payments(id) | Pago asociado |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Fecha de creación |

**State Transitions**:
```
pending → paid → (final)
        → overdue → (final)
```

**RLS Policies**:
- Usuarios pueden ver sus propios cronogramas
- Admins pueden gestionar todos los cronogramas

---

## Configuration Tables

### ShippingRates (configuración_envío)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Identificador único |
| carrier | TEXT | NOT NULL, CHECK IN ('mrw', 'zoom') | Empresa |
| min_weight_kg | DECIMAL(5,2) | NOT NULL | Peso mínimo en kg |
| max_weight_kg | DECIMAL(5,2) | NOT NULL | Peso máximo en kg |
| rate_usd | DECIMAL(10,2) | NOT NULL | Tarifa en USD |
| is_active | BOOLEAN | DEFAULT TRUE | Activa |

---

### ExchangeRate (configuración_tasa_cambio)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Identificador único |
| rate_usd_to_ves | DECIMAL(10,2) | NOT NULL | Tasa USD → VES |
| updated_by | UUID | FK → auth.users(id) | Admin que actualizó |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Última actualización |

---

### InstallmentConfig (configuración_cuotas)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Identificador único |
| min_installments | INTEGER | NOT NULL, DEFAULT 2 | Cuotas mínimas |
| max_installments | INTEGER | NOT NULL, DEFAULT 4 | Cuotas máximas |
| interest_rate | DECIMAL(5,2) | DEFAULT 0 | Tasa de interés (%) |
| is_active | BOOLEAN | DEFAULT TRUE | Activa |

---

## ER Diagram (simplified)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   profiles  │     │  cart_items  │     │   orders    │
│─────────────│     │─────────────│     │─────────────│
│ id (PK)     │←────│ user_id (FK)│     │ id (PK)     │
│ full_name   │     │ item_type   │     │ user_id (FK)│
│ phone       │     │ item_id     │     │ order_number│
│ role        │     │ quantity    │     │ status      │
└─────────────┘     │ extras      │     │ total_amount│
                    │ customization│    │ payment_method│
                    └─────────────┘     └──────┬──────┘
                                               │
                                               ▼
                    ┌─────────────┐     ┌─────────────┐
                    │ sub_orders  │     │  payments   │
                    │─────────────│     │─────────────│
                    │ id (PK)     │     │ id (PK)     │
                    │ order_id(FK)│←────│ order_id(FK)│
                    │ brand       │     │ amount      │
                    │ subtotal    │     │ method      │
                    └──────┬──────┘     │ status      │
                           │            └─────────────┘
                           ▼
                    ┌─────────────┐     ┌─────────────┐
                    │ order_items │     │payment_schedules│
                    │─────────────│     │─────────────│
                    │ id (PK)     │     │ id (PK)     │
                    │sub_order_id │     │ order_id(FK)│
                    │ item_type   │     │ installment │
                    │ item_name   │     │ amount      │
                    │ item_price  │     │ due_date    │
                    └─────────────┘     └─────────────┘
```
