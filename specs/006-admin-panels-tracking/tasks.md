# Tasks: Panel Administrativo y Tracking

**Input**: Design documents from `/specs/006-admin-panels-tracking/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No se incluyen tasks de testing (no solicitados en la especificación)

**Organization**: Tasks agrupados por user story para implementación y testing independiente.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede ejecutarse en paralelo (diferentes archivos, sin dependencias)
- **[Story]**: User story a la que pertenece (US1, US2, US3)
- Incluye rutas exactas de archivos en las descripciones

---

## Phase 1: Setup (Infraestructura Compartida)

**Purpose**: Inicialización del proyecto y estructura básica para admin

- [x] T001 Crear estructura de directorios del panel administrativo según implementation plan
- [x] T002 Configurar layout de admin en src/app/(admin)/layout.tsx con sidebar
- [x] T003 [P] Configurar tipos TypeScript para admin en src/types/admin.ts, order.ts, payment.ts
- [x] T004 [P] Configurar variables CSS para admin en src/styles/admin.css

---

## Phase 2: Foundational (Prerrequisitos Bloqueantes)

**Purpose**: Infraestructura core que DEBE completarse ANTES de cualquier user story

**⚠️ CRITICAL**: No se puede trabajar en user stories hasta completar esta fase

- [x] T005 Configurar cliente Supabase para admin en src/lib/supabase/server.ts (con rol admin)
- [x] T006 [P] Crear Server Actions base en src/lib/actions/admin/payments.ts, admin/orders.ts, admin/tracking.ts con estructura { success, data?, error? }
- [x] T007 [P] Crear utilidades de cálculo en src/lib/utils/order-helpers.ts (transiciones de estado)
- [x] T008 [P] Crear utilidades de validación en src/lib/utils/payment-helpers.ts (montos, formatos)
- [x] T009 Configurar middleware de autenticación para rutas admin en src/middleware.ts
- [x] T010 Crear componente AdminSidebar en src/components/admin/admin-sidebar.tsx con navegación por rol

**Checkpoint**: Foundation listo - puede comenzar implementación de user stories en paralelo

---

## Phase 3: User Story 1 - Verificar Pagos Pendientes (Priority: P1) 🎯 MVP

**Goal**: El administrador puede revisar pagos pendientes, inspeccionar comprobantes en alta resolución y aprobar o rechazar cada pago con un motivo obligatorio.

**Independent Test**: Login como admin, navegar a /pagos, filtrar pagos pendientes, abrir comprobante en modal, aprobar un pago y verificar que el estado cambia a "verified".

### Implementation for User Story 1

- [x] T011 [P] [US1] Crear componente PaymentTable en src/components/admin/payment-table.tsx
- [x] T012 [P] [US1] Crear componente PaymentModal en src/components/admin/payment-modal.tsx
- [x] T013 [P] [US1] Crear componente PaymentFilters en src/components/admin/payment-filters.tsx
- [x] T014 [P] [US1] Crear componente PaymentActions en src/components/admin/payment-actions.tsx
- [x] T015 [US1] Crear página /pagos en src/app/(admin)/pagos/page.tsx
- [x] T016 [US1] Implementar Server Action getAdminPayments en src/lib/actions/admin/payments.ts (con filtros y paginación)
- [x] T017 [US1] Implementar Server Action approvePayment en src/lib/actions/admin/payments.ts
- [x] T018 [US1] Implementar Server Action rejectPayment en src/lib/actions/admin/payments.ts
- [x] T019 [US1] Implementar lógica de transición de estado en src/lib/utils/order-helpers.ts
- [ ] T020 [US1] Implementar envío de email de notificación en src/lib/actions/admin/payments.ts
- [ ] T021 [US1] Crear Zustand store para filtros de pagos en src/lib/hooks/use-payment-filters.ts

**Checkpoint**: En este punto, User Story 1 debe estar completamente funcional y testeable independientemente

---

## Phase 4: User Story 2 - Gestionar Pedidos por Marca (Priority: P2)

**Goal**: El administrador puede ver y gestionar sub-órdenes de su marca asignada, actualizar estados, agregar tracking geográfico y revisar detalles completos de cada pedido.

**Independent Test**: Login como admin_hl, navegar a /pedidos, abrir un pedido, actualizar su estado, agregar una nota de tracking y verificar que se registra correctamente.

### Implementation for User Story 2

- [x] T022 [P] [US2] Crear componente OrderTable en src/components/admin/order-table.tsx
- [x] T023 [P] [US2] Crear componente OrderDrawer en src/components/admin/order-drawer.tsx
- [x] T024 [P] [US2] Crear componente OrderTabs en src/components/admin/order-tabs.tsx (Productos, Pagos, Envío, Cliente)
- [x] T025 [P] [US2] Crear componente TrackingForm en src/components/admin/tracking-form.tsx
- [x] T026 [P] [US2] Crear componente OrderFilters en src/components/admin/order-filters.tsx
- [x] T027 [US2] Crear página /pedidos en src/app/(admin)/pedidos/page.tsx
- [x] T028 [US2] Implementar Server Action getAdminOrders en src/lib/actions/admin/orders.ts (filtrado por marca)
- [x] T029 [US2] Implementar Server Action getAdminOrder en src/lib/actions/admin/orders.ts (detalle completo)
- [x] T030 [US2] Implementar Server Action updateOrderStatus en src/lib/actions/admin/orders.ts (con validación)
- [x] T031 [US2] Implementar Server Action addTrackingNote en src/lib/actions/admin/tracking.ts
- [x] T032 [US2] Implementar Server Action getTrackingNotes en src/lib/actions/admin/tracking.ts
- [x] T033 [US2] Implementar validación de transiciones de estado en src/lib/utils/order-helpers.ts
- [ ] T034 [US2] Implementar envío de email de notificación en src/lib/actions/admin/orders.ts
- [ ] T035 [US2] Crear Zustand store para filtros de pedidos en src/lib/hooks/use-order-filters.ts
- [ ] T036 [US2] Crear Zustand store para drawer en src/lib/hooks/use-order-drawer.ts

**Checkpoint**: En este punto, User Stories 1 Y 2 deben funcionar independientemente

---

## Phase 5: User Story 3 - Ver Historial de Pedidos como Cliente (Priority: P3)

**Goal**: El cliente puede ver su historial de pedidos con una timeline vertical que muestra el estado de cada sub-orden por marca.

**Independent Test**: Login como cliente, navegar a /pedidos, verificar que se muestra la timeline vertical con estados por marca.

### Implementation for User Story 3

- [x] T037 [P] [US3] Crear componente OrderTimeline en src/components/shop/order-timeline.tsx
- [x] T038 [P] [US3] Crear componente OrderList en src/components/shop/order-list.tsx
- [x] T039 [P] [US3] Crear componente OrderDetail en src/components/shop/order-detail.tsx
- [x] T040 [P] [US3] Crear componente PaymentSchedule en src/components/shop/payment-schedule.tsx
- [x] T041 [US3] Crear página /pedidos (shop) en src/app/(shop)/pedidos/page.tsx
- [x] T042 [US3] Crear página /pedidos/[id] en src/app/(shop)/pedidos/[id]/page.tsx
- [x] T043 [US3] Implementar Server Action getClientOrders en src/lib/actions/orders.ts
- [x] T044 [US3] Implementar Server Action getClientOrderDetail en src/lib/actions/orders.ts
- [x] T045 [US3] Implementar timeline vertical con CSS Grid en src/components/shop/order-timeline.tsx
- [x] T046 [US3] Mostrar cronograma de cuotas si aplica Plan de Pagos

**Checkpoint**: Todas las user stories deben funcionar independientemente

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Mejoras que afectan múltiples user stories

- [ ] T047 [P] Agregar estados de carga (skeletons) para tablas y drawers en src/components/admin/
- [ ] T048 [P] Agregar mensajes de error específicos por tipo de fallo
- [ ] T049 [P] Implementar validación de seguridad server-side para transiciones de estado
- [ ] T050 Implementar accesibilidad WCAG 2.1 AA en todos los componentes interactivos
- [ ] T051 Optimizar rendimiento (carga de tablas, transiciones de estado)
- [ ] T052 [P] Documentar API de Server Actions en src/lib/actions/README.md
- [ ] T053 Ejecutar validación de quickstart.md
- [ ] T054 [P] Crear pruebas unitarias para order-helpers en src/lib/utils/__tests__/order-helpers.test.ts
- [ ] T055 [P] Crear pruebas unitarias para payment-helpers en src/lib/utils/__tests__/payment-helpers.test.ts

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sin dependencias - puede comenzar inmediatamente
- **Foundational (Phase 2)**: Depende de Setup - BLOQUEA todas las user stories
- **User Stories (Phase 3+)**: Todas dependen de Foundational
  - User stories pueden proceder en paralelo (si hay capacidad)
  - O secuencialmente en orden de prioridad (P1 → P2 → P3)
- **Polish (Final Phase)**: Depende de que todas las desired user stories estén completas

### User Story Dependencies

- **User Story 1 (P1)**: Puede comenzar después de Foundational (Phase 2) - Sin dependencias en otras stories
- **User Story 2 (P2)**: Puede comenzar después de Foundational (Phase 2) - Puede integrar con US1 pero debe ser testeable independientemente
- **User Story 3 (P3)**: Puede comenzar después de Foundational (Phase 2) - Puede integrar con US1/US2 pero debe ser testeable independientemente

### Within Each User Story

- Modelos antes de servicios
- Servicios antes de endpoints
- Implementación core antes de integración
- Story completa antes de mover a la siguiente prioridad

### Parallel Opportunities

- Todos los Setup tasks marcados [P] pueden ejecutarse en paralelo
- Todos los Foundational tasks marcados [P] pueden ejecutarse en paralelo (dentro de Phase 2)
- Una vez completada Foundational, todas las user stories pueden comenzar en paralelo
- Todos los componentes de una story marcados [P] pueden ejecutarse en paralelo
- Diferentes user stories pueden trabajarse en paralelo por diferentes miembros del equipo

---

## Parallel Example: User Story 1

```bash
# Lanzar todos los componentes de User Story 1 juntos:
Task: "Crear componente PaymentTable en src/components/admin/payment-table.tsx"
Task: "Crear componente PaymentModal en src/components/admin/payment-modal.tsx"
Task: "Crear componente PaymentFilters en src/components/admin/payment-filters.tsx"
Task: "Crear componente PaymentActions en src/components/admin/payment-actions.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Phase 1: Setup
2. Completar Phase 2: Foundational (CRÍTICO - bloquea todas las stories)
3. Completar Phase 3: User Story 1
4. **PARAR y VALIDAR**: Testear User Story 1 independientemente
5. Desplegar/demostrar si está listo

### Incremental Delivery

1. Completar Setup + Foundational → Foundation listo
2. Agregar User Story 1 → Testear independientemente → Desplegar/Demostrar (MVP!)
3. Agregar User Story 2 → Testear independientemente → Desplegar/Demostrar
4. Agregar User Story 3 → Testear independientemente → Desplegar/Demostrar
5. Cada story agrega valor sin romper las anteriores

### Parallel Team Strategy

Con múltiples desarrolladores:

1. El equipo completa Setup + Foundational juntos
2. Una vez completada Foundational:
   - Desarrollador A: User Story 1 (Verificar Pagos)
   - Desarrollador B: User Story 2 (Gestionar Pedidos)
   - Desarrollador C: User Story 3 (Historial Cliente)
3. Stories se completan e integran independientemente

---

## Notes

- Tasks marcadas [P] = diferentes archivos, sin dependencias
- Label [Story] mapea task a user story específica para trazabilidad
- Cada user story debe poder completarse y testearse independientemente
- Commit después de cada task o grupo lógico
- Parar en cualquier checkpoint para validar story independientemente
- Evitar: tasks vagos, conflictos de mismo archivo, dependencias cross-story que rompan independencia
