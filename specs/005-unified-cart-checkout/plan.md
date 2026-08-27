# Implementation Plan: Carrito Unificado y Checkout

**Branch**: `005-unified-cart-checkout` | **Date**: 2026-08-27 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/005-unified-cart-checkout/spec.md`

## Summary

Implementar carrito unificado con soporte para libros (HL) y productos (KamCat), checkout en 3 pasos (envío, pago, confirmación), creación automática de orden maestra con sub-órdenes por marca, y sistema de pagos manuales (Pago Móvil, Binance, Plan de Pagos Quincenal). Envío por peso con MRW/Zoom, tasa de cambio fija por admin, cuotas configurables por admin, verificación manual de pagos.

## Technical Context

**Language/Version**: TypeScript 5.x, React 19, Next.js 16.3

**Primary Dependencies**: Next.js App Router, Supabase SSR, Radix UI, Tailwind CSS v4, Zustand

**Storage**: PostgreSQL (Supabase) — tablas `cart_items`, `orders`, `sub_orders`, `order_items`, `payments`, `payment_schedules`

**Testing**: Vitest (unit/integration), Bun.WebView (E2E)

**Target Platform**: Web (desktop, tablet, mobile) — SSR + Client Components

**Project Type**: Web application (e-commerce cart & checkout)

**Performance Goals**: Cálculo carrito < 100ms, creación orden < 2s, checkout completo < 5min

**Constraints**: WCAG 2.1 AA, paleta mixta --hl-primary/--kc-primary, pesos de envío predefinidos, tasa cambio fija por admin

**Scale/Scope**: < 50 productos, 2 empresas de envío (MRW/Zoom), 3 métodos de pago, 2-4 cuotas quincenales

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| Runtime: bun | ✅ PASS | bun como runtime y package manager |
| Idioma: español | ✅ PASS | Toda documentación en español |
| Sin zod | ✅ PASS | Validación manual + type guards |
| CSS relativo (sin px) | ✅ PASS | Tailwind CSS con unidades relativas |
| Server Components por defecto | ✅ PASS | Páginas usan Server Components |
| `use client` solo con hooks/eventos | ✅ PASS | Carrito y checkout requieren interactividad |
| `export default` por archivo | ✅ PASS | Componentes principales usan export default |
| Sin `any` | ✅ PASS | TypeScript estricto |
| Server Actions retorno estándar | ✅ PASS | { success, data?, error? } en todas las acciones |
| Validación manual (sin zod) | ✅ PASS | Type guards en server actions |
| Aislamiento de marcas | ✅ PASS | --hl-primary y --kc-primary en tokens separados |
| RLS obligatorio | ✅ PASS | Todas las tablas tienen RLS |

## Project Structure

### Documentation (this feature)

```text
specs/005-unified-cart-checkout/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── app/
│   └── (shop)/
│       ├── carrito/
│       │   └── page.tsx              # Carrito unificado
│       └── checkout/
│           ├── page.tsx              # Checkout wrapper (3 pasos)
│           └── confirmacion/
│               └── page.tsx          # Confirmación de orden
├── components/
│   ├── cart/
│   │   ├── cart-page.tsx             # Página principal del carrito
│   │   ├── cart-item.tsx             # Ítem individual del carrito
│   │   ├── cart-summary.tsx          # Resumen lateral del carrito
│   │   └── empty-cart.tsx            # Estado vacío del carrito
│   ├── checkout/
│   │   ├── checkout-layout.tsx       # Layout con indicador de pasos
│   │   ├── shipping-step.tsx         # Paso 1: Dirección y envío
│   │   ├── payment-step.tsx          # Paso 2: Método de pago
│   │   ├── confirmation-step.tsx     # Paso 3: Comprobante y referencia
│   │   └── order-summary.tsx         # Resumen de orden en checkout
│   └── shared/
│       ├── brand-badge.tsx           # Badge de marca (HL/KC)
│       └── step-indicator.tsx        # Indicador de progreso de pasos
├── lib/
│   ├── actions/
│   │   ├── cart.ts                   # Server Actions del carrito
│   │   ├── orders.ts                 # Server Actions de órdenes
│   │   └── payments.ts              # Server Actions de pagos
│   └── utils/
│       ├── cart-helpers.ts           # Helpers de cálculo de carrito
│       ├── order-helpers.ts          # Helpers de cálculo de orden
│       └── payment-helpers.ts        # Helpers de cálculo de pagos
└── types/
    ├── cart.ts                       # Interfaces del carrito
    ├── order.ts                      # Interfaces de órdenes
    └── payment.ts                    # Interfaces de pagos
```

**Structure Decision**: Next.js App Router con route groups `(shop)`. Componentes en `src/components/cart/` y `src/components/checkout/` para dominios específicos. Server Actions en `src/lib/actions/cart.ts`, `orders.ts`, `payments.ts` (múltiples acciones por archivo de dominio — décidado en reconciliación de specs 004-006). Tipos en `src/types/cart.ts`, `order.ts`, `payment.ts`.

## Complexity Tracking

> No constitution violations to justify.

No aplica — feature sigue las convenciones estándar del proyecto.
