# Feature Specification: Panel Administrativo y Tracking

**Feature Branch**: `006-admin-panels-tracking`

**Created**: 2026-08-27

**Status**: Draft

**Input**: User description: "Genera la especificación técnica para el panel administrativo con verificación de pagos, gestión de pedidos y tracking geográfico"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Verificar Pagos Pendientes (Priority: P1)

El administrador puede revisar pagos pendientes, inspeccionar comprobantes en alta resolución y aprobar o rechazar cada pago con un motivo obligatorio.

**Why this priority**: La verificación de pagos es el eslabón crítico para que las órdenes avancen de "pending_payment" a "payment_verified". Sin esta función, el flujo de ventas se bloquea.

**Independent Test**: Login como admin, navegar a /pagos, filtrar pagos pendientes, abrir comprobante en modal, aprobar un pago y verificar que el estado cambia a "verified".

**Acceptance Scenarios**:

1. **Given** el admin está en /pagos con pagos pendientes, **When** hace clic en el thumbnail del comprobante, **Then** se abre un modal con la imagen en alta resolución con zoom.
2. **Given** el admin inspecciona un comprobante, **When** hace clic en "Aprobar", **Then** el pago cambia a estado "verified" y la sub-orden asociada avanza a "payment_verified".
3. **Given** el admin inspecciona un comprobante, **When** hace clic en "Rechazar" e ingresa un motivo, **Then** el pago cambia a estado "rejected" y se registra el motivo.
4. **Given** el admin aplica filtros (método, estado, rango de fechas), **When** cambia los filtros, **Then** la tabla se actualiza con los resultados filtrados.

---

### User Story 2 - Gestionar Pedidos por Marca (Priority: P2)

El administrador puede ver y gestionar sub-órdenes de su marca asignada, actualizar estados, agregar tracking geográfico y revisar detalles completos de cada pedido.

**Why this priority**: La gestión de pedidos permite el seguimiento operativo diario. Sin ella, no hay visibilidad del estado de las entregas.

**Independent Test**: Login como admin_hl, navegar a /pedidos, abrir un pedido, actualizar su estado, agregar una nota de tracking y verificar que se registra correctamente.

**Acceptance Scenarios**:

1. **Given** el admin está en /pedidos, **When** selecciona una sub-orden, **Then** se abre un drawer con pestañas: Productos, Pagos, Envío, Cliente.
2. **Given** el admin está en el drawer de detalle, **When** cambia el estado de la sub-orden, **Then** el estado se actualiza y se registra en la bitácora.
3. **Given** el admin está en la pestaña de Envío, **When** agrega una nota de tracking con ubicación (ej: "En tránsito desde Maracaibo"), **Then** la nota se guarda en tracking_notes con timestamp.
4. **Given** el admin filtra por estado, **When** selecciona "preparing", **Then** solo ve sub-órdenes en ese estado.

---

### User Story 3 - Ver Historial de Pedidos como Cliente (Priority: P3)

El cliente puede ver su historial de pedidos con una timeline vertical que muestra el estado de cada sub-orden por marca.

**Why this priority**: Proporciona transparencia al cliente sobre el estado de sus pedidos, reduciendo consultas de soporte.

**Independent Test**: Login como cliente, navegar a /pedidos, verificar que se muestra la timeline vertical con estados por marca.

**Acceptance Scenarios**:

1. **Given** el cliente tiene pedidos, **When** accede a /pedidos, **Then** ve una lista de pedidos ordenados por fecha descendente.
2. **Given** el cliente selecciona un pedido, **When** ve el detalle, **Then** se muestra una timeline vertical con los estados de cada sub-orden por marca (HL y KC separados).
3. **Given** el cliente tiene un pedido con Plan de Pagos, **When** ve el detalle, **Then** se muestra el cronograma de cuotas con fechas y estados.

---

### Edge Cases

1. **Monto del comprobante no coincide con monto de la orden**: El admin ve un warning indicando la diferencia. Puede aprobar o rechazar según su criterio. Si aprueba con diferencia, se registra en notas.
2. **Transición de estado inválida**: El sistema muestra mensaje de error explicativo y bloquea la transición. El admin solo puede seleccionar estados válidos.
3. **Cliente sin pedidos**: Se muestra estado vacío con mensaje "No tienes pedidos aún" y enlace al catálogo.
4. **Drawer sin pagos registrados**: La pestaña Pagos muestra mensaje "No hay pagos registrados" con opción de registrar pago manual.
5. **Admin de KC intenta acceder a pedidos de HL**: El sistema muestra mensaje de acceso denegado y redirige a /pedidos (su marca).

## Requirements *(mandatory)*

### Functional Requirements

**Sidebar Administrativo:**
- **FR-SB1**: El sidebar MUST mostrar navegación condicional según el rol del administrador (admin_hl, admin_kc, superadmin).
- **FR-SB2**: El admin_hl MUST ver: Dashboard, Libros, Pedidos (HL), Pagos (HL), Solicitudes de Libros.
- **FR-SB3**: El admin_kc MUST ver: Dashboard, Productos, Pedidos (KC), Pagos (KC).
- **FR-SB4**: El superadmin MUST ver: Dashboard, Libros, Productos, Pedidos (todos), Pagos (todos), Solicitudes, Reportes, Gestión de usuarios.
- **FR-SB5**: El sidebar MUST mantener ancho fijo en desktop y funcionar como drawer en mobile.
- **FR-SB6**: Todos los componentes del panel administrativo MUST cumplir WCAG 2.1 AA (focus visible, aria-labels, contraste de colores, navegación por teclado).

**Verificación de Pagos:**
- **FR-PV1**: La página /pagos MUST mostrar una tabla con columnas: Número Orden, Cliente/Teléfono, Método, Monto USD/VES, Comprobante (thumbnail), Estado, Acciones.
- **FR-PV2**: El admin MUST poder filtrar pagos por estado (Todos, Pendientes, Verificados, Rechazados), método (Pago Móvil, Binance, Cuotas) y rango de fechas.
- **FR-PV3**: El thumbnail del comprobante MUST ser clickeable para abrir un modal de inspección en alta resolución con zoom.
- **FR-PV4**: El modal MUST mostrar overlay con fondo oscuro y backdrop-blur.
- **FR-PV5**: El admin MUST poder aprobar un pago (cambiar estado a "verified") con una acción de confirmación.
- **FR-PV6**: El admin MUST poder rechazar un pago con motivo obligatorio (cambiar estado a "rejected").
- **FR-PV7**: Al aprobar un pago, la sub-orden asociada MUST actualizar su estado a "payment_verified".
- **FR-PV8**: Al rechazar un pago, la sub-orden asociada MUST mantenerse en "pending_payment" para que el cliente pueda subir un nuevo comprobante.
- **FR-PV9**: La tabla de pagos MUST usar paginación del servidor con 20 registros por página.

**Gestión de Pedidos:**
- **FR-PM1**: La página /pedidos MUST mostrar una tabla de sub-órdenes filtrada por la marca del admin.
- **FR-PM2**: El admin MUST poder abrir un drawer de detalle con pestañas: Productos, Pagos, Envío, Cliente.
- **FR-PM3**: La pestaña Productos MUST mostrar la lista de ítems con nombre, cantidad, precio y subtotal.
- **FR-PM4**: La pestaña Pagos MUST mostrar los pagos asociados con estado, método y comprobante.
- **FR-PM5**: La pestaña Envío MUST mostrar datos de envío (dirección, empresa, costo) y el formulario de tracking.
- **FR-PM6**: La pestaña Cliente MUST mostrar datos del cliente (nombre, teléfono, email, dirección).
- **FR-PM7**: El admin MUST poder cambiar el estado de la sub-orden (pending_payment → delivered).
- **FR-PM8**: El sistema MUST validar que las transiciones de estado sean permitidas y mostrar un mensaje de error explicativo si la transición es inválida.
- **FR-PM9**: El admin MUST poder agregar notas de tracking geográfico con ubicación y descripción.
- **FR-PM10**: Las notas de tracking MUST registrarse en la tabla tracking_notes con timestamp y ubicación.
- **FR-PM11**: El admin MUST poder filtrar sub-órdenes por estado.
- **FR-PM12**: El sistema MUST enviar un email automático al cliente en cada cambio de estado de la sub-orden (payment_verified, preparing, shipped, delivered).
- **FR-PM13**: La tabla de pedidos MUST usar paginación del servidor con 20 registros por página.

**Historial de Pedidos del Cliente:**
- **FR-CL1**: La página /pedidos (shop) MUST mostrar una lista de pedidos del cliente ordenados por fecha descendente.
- **FR-CL2**: Cada pedido MUST mostrar una timeline vertical con los estados de cada sub-orden por marca.
- **FR-CL3**: El cliente MUST poder ver el detalle de cada sub-orden (productos, pagos, envío).
- **FR-CL4**: Si aplica Plan de Pagos, el detalle MUST mostrar el cronograma de cuotas con fechas y estados.

### Key Entities

- **Sub-Order**: Sub-orden por marca con estado, subtotal, tracking number y notas. Filtrada por rol de admin.
- **Payment**: Registro de pago con monto, método, comprobante, estado de verificación y notas de rechazo.
- **Tracking-Note**: Nota de seguimiento geográfico con ubicación, descripción, admin creador y timestamp.
- **Profile**: Perfil de usuario con role (customer, admin_hl, admin_kc, superadmin) que determina acceso.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El admin puede verificar un pago pendiente en menos de 2 minutos (abrir, inspeccionar, aprobar/rechazar).
- **SC-002**: El admin puede actualizar el estado de un pedido y agregar nota de tracking en menos de 1 minuto.
- **SC-003**: El cliente puede ver el estado de su pedido con timeline en menos de 5 segundos de carga.
- **SC-004**: El 95% de los pagos son verificados correctamente sin errores de estado.
- **SC-005**: Las transiciones de estado inválidas son rechazadas el 100% de las veces.
- **SC-006**: El sidebar muestra correctamente la navegación según el rol en el 100% de los casos.

## Assumptions

- Los administradores tienen roles asignados en la tabla profiles (admin_hl, admin_kc, superadmin).
- El admin_hl solo puede gestionar sub-órdenes de la marca "hl" (política RLS).
- El admin_kc solo puede gestionar sub-órdenes de la marca "kc" (política RLS).
- Los comprobantes de pago se almacenan en Cloudinary y son accesibles via URL.
- Las transiciones de estado siguen el flujo: pending_payment → payment_verified → preparing → shipped → in_transit → delivered.
- El superadmin puede gestionar sub-órdenes de ambas marcas.
- Las notas de tracking son visibles solo para el admin de la marca correspondiente.
- Los datos del cliente (nombre, teléfono, email) se obtienen de la tabla profiles y addresses.

---

## Clarifications

### Session 2026-08-27

- Q: Cuando el admin rechaza un pago, ¿qué debe ocurrir con la sub-orden asociada? → A: La sub-orden se mantiene en "pending_payment" para que el cliente pueda subir un nuevo comprobante.
- Q: ¿Qué nivel de accesibilidad debe cumplir el panel administrativo? → A: WCAG 2.1 AA (contraste, focus visible, aria-labels, navegación por teclado).
- Q: ¿Se deben enviar notificaciones al cliente cuando el admin cambia el estado de su pedido? → A: Sí, email automático en cada cambio de estado (payment_verified, preparing, shipped, delivered).
- Q: ¿Cómo se debe manejar la paginación en las tablas de /pagos y /pedidos cuando hay muchos registros? → A: Paginación del lado del servidor con 20 registros por página.
- Q: ¿Qué pasa si el admin intenta cambiar el estado de una sub-orden a un estado inválido? → A: Mostrar mensaje de error explicativo y bloquear la transición.
