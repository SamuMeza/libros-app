# Feature Specification: Carrito Unificado y Checkout

**Feature Branch**: `005-unified-cart-checkout`

**Created**: 2026-08-27

**Status**: Draft

**Input**: User description: "Genera la especificación técnica para el carrito y checkout unificado"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver y Gestionar Carrito Unificado (Priority: P1)

El usuario puede ver todos los productos en su carrito, independientemente de si son libros (Hecho Letras) o productos KamCat. Puede modificar cantidades, eliminar ítems y ver subtotales separados por marca.

**Why this priority**: Es la base del flujo de compra. Sin carrito funcional, no hay checkout.

**Independent Test**: Agregar libros y productos KamCat al carrito, verificar que aparecen separados por marca con subtotales correctos.

**Acceptance Scenarios**:

1. **Given** el usuario tiene libros y productos KamCat en el carrito, **When** abre la página /carrito, **Then** ve los ítems separados por marca con subtotales individuales.
2. **Given** el usuario tiene un libro con extras en el carrito, **When** modifica la cantidad, **Then** el subtotal del libro y el total general se actualizan correctamente.
3. **Given** el usuario tiene productos KamCat con personalización, **When** ve el carrito, **Then** la personalización es visible pero no editable (debe eliminar y volver a agregar).
4. **Given** el carrito está vacío, **When** el usuario accede a /carrito, **Then** ve un estado vacío con enlaces a /libros y /kamcat.

---

### User Story 2 - Completar Checkout con Envío y Pago (Priority: P2)

El usuario puede completar el proceso de checkout en 3 pasos: seleccionar dirección y método de envío, elegir método de pago, y subir comprobante de pago.

**Why this priority**: Es el flujo esencial de conversión. Sin checkout, no hay ventas.

**Independent Test**: Iniciar checkout desde el carrito, completar los 3 pasos, verificar que la orden se crea correctamente.

**Acceptance Scenarios**:

1. **Given** el usuario está en el paso 1 (Envío), **When** ingresa dirección y selecciona MRW o Zoom, **Then** el costo de envío se calcula y el avance al paso 2 es posible.
2. **Given** el usuario está en el paso 2 (Pago), **When** selecciona Pago Móvil, **Then** ve los datos bancarios y el monto en Bolívares calculado a tasa de cambio fija configurada por administrador.
3. **Given** el usuario está en el paso 2 (Pago), **When** selecciona Binance, **Then** ve el descuento del 5% aplicado y la dirección de billetera con botón de copiar.
4. **Given** el usuario tiene libros en la orden, **When** selecciona Plan de Pagos, **Then** ve el desglose de 2-4 cuotas quincenales con fechas y montos.
5. **Given** el usuario está en el paso 3 (Confirmación), **When** sube comprobante e ingresa referencia, **Then** puede completar el pedido.

---

### User Story 3 - Crear Orden con Sub-Órdenes Automáticas (Priority: P3)

El sistema crea automáticamente una orden maestra y sub-órdenes separadas por marca cuando el usuario completa el checkout.

**Why this priority**: Permite la gestión independiente de pedidos por cada administrador de marca.

**Independent Test**: Completar un checkout con productos de ambas marcas, verificar que se crea la orden maestra y sub-órdenes separadas.

**Acceptance Scenarios**:

1. **Given** el usuario completa el checkout con libros y productos KamCat, **When** se procesa la orden, **Then** se crea una orden maestra con ID único y sub-órdenes separadas para HL y KC.
2. **Given** la orden usa Plan de Pagos, **When** se crea la orden, **Then** se genera el cronograma de cuotas quincenales en payment_schedules.
3. **Given** el usuario selecciona Binance, **When** se calcula el total, **Then** se aplica el descuento del 5% al total.

---

### Edge Cases

1. **Libros con Plan de Pagos + productos KamCat en la misma orden**: El precio final es un solo monto que incluye el libro + productos adicionales. El Plan de Pagos aplica sobre el total de la orden (libros + KamCat).
2. **Errores de cálculo de tasa de cambio para Pago Móvil**: Si la tasa no está configurada o falla, el sistema muestra un mensaje informativo. El usuario puede verificar el precio del dólar en el Banco Central de Venezuela y calcular el monto manualmente para realizar el pago.
3. **Comprobante de pago que no coincide con el monto**: La orden se pausa. El usuario debe contactar al administrador para verificar el pago. Si no hay acuerdo, la orden se cancela.
4. **Producto agotado durante checkout**: El sistema valida disponibilidad antes de crear la orden. Si un producto no está disponible, se notifica al usuario y se le permite eliminarlo o actualizar el carrito antes de continuar.

## Requirements *(mandatory)*

### Functional Requirements

**Carrito Unificado:**
- **FR-CT1**: El carrito MUST soportar simultáneamente ítems de tipo "book" (libros HL) y "product" (KamCat).
- **FR-CT2**: El carrito MUST mostrar separadores visuales y badges de marca cuando coexistan ítems de ambas marcas.
- **FR-CT3**: El carrito MUST calcular subtotales por marca y un total general (ver SC-002 para umbral de latencia).
- **FR-CT4**: El usuario MUST poder modificar cantidades y eliminar ítems del carrito.
- **FR-CT5**: El carrito MUST persistir en la base de datos para el usuario autenticado.
- **FR-CT6**: El carrito MUST mostrar un estado vacío con enlaces a los catálogos.

**Checkout - Paso 1 (Envío):**
- **FR-CK1**: El formulario MUST capturar: nombre completo, cédula, teléfono, estado, ciudad, dirección exacta y punto de referencia.
- **FR-CK2**: El usuario MUST poder seleccionar entre MRW (2-5 días hábiles) y Zoom (3-7 días hábiles).
- **FR-CK3**: El costo de envío MUST calcularse según el peso total del paquete y la empresa seleccionada.

**Checkout - Paso 2 (Pago):**
- **FR-CK4**: Pago Móvil MUST mostrar datos bancarios destino y monto calculado en Bolívares a tasa de cambio fija configurada por administrador.
- **FR-CK5**: Binance MUST aplicar descuento del 5% y mostrar dirección de billetera (TRC-20/BEP-20) con botón de copiar.
- **FR-CK6**: Plan de Pagos MUST estar disponible solo si hay libros en la orden.
- **FR-CK7**: Plan de Pagos MUST permitir seleccionar 2, 3 o 4 cuotas quincenales con monto configurable por administrador.
- **FR-CK8**: Plan de Pagos MUST mostrar tabla visual con cronograma de fechas y montos calculados según configuración del admin.

**Checkout - Paso 3 (Confirmación):**
- **FR-CK9**: El usuario MUST poder subir comprobante de pago (JPG, PNG, PDF, máx. 5MB).
- **FR-CK10**: El usuario MUST ingresar número de referencia bancaria o hash de transacción.
- **FR-CK11**: El sistema MUST validar que el archivo subido sea uno de los formatos permitidos.

**Server Action createOrder:**
- **FR-OR1**: El sistema MUST crear una orden maestra en la tabla orders con ID único.
- **FR-OR2**: El sistema MUST dividir automáticamente la orden en sub-órdenes por marca (hl y kc).
- **FR-OR3**: El sistema MUST crear order_items para cada ítem de la sub-orden.
- **FR-OR4**: Si aplica Plan de Pagos, el sistema MUST generar payment_schedules con cuotas quincenales.
- **FR-OR5**: El sistema MUST calcular el total de la orden incluyendo envío y descuentos.

**Pruebas Unitarias:**
- **FR-TST1**: MUST existir pruebas unitarias para calculateInstallments (cálculo de cuotas).
- **FR-TST2**: MUST existir pruebas unitarias para totalizadores de carrito y orden.

### Key Entities

- **Cart**: Ítems del carrito con tipo (book/product), cantidad, extras y personalización.
- **Order**: Orden maestra con número único, estado, total, método de pago y dirección de envío.
- **Sub-Order**: Sub-orden por marca con subtotal, estado y tracking independiente.
- **Order-Item**: Ítem individual de la sub-orden con precio, cantidad y subtotal.
- **Payment**: Registro de pago con monto, método, comprobante y estado de verificación.
- **Payment-Schedule**: Cronograma de cuotas quincenales con fechas límite y montos.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El usuario puede agregar productos de ambas marcas al carrito en menos de 30 segundos.
- **SC-002**: El cálculo de subtotales y total se actualiza en menos de 100ms al modificar cantidades.
- **SC-003**: El usuario puede completar el checkout en 3 pasos en menos de 5 minutos.
- **SC-004**: La creación de orden con sub-órdenes se completa en menos de 2 segundos.
- **SC-005**: El 95% de los usuarios completan el checkout sin errores de validación.
- **SC-006**: Las pruebas unitarias cubren el 100% de los escenarios de cálculo de cuotas.

## Assumptions

- Los costos de envío se calculan por peso del paquete según tarifas predefinidas por empresa (MRW/Zoom).
- La tasa de cambio Bolívares/Dólares es fija y está configurada por el administrador en el panel.
- El descuento de Binance (5%) se aplica sobre el total de productos, no sobre envío.
- El Plan de Pagos solo está disponible para órdenes que contengan al menos un libro.
- Los archivos de comprobante se almacenan en Cloudinary o similar.
- El número de referencia debe ser único por pago.
- Las cuotas quincenales se calculan desde la fecha de creación de la orden con montos fijos por cuota configurables por administrador.
- El formato del número de orden es: Marca(s)-Año-Sequential (ej: HL-KC-2026-0089).
- Los pagos (Pago Móvil y Binance) se verifican manualmente por el administrador.

---

## Clarifications

### Session 2026-08-27

- Q: ¿Cómo se calcula el costo de envío? → A: Por peso del paquete según tarifas predefinidas por empresa.
- Q: ¿Qué fuente se usa para la tasa de cambio Bolívares/Dólares? → A: Tasa fija configurada por administrador en el panel.
- Q: ¿Cómo se calculan las cuotas del Plan de Pagos Quincenal? → A: Configurables por administrador (monto y número de cuotas).
- Q: ¿Qué formato tiene el número de orden generado? → A: Marca(s)-Año-Sequential (ej: HL-KC-2026-0089).
- Q: ¿Quién verifica los pagos (Pago Móvil y Binance)? → A: Verificación manual por administrador.
