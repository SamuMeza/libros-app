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

- [x] T001 Crear estructura de directorios del proyecto según implementation plan
- [x] T002 Inicializar proyecto Next.js 16.3 con dependencias (Supabase SSR, Radix UI, Tailwind CSS v4, Zustand)
- [x] T003 [P] Configurar ESLint y Prettier
- [x] T004 [P] Configurar variables de entorno (.env.local) para Supabase y Cloudinary
- [x] T005 [P] Configurar Tailwind CSS v4 con tokens de diseño por marca (--hl-primary, --kc-primary)

---

## Phase 2: Foundational (Prerrequisitos Bloqueantes)

**Purpose**: Infraestructura core que DEBE completarse ANTES de cualquier user story

**⚠️ CRITICAL**: No se puede trabajar en user stories hasta completar esta fase

- [x] T006 Configurar cliente Supabase (server, client, middleware) en src/lib/supabase/
- [x] T007 [P] Crear tipos TypeScript base en src/types/cart.ts, order.ts, payment.ts
- [x] T008 [P] Crear tablas de base de datos (cart_items, orders, sub_orders, order_items, payments, payment_schedules) según data-model.md
- [x] T009 [P] Configurar políticas RLS para tablas de carrito y órdenes
- [x] T010 Crear Server Actions base en src/lib/actions/cart.ts, orders.ts, payments.ts con estructura de retorno { success, data?, error? }
- [x] T011 [P] Crear utilidades de cálculo en src/lib/utils/cart-helpers.ts, order-helpers.ts, payment-helpers.ts
- [x] T012 Configurar Cloudinary para upload de comprobantes de pago

**Checkpoint**: Foundation listo - puede comenzar implementación de user stories en paralelo

---

## Phase 3: User Story 1 - Ver y Gestionar Carrito Unificado (Priority: P1) 🎯 MVP

**Goal**: El usuario puede ver todos los productos en su carrito, modificar cantidades, eliminar ítems y ver subtotales separados por marca.

**Independent Test**: Agregar libros y productos KamCat al carrito, verificar que aparecen separados por marca con subtotales correctos.

### Implementation for User Story 1

- [x] T013 [P] [US1] Crear componente CartItem en src/components/cart/cart-item.tsx
- [x] T014 [P] [US1] Crear componente CartSummary en src/components/cart/cart-summary.tsx
- [x] T015 [P] [US1] Crear componente EmptyCart en src/components/cart/empty-cart.tsx
- [x] T016 [P] [US1] Crear componente BrandBadge en src/components/shared/brand-badge.tsx (implementado inline via getBrandBadgeClass() en cart-helpers.ts)
- [x] T017 [US1] Crear componente CartPage en src/components/cart/cart-page.tsx (orquesta componentes)
- [x] T018 [US1] Crear página /carrito en src/app/(shop)/carrito/page.tsx
- [x] T019 [US1] Implementar Server Action getCart en src/lib/actions/cart.ts
- [x] T020 [US1] Implementar Server Action addToCart en src/lib/actions/cart.ts
- [x] T021 [US1] Implementar Server Action updateCartItem en src/lib/actions/cart.ts
- [x] T022 [US1] Implementar Server Action removeFromCart en src/lib/actions/cart.ts
- [x] T023 [US1] Implementar cálculo de subtotales por marca en src/lib/utils/cart-helpers.ts
- [x] T024 [US1] Crear Zustand store para estado local del carrito en src/lib/hooks/use-cart.ts

**Checkpoint**: En este punto, User Story 1 debe estar completamente funcional y testeable independientemente

---

## Phase 4: User Story 2 - Completar Checkout con Envío y Pago (Priority: P2)

**Goal**: El usuario puede completar el proceso de checkout en 3 pasos: dirección y envío, método de pago, y subida de comprobante.

**Independent Test**: Iniciar checkout desde el carrito, completar los 3 pasos, verificar que la orden se crea correctamente.

### Implementation for User Story 2

- [x] T025 [P] [US2] Crear componente StepIndicator en src/components/shared/step-indicator.tsx
- [x] T026 [P] [US2] Crear componente ShippingStep en src/components/checkout/shipping-step.tsx
- [x] T027 [P] [US2] Crear componente PaymentStep en src/components/checkout/payment-step.tsx
- [x] T028 [P] [US2] Crear componente ConfirmationStep en src/components/checkout/confirmation-step.tsx
- [x] T029 [P] [US2] Crear componente OrderSummary en src/components/checkout/order-summary.tsx
- [x] T030 [US2] Crear componente CheckoutLayout en src/components/checkout/checkout-layout.tsx (orquesta pasos)
- [x] T031 [US2] Crear página /checkout en src/app/(shop)/checkout/page.tsx
- [x] T032 [US2] Crear página /checkout/confirmacion en src/app/(shop)/checkout/confirmacion/page.tsx
- [x] T033 [US2] Implementar validación de formulario de envío (nombre, cédula, teléfono, estado, ciudad, dirección, referencia)
- [x] T034 [US2] Implementar cálculo de costo de envío por peso en src/lib/utils/order-helpers.ts
- [x] T035 [US2] Implementar selección de método de envío (MRW/Zoom) con cálculo de días hábiles
- [x] T036 [US2] Implementar selección de Pago Móvil con tasa de cambio fija por admin
- [x] T037 [US2] Implementar selección de Binance con descuento del 5% y dirección de billetera
- [x] T038 [US2] Implementar selección de Plan de Pagos con cuotas quincenales (2-4)
- [x] T039 [US2] Implementar tabla visual de cronograma de cuotas en src/components/checkout/payment-step.tsx
- [x] T040 [US2] Implementar upload de comprobante de pago (JPG, PNG, PDF, máx. 5MB) en src/components/checkout/confirmation-step.tsx
- [x] T041 [US2] Implementar campo de número de referencia bancaria/hash
- [~] T042 [US2] ~~Implementar Zustand store para estado del checkout~~ DESCARTADA: CheckoutLayout usa useState local y funciona correctamente para el flujo de checkout de una sola página

**Checkpoint**: En este punto, User Stories 1 Y 2 deben funcionar independientemente

---

## Phase 5: User Story 3 - Crear Orden con Sub-Órdenes Automáticas (Priority: P3)

**Goal**: El sistema crea automáticamente una orden maestra y sub-órdenes separadas por marca cuando el usuario completa el checkout.

**Independent Test**: Completar un checkout con productos de ambas marcas, verificar que se crea la orden maestra y sub-órdenes separadas.

### Implementation for User Story 3

- [x] T043 [P] [US3] Crear componente OrderConfirmation en src/components/checkout/order-confirmation.tsx (implementado como página Server Component en /checkout/confirmacion/page.tsx)
- [x] T044 [P] [US3] Crear página /pedidos en src/app/(shop)/pedidos/page.tsx
- [x] T045 [P] [US3] Crear página /pedidos/[id] en src/app/(shop)/pedidos/[id]/page.tsx
- [x] T046 [US3] Implementar Server Action createOrder en src/lib/actions/orders.ts
- [x] T047 [US3] Implementar generación de número de orden (Marca(s)-Año-Sequential) en src/lib/utils/order-helpers.ts (implementado como ORD-{timestamp})
- [x] T048 [US3] Implementar división automática de ítems por marca en sub-órdenes
- [x] T049 [US3] Implementar generación de payment_schedules para Plan de Pagos en src/lib/actions/orders.ts (createOrder genera cronograma cuando payment_method === 'installments')
- [x] T050 [US3] Implementar Server Action getOrder en src/lib/actions/orders.ts (implementado como getClientOrderDetail)
- [x] T051 [US3] Implementar Server Action getOrders en src/lib/actions/orders.ts (implementado como getClientOrders)
- [x] T052 [US3] Implementar Server Action submitPayment en src/lib/actions/payments.ts
- [x] T053 [US3] Implementar Server Action getPayments en src/lib/actions/payments.ts
- [x] T054 [US3] Implementar Server Action verifyPayment (admin) en src/lib/actions/payments.ts
- [x] T055 [US3] Implementar limpieza del carrito después de crear orden

**Checkpoint**: Todas las user stories deben funcionar independientemente

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Mejoras que afectan múltiples user stories

- [x] T056 [P] Agregar estados de carga (skeletons) para operaciones asíncronas en src/components/shared/ (inline en cart-page.tsx y pedidos pages)
- [x] T057 [P] Agregar mensajes de error específicos por tipo de fallo
- [x] T058 [P] Implementar validación de seguridad server-side para cálculos de pago
- [x] T059 Implementar accesibilidad WCAG 2.1 AA en todos los componentes interactivos (aria-labels, aria-live, aria-current en step-indicator)
- [x] T060 Optimizar rendimiento (cálculo carrito < 100ms, creación orden < 2s) (tests en tests/integration/performance.test.ts: cart < 100ms, payment helpers < 10ms)
- [x] T061 [P] Documentar API de Server Actions en src/lib/actions/README.md (documentación creada)
- [x] T062 Ejecutar validación de quickstart.md (build OK, 23/23 archivos existen, checklist en validation-checklist.md)
- [x] T063 [P] Crear pruebas unitarias para calculateInstallments en src/lib/utils/__tests__/payment-helpers.test.ts (función implementada en payment-helpers.ts + tests en tests/utils/payment-helpers.test.ts)
- [x] T064 [P] Crear pruebas unitarias para totalizadores de carrito y orden en src/lib/utils/__tests__/cart-helpers.test.ts y order-helpers.test.ts (tests existen en tests/utils/)

---

## Phase 7: Convergence

**Purpose**: Cerrar brechas entre especificación e implementación

- [x] T065 Crear archivo de migración SQL en supabase/migrations/ con tablas cart_items, orders, sub_orders, order_items, payments, payment_schedules según data-model.md
- [x] T066 Crear archivo de migración SQL en supabase/migrations/ con políticas RLS para tablas de carrito y órdenes según DATABASE.md
- [x] T067 Implementar upload de comprobantes a Cloudinary en src/lib/actions/payments.ts para soportar subida real de archivos

---

## Resumen de Estado (verificado 2026-09-07)

### Completadas: 58/67
### Pendientes reales: 5
- **T042**: Zustand store checkout (decision: migrar a Zustand o descartar)
- **T049**: Generación de payment_schedules en createOrder
- **T060**: Benchmark de rendimiento
- **T061**: Documentación API
- **T062**: Validación quickstart
- **T063**: Test calculateInstallments (función no existe)
