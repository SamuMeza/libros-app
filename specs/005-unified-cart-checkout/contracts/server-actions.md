# Server Actions Contract: Carrito Unificado y Checkout

**Date**: 2026-08-27

## Cart Actions (`src/lib/actions/cart.ts`)

### addToCart

```typescript
addToCart(itemId: string, itemType: 'book' | 'product', quantity: number, extras?: BookExtra[], customization?: ProductCustomization): Promise<CartActionResult>
```

**Input Validation**:
- `itemId`: UUID válido
- `itemType`: 'book' o 'product'
- `quantity`: entero > 0
- `extras`: array de objetos BookExtra (opcional)
- `customization`: objeto ProductCustomization (opcional)

**Logic**:
1. Verificar que el usuario esté autenticado
2. Verificar que el ítem exista y esté activo
3. Si el ítem ya existe en el carrito, actualizar cantidad
4. Si no, crear nuevo cart_item
5. Retornar carrito actualizado

**Return**: `{ success: boolean; data?: CartItem; error?: string }`

---

### updateCartItem

```typescript
updateCartItem(cartItemId: string, quantity: number): Promise<CartActionResult>
```

**Input Validation**:
- `cartItemId`: UUID válido
- `quantity`: entero > 0

**Logic**:
1. Verificar que el carrito_item pertenezca al usuario
2. Actualizar cantidad
3. Retornar carrito actualizado

**Return**: `{ success: boolean; data?: CartItem; error?: string }`

---

### removeFromCart

```typescript
removeFromCart(cartItemId: string): Promise<CartActionResult>
```

**Input Validation**:
- `cartItemId`: UUID válido

**Logic**:
1. Verificar que el carrito_item pertenezca al usuario
2. Eliminar carrito_item
3. Retornar carrito actualizado

**Return**: `{ success: boolean; data?: CartItem[]; error?: string }`

---

### getCart

```typescript
getCart(): Promise<CartActionResult>
```

**Logic**:
1. Verificar que el usuario esté autenticado
2. Obtener todos los cart_items del usuario con información del ítem (libro o producto)
3. Calcular subtotales por marca y total general
4. Retornar carrito estructurado

**Return**: `{ success: boolean; data?: Cart; error?: string }`

---

## Order Actions (`src/lib/actions/orders.ts`)

### createOrder

```typescript
createOrder(shippingAddress: ShippingAddress, shippingMethod: 'mrw' | 'zoom', paymentMethod: 'pago_movil' | 'binance' | 'installments', installments?: number): Promise<OrderActionResult>
```

**Input Validation**:
- `shippingAddress`: objeto con nombre, cédula, teléfono, estado, ciudad, dirección, referencia
- `shippingMethod`: 'mrw' o 'zoom'
- `paymentMethod**: 'pago_movil', 'binance' o 'installments'
- `installments`: 2-4 (opcional, requerido si paymentMethod es 'installments')

**Logic**:
1. Verificar que el usuario esté autenticado
2. Obtener carrito del usuario
3. Calcular costo de envío según peso y empresa
4. Calcular total (productos + envío - descuento Binance si aplica)
5. Generar número de orden: `{BRANDS}-YYYY-NNNN`
6. Crear orden maestra
7. Dividir ítems por marca y crear sub-órdenes
8. Crear order_items para cada ítem
9. Si aplica Plan de Pagos, generar payment_schedules
10. Limpiar carrito
11. Retornar orden creada

**Return**: `{ success: boolean; data?: Order; error?: string }`

---

### getOrder

```typescript
getOrder(orderId: string): Promise<OrderActionResult>
```

**Logic**:
1. Verificar que el usuario sea propietario o admin
2. Obtener orden con sub-órdenes, items y pagos
3. Retornar orden estructurada

**Return**: `{ success: boolean; data?: Order; error?: string }`

---

### getOrders

```typescript
getOrders(): Promise<OrdersActionResult>
```

**Logic**:
1. Verificar que el usuario esté autenticado
2. Obtener todas las órdenes del usuario
3. Retornar lista de órdenes

**Return**: `{ success: boolean; data?: Order[]; error?: string }`

---

## Payment Actions (`src/lib/actions/payments.ts`)

### submitPayment

```typescript
submitPayment(orderId: string, method: 'pago_movil' | 'binance', amount: number, proofFile: File, proofNumber: string): Promise<PaymentActionResult>
```

**Input Validation**:
- `orderId`: UUID válido
- `method`: 'pago_movil' o 'binance'
- `amount`: decimal > 0
- `proofFile`: archivo JPG, PNG o PDF, máx. 5MB
- `proofNumber`: string no vacío

**Logic**:
1. Verificar que el usuario sea propietario de la orden
2. Validar tipo y tamaño del archivo
3. Subir archivo a Cloudinary
4. Crear registro de pago con estado 'pending'
5. Retornar pago creado

**Return**: `{ success: boolean; data?: Payment; error?: string }`

---

### getPayments

```typescript
getPayments(orderId: string): Promise<PaymentsActionResult>
```

**Logic**:
1. Verificar que el usuario sea propietario o admin
2. Obtener todos los pagos de la orden
3. Retornar lista de pagos

**Return**: `{ success: boolean; data?: Payment[]; error?: string }`

---

### verifyPayment

```typescript
verifyPayment(paymentId: string, status: 'verified' | 'rejected', notes?: string): Promise<PaymentActionResult>
```

**Logic**:
1. Verificar que el usuario sea admin
2. Actualizar estado del pago
3. Si es el pago completo, actualizar estado de la orden a 'payment_verified'
4. Si es plan de pagos, actualizar cuota correspondiente
5. Retornar pago actualizado

**Return**: `{ success: boolean; data?: Payment; error?: string }`

---

## Utility Functions (`src/lib/utils/`)

### cart-helpers.ts

```typescript
calculateCartSubtotal(items: CartItem[]): { hl: number; kc: number; total: number }
calculateCartTotal(subtotal: number, shippingCost: number, discount: number): number
```

### order-helpers.ts

```typescript
generateOrderNumber(brands: string[]): string
calculateShippingCost(weight: number, carrier: string, rates: ShippingRate[]): number
calculateBinanceDiscount(total: number, discountPercent: number): number
```

### payment-helpers.ts

```typescript
calculateInstallments(total: number, installments: number, config: InstallmentConfig): PaymentSchedule[]
calculateVesAmount(usdAmount: number, exchangeRate: number): number
generateFortnightlyDates(startDate: Date, installments: number): Date[]
```
