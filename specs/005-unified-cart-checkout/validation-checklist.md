# Validation Checklist — Feature 005: Carrito Unificado y Checkout

**Date**: 2026-09-07
**Status**: Pendiente validación manual con DB activa

---

## Infraestructura ✅

- [x] `bun run build` compila sin errores
- [x] `bunx tsc --noEmit` sin errores de tipo
- [x] `bunx vitest run` — 231/231 tests pasan
- [x] Todos los archivos del quickstart existen (23/23)
- [x] Rutas compiladas: /carrito, /checkout, /checkout/confirmacion, /pedidos, /pedidos/[id]

---

## Scenario 1: Agregar Items al Carrito

**Archivos**: `src/app/(shop)/libros/page.tsx`, `src/app/(shop)/kamcat/page.tsx`, `src/components/cart/cart-page.tsx`

- [ ] Navegar a `/libros` → click "Agregar al carrito" en un libro
- [ ] Navegar a `/kamcat` → click "Agregar al carrito" en un producto
- [ ] Navegar a `/carrito`
- [ ] Carrito muestra ambos items
- [ ] Items separados por badges de marca (HL / KC)
- [ ] Subtotales calculados correctamente por marca
- [ ] Total general displayed

---

## Scenario 2: Modificar Items del Carrito

**Archivos**: `src/components/cart/cart-item.tsx`, `src/components/cart/cart-summary.tsx`

- [ ] En `/carrito`, click "+" en cantidad de un libro
- [ ] Click "x" para eliminar un producto
- [ ] Cantidad del libro aumenta en 1
- [ ] Subtotal del libro se actualiza
- [ ] Total general se actualiza
- [ ] Producto eliminado del carrito

---

## Scenario 3: Checkout - Envío

**Archivos**: `src/components/checkout/shipping-step.tsx`, `src/components/checkout/checkout-layout.tsx`

- [ ] Click "Proceder al checkout →"
- [ ] Formulario valida campos requeridos
- [ ] Seleccionar "MRW" como método de envío
- [ ] Costo de envío calculado y displayed
- [ ] Botón "Siguiente →" habilitado

---

## Scenario 4: Checkout - Pago Móvil

**Archivos**: `src/components/checkout/payment-step.tsx`

- [ ] Click "Siguiente →" para ir al paso de pago
- [ ] Seleccionar "Pago Móvil"
- [ ] Datos bancarios mostrados (banco, teléfono, cédula)
- [ ] Monto en VES calculado correctamente (USD × tasa de cambio)
- [ ] Botón "Siguiente →" habilitado

---

## Scenario 5: Checkout - Binance

**Archivos**: `src/components/checkout/payment-step.tsx`

- [ ] Seleccionar "Binance (USDT)"
- [ ] Badge "5% de Descuento aplicado" visible
- [ ] Dirección de wallet mostrada (TRC-20/BEP-20)
- [ ] Botón copy funcional
- [ ] Monto en USDT mostrado (total - 5% descuento)

---

## Scenario 6: Checkout - Plan de Pagos

**Archivos**: `src/components/checkout/payment-step.tsx`, `src/lib/utils/payment-helpers.ts`

- [ ] Seleccionar "Plan de Pagos" (solo si hay libros en carrito)
- [ ] Seleccionar "3 cuotas"
- [ ] Tabla de cuotas muestra 3 filas
- [ ] Monto de cada cuota = total / 3
- [ ] Fechas son quincenales (cada 15 días)
- [ ] Warning: "El despacho se realiza una vez completada la totalidad de las cuotas"

---

## Scenario 7: Checkout - Confirmación

**Archivos**: `src/components/checkout/confirmation-step.tsx`, `src/lib/utils/cloudinary.ts`

- [ ] Click "Siguiente →" para ir al paso de confirmación
- [ ] Subir comprobante de pago (JPG/PNG/PDF, max 5MB)
- [ ] Ingresar número de referencia
- [ ] Click "Completar pedido"
- [ ] Preview del archivo mostrado
- [ ] Número de referencia validado
- [ ] Orden creada exitosamente
- [ ] Redirect a `/pedidos/[orderId]`

---

## Scenario 8: Creación de Orden con Sub-Órdenes

**Archivos**: `src/lib/actions/orders.ts`

- [ ] Checkout completado con libros y productos KamCat
- [ ] Verificar en DB: orden maestra creada con order_number único
- [ ] Sub-orden HL creada con items HL
- [ ] Sub-orden KC creada con items KC
- [ ] Order items creados para cada sub-orden
- [ ] Payment schedules creados si se seleccionaron cuotas
- [ ] Carrito vaciado

---

## Scenario 9: Estado de Carrito Vacío

**Archivos**: `src/components/cart/empty-cart.tsx`

- [ ] Eliminar todos los items del carrito
- [ ] Navegar a `/carrito`
- [ ] Empty state mostrado
- [ ] Links a `/libros` y `/kamcat` displayed

---

## Scenario 10: Verificación de Pagos (Admin)

**Archivos**: `src/lib/actions/admin/payments.ts`, `src/app/(admin)/admin/pagos/page.tsx`

- [ ] Login como admin
- [ ] Navegar a panel admin
- [ ] Encontrar pago pendiente
- [ ] Click "Verificar" y cambiar estado a "verified"
- [ ] Estado del pago actualizado a "verified"
- [ ] Estado de la orden actualizado a "payment_verified"
- [ ] Timestamp de verificación registrado

---

## Pendiente cuando Supabase esté activo

Los scenarios 1-10 requieren una instancia de Supabase activa con:
- Tablas: cart_items, orders, sub_orders, order_items, payments, payment_schedules
- Datos de prueba: al menos 1 libro y 1 producto KamCat
- Usuarios de prueba: 1 usuario regular, 1 admin

**Next steps**: Ejecutar esta validación manual cuando el entorno de desarrollo esté completo.
