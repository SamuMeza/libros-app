# Tasks: Carrito Unificado y Checkout

**Input**: Design documents from `/specs/005-unified-cart-checkout/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No se incluyen tasks de testing (no solicitados en la especificación)

**Organization**: Tasks agrupados por user story para implementación y testing independiente.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede ejecutarse en paralelo (diferentes archivos, sin dependencias)
- **[Story]**: User story a la que pertenece (US1, US2, US3)
- Incluye rutas exactas de archivos en las descripciones

---

## Phase 1: Setup (Infraestructura Compartida)

**Purpose**: Inicialización del proyecto y estructura básica

- [ ] T001 Crear estructura de directorios del proyecto según implementation plan
- [ ] T002 Inicializar proyecto Next.js 16.3 con dependencias (Supabase SSR, Radix UI, Tailwind CSS v4, Zustand)
- [ ] T003 [P] Configurar ESLint y Prettier
- [ ] T004 [P] Configurar variables de entorno (.env.local) para Supabase y Cloudinary
- [ ] T005 [P] Configurar Tailwind CSS v4 con tokens de diseño por marca (--hl-primary, --kc-primary)

---

## Phase 2: Foundational (Prerrequisitos Bloqueantes)

**Purpose**: Infraestructura core que DEBE completarse ANTES de cualquier user story

**⚠️ CRITICAL**: No se puede trabajar en user stories hasta completar esta fase

- [ ] T006 Configurar cliente Supabase (server, client, middleware) en src/lib/supabase/
- [ ] T007 [P] Crear tipos TypeScript base en src/types/cart.ts, order.ts, payment.ts
- [ ] T008 [P] Crear tablas de base de datos (cart_items, orders, sub_orders, order_items, payments, payment_schedules) según data-model.md
- [ ] T009 [P] Configurar políticas RLS para tablas de carrito y órdenes
- [ ] T010 Crear Server Actions base en src/lib/actions/cart.ts, orders.ts, payments.ts con estructura de retorno { success, data?, error? }
- [ ] T011 [P] Crear utilidades de cálculo en src/lib/utils/cart-helpers.ts, order-helpers.ts, payment-helpers.ts
- [ ] T012 Configurar Cloudinary para upload de comprobantes de pago

**Checkpoint**: Foundation listo - puede comenzar implementación de user stories en paralelo

---

## Phase 3: User Story 1 - Ver y Gestionar Carrito Unificado (Priority: P1) 🎯 MVP

**Goal**: El usuario puede ver todos los productos en su carrito, modificar cantidades, eliminar ítems y ver subtotales separados por marca.

**Independent Test**: Agregar libros y productos KamCat al carrito, verificar que aparecen separados por marca con subtotales correctos.

### Implementation for User Story 1

- [ ] T013 [P] [US1] Crear componente CartItem en src/components/cart/cart-item.tsx
- [ ] T014 [P] [US1] Crear componente CartSummary en src/components/cart/cart-summary.tsx
- [ ] T015 [P] [US1] Crear componente EmptyCart en src/components/cart/empty-cart.tsx
- [ ] T016 [P] [US1] Crear componente BrandBadge en src/components/shared/brand-badge.tsx
- [ ] T017 [US1] Crear componente CartPage en src/components/cart/cart-page.tsx (orquesta componentes)
- [ ] T018 [US1] Crear página /carrito en src/app/(shop)/carrito/page.tsx
- [ ] T019 [US1] Implementar Server Action getCart en src/lib/actions/cart.ts
- [ ] T020 [US1] Implementar Server Action addToCart en src/lib/actions/cart.ts
- [ ] T021 [US1] Implementar Server Action updateCartItem en src/lib/actions/cart.ts
- [ ] T022 [US1] Implementar Server Action removeFromCart en src/lib/actions/cart.ts
- [ ] T023 [US1] Implementar cálculo de subtotales por marca en src/lib/utils/cart-helpers.ts
- [ ] T024 [US1] Crear Zustand store para estado local del carrito en src/lib/hooks/use-cart.ts

**Checkpoint**: En este punto, User Story 1 debe estar completamente funcional y testeable independientemente

---

## Phase 4: User Story 2 - Completar Checkout con Envío y Pago (Priority: P2)

**Goal**: El usuario puede completar el proceso de checkout en 3 pasos: dirección y envío, método de pago, y subida de comprobante.

**Independent Test**: Iniciar checkout desde el carrito, completar los 3 pasos, verificar que la orden se crea correctamente.

### Implementation for User Story 2

- [ ] T025 [P] [US2] Crear componente StepIndicator en src/components/shared/step-indicator.tsx
- [ ] T026 [P] [US2] Crear componente ShippingStep en src/components/checkout/shipping-step.tsx
- [ ] T027 [P] [US2] Crear componente PaymentStep en src/components/checkout/payment-step.tsx
- [ ] T028 [P] [US2] Crear componente ConfirmationStep en src/components/checkout/confirmation-step.tsx
- [ ] T029 [P] [US2] Crear componente OrderSummary en src/components/checkout/order-summary.tsx
- [ ] T030 [US2] Crear componente CheckoutLayout en src/components/checkout/checkout-layout.tsx (orquesta pasos)
- [ ] T031 [US2] Crear página /checkout en src/app/(shop)/checkout/page.tsx
- [ ] T032 [US2] Crear página /checkout/confirmacion en src/app/(shop)/checkout/confirmacion/page.tsx
- [ ] T033 [US2] Implementar validación de formulario de envío (nombre, cédula, teléfono, estado, ciudad, dirección, referencia)
- [ ] T034 [US2] Implementar cálculo de costo de envío por peso en src/lib/utils/order-helpers.ts
- [ ] T035 [US2] Implementar selección de método de envío (MRW/Zoom) con cálculo de días hábiles
- [ ] T036 [US2] Implementar selección de Pago Móvil con tasa de cambio fija por admin
- [ ] T037 [US2] Implementar selección de Binance con descuento del 5% y dirección de billetera
- [ ] T038 [US2] Implementar selección de Plan de Pagos con cuotas quincenales (2-4)
- [ ] T039 [US2] Implementar tabla visual de cronograma de cuotas en src/components/checkout/payment-step.tsx
- [ ] T040 [US2] Implementar upload de comprobante de pago (JPG, PNG, PDF, máx. 5MB) en src/components/checkout/confirmation-step.tsx
- [ ] T041 [US2] Implementar campo de número de referencia bancaria/hash
- [ ] T042 [US2] Implementar Zustand store para estado del checkout en src/lib/hooks/use-checkout.ts

**Checkpoint**: En este punto, User Stories 1 Y 2 deben funcionar independientemente

---

## Phase 5: User Story 3 - Crear Orden con Sub-Órdenes Automáticas (Priority: P3)

**Goal**: El sistema crea automáticamente una orden maestra y sub-órdenes separadas por marca cuando el usuario completa el checkout.

**Independent Test**: Completar un checkout con productos de ambas marcas, verificar que se crea la orden maestra y sub-órdenes separadas.

### Implementation for User Story 3

- [ ] T043 [P] [US3] Crear componente OrderConfirmation en src/components/checkout/order-confirmation.tsx
- [ ] T044 [P] [US3] Crear página /pedidos en src/app/(shop)/pedidos/page.tsx
- [ ] T045 [P] [US3] Crear página /pedidos/[id] en src/app/(shop)/pedidos/[id]/page.tsx
- [ ] T046 [US3] Implementar Server Action createOrder en src/lib/actions/orders.ts
- [ ] T047 [US3] Implementar generación de número de orden (Marca(s)-Año-Sequential) en src/lib/utils/order-helpers.ts
- [ ] T048 [US3] Implementar división automática de ítems por marca en sub-órdenes
- [ ] T049 [US3] Implementar generación de payment_schedules para Plan de Pagos en src/lib/actions/orders.ts
- [ ] T050 [US3] Implementar Server Action getOrder en src/lib/actions/orders.ts
- [ ] T051 [US3] Implementar Server Action getOrders en src/lib/actions/orders.ts
- [ ] T052 [US3] Implementar Server Action submitPayment en src/lib/actions/payments.ts
- [ ] T053 [US3] Implementar Server Action getPayments en src/lib/actions/payments.ts
- [ ] T054 [US3] Implementar Server Action verifyPayment (admin) en src/lib/actions/payments.ts
- [ ] T055 [US3] Implementar limpieza del carrito después de crear orden

**Checkpoint**: Todas las user stories deben funcionar independientemente

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Mejoras que afectan múltiples user stories

- [ ] T056 [P] Agregar estados de carga (skeletons) para operaciones asíncronas en src/components/shared/
- [ ] T057 [P] Agregar mensajes de error específicos por tipo de fallo
- [ ] T058 [P] Implementar validación de seguridad server-side para cálculos de pago
- [ ] T059 Implementar accesibilidad WCAG 2.1 AA en todos los componentes interactivos
- [ ] T060 Optimizar rendimiento (cálculo carrito < 100ms, creación orden < 2s)
- [ ] T061 [P] Documentar API de Server Actions en src/lib/actions/README.md
- [ ] T062 Ejecutar validación de quickstart.md
- [ ] T063 [P] Crear pruebas unitarias para calculateInstallments en src/lib/utils/__tests__/payment-helpers.test.ts
- [ ] T064 [P] Crear pruebas unitarias para totalizadores de carrito y orden en src/lib/utils/__tests__/cart-helpers.test.ts y order-helpers.test.ts

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
Task: "Crear componente CartItem en src/components/cart/cart-item.tsx"
Task: "Crear componente CartSummary en src/components/cart/cart-summary.tsx"
Task: "Crear componente EmptyCart en src/components/cart/empty-cart.tsx"
Task: "Crear componente BrandBadge en src/components/shared/brand-badge.tsx"
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
   - Desarrollador A: User Story 1
   - Desarrollador B: User Story 2
   - Desarrollador C: User Story 3
3. Stories se completan e integran independientemente

---

## Notes

- Tasks marcadas [P] = diferentes archivos, sin dependencias
- Label [Story] mapea task a user story específica para trazabilidad
- Cada user story debe poder completarse y testearse independientemente
- Commit después de cada task o grupo lógico
- Parar en cualquier checkpoint para validar story independientemente
- Evitar: tasks vagos, conflictos de mismo archivo, dependencias cross-story que rompan independencia

---

## Phase 7: Convergence

**Purpose**: Cerrar brechas entre especificación e implementación

- [ ] T065 Crear archivo de migración SQL en supabase/migrations/ con tablas cart_items, orders, sub_orders, order_items, payments, payment_schedules según data-model.md (missing)
- [ ] T066 Crear archivo de migración SQL en supabase/migrations/ con políticas RLS para tablas de carrito y órdenes según DATABASE.md (missing)
- [ ] T067 Implementar upload de comprobantes a Cloudinary en src/lib/actions/payments.ts para soportar subida real de archivos (missing)
