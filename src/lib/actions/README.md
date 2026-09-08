# Server Actions API Reference

Acciones del servidor organizadas por dominio. Todas retornan `{ success: boolean; data?: T; error?: string }`.

Todas las actions administrativas verifican rol (`admin_hl`, `admin_kc`, `superadmin`) antes de ejecutar.

---

## Auth (`auth.ts`)

| Función | Descripción |
|---|---|
| `signUp(params)` | Registro con email/password. Crea perfil en `profiles`. |
| `signIn(params)` | Login con email/password. |
| `signOut()` | Cierra sesión. |
| `getUser()` | Obtiene usuario actual + perfil. |

---

## Books - Hecho Letras (`books.ts`)

| Función | Descripción |
|---|---|
| `getBooks(filters)` | Catálogo paginado con filtros (categoría, precio, búsqueda). |
| `getBookDetail(bookId)` | Detalle de libro con variantes (tapa, idioma). |

---

## Products - KamCat (`products.ts`)

| Función | Descripción |
|---|---|
| `getProducts(filters)` | Catálogo paginado con filtros (categoría, precio, personalización). |
| `getProductDetail(productId)` | Detalle de producto con variantes y opciones de personalización. |

---

## Cart (`cart.ts`)

| Función | Params | Descripción |
|---|---|---|
| `getCart()` | — | Obtiene items del carrito del usuario actual (batch query, sin N+1). |
| `addToCart(params)` | `{ item_type, item_id, quantity, extras?, customization? }` | Agrega item al carrito. |
| `updateCartItem(params)` | `{ item_id, quantity }` | Actualiza cantidad de un item. |
| `removeFromCart(params)` | `{ item_id }` | Elimina item del carrito. |

---

## Orders (`orders.ts`)

| Función | Params | Descripción |
|---|---|---|
| `getClientOrders(options)` | `{ page?, limit? }` | Lista de órdenes del usuario (paginado). |
| `getClientOrderDetail(orderId)` | `orderId: string` | Detalle completo: orden, sub-órdenes, items, pagos, cronograma. |
| `createOrder(params)` | `{ shipping_address, shipping_method, payment_method, installments? }` | Crea orden desde carrito. |

### createOrder - Lógica especial

- **Stock**: Verifica disponibilidad de books antes de crear.
- **Envío**: Consulta `shipping_config` por costo, fallback a 0.
- **Binance**: Aplica 5% descuento al total.
- **Installments**: Consulta `installment_config` para parámetros, genera `payment_schedules`.
- Limpia carrito después de crear la orden.

---

## Payments (`payments.ts`)

| Función | Params | Descripción |
|---|---|---|
| `submitPayment(params)` | `{ order_id, amount, method, proof_url?, proof_number }` | Registra comprobante de pago. Verifica ownership de la orden. |

---

## Admin - Dashboard (`admin/dashboard.ts`)

| Función | Descripción |
|---|---|
| `getDashboardStats()` | Estadísticas: total órdenes, pagos pendientes, ingresos, órdenes activas, pedidos recientes. Filtra por marca si admin de marca. |

---

## Admin - Payments (`admin/payments.ts`)

| Función | Params | Descripción |
|---|---|---|
| `getAdminPayments(filters)` | `{ status?, method?, dateFrom?, dateTo?, page, limit }` | Lista pagos para admin (paginado, filtrado por marca). |
| `approvePayment(paymentId)` | `paymentId: string` | Aprueba pago y actualiza sub-orden. Verifica ownership de marca. |
| `rejectPayment(paymentId, reason)` | `paymentId: string, reason: string` | Rechaza pago con motivo. Verifica role y ownership. |

---

## Admin - Orders (`admin/orders.ts`)

| Función | Params | Descripción |
|---|---|---|
| `getAdminOrders(filters)` | `{ status?, page?, limit? }` | Lista órdenes para admin (paginado, filtrado por marca). |
| `getAdminOrder(orderId)` | `orderId: string` | Detalle completo para admin: sub-orden, items, pagos, tracking, cliente. |
| `updateOrderStatus(orderId, status)` | `orderId: string, status: SubOrderStatus` | Actualiza estado con transiciones permitidas. |

---

## Admin - Tracking (`admin/tracking.ts`)

| Función | Params | Descripción |
|---|---|---|
| `addTrackingNote(subOrderId, location, note)` | `subOrderId: string, location: string, note: string` | Agrega nota de tracking a una sub-orden. |
| `getTrackingNotes(subOrderId)` | `subOrderId: string` | Lista notas de tracking de una sub-orden. |

---

## Tipos

Todos los tipos están en `src/types/`:

- `admin.ts` — SubOrder, OrderItem, Payment, PaymentSchedule, etc. + constantes `SUB_ORDER_STATUS_LABELS`
- `payment.ts` — PaymentMethodType, PaymentStatusType, InstallmentSchedule, etc.
- `cart.ts` — CartItem, CartItemWithDetails, CartSummary, CartBrandGroup, etc.
- `order.ts` — Order, SubOrder, ShippingAddress, ShippingMethod, PaymentMethod, etc.

---

## Helpers

Funciones puras en `src/lib/utils/`:

- `payment-helpers.ts` — calculateInstallments (configurable), applyBinanceDiscount, convertUsdToVes, formatCurrency, validatePaymentProof
- `cart-helpers.ts` — calculateCartItemSubtotal, groupItemsByBrand, calculateCartSummary, formatCartTotal
- `order-helpers.ts` — validateShippingAddress, getDeliveryDays, getStatusLabel, formatDate, formatAmount
