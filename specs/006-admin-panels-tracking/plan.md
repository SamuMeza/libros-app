# Implementation Plan: Panel Administrativo y Tracking

**Branch**: `006-admin-panels-tracking` | **Date**: 2026-08-27 | **Spec**: [link](./spec.md)

**Input**: Feature specification from `/specs/006-admin-panels-tracking/spec.md`

## Summary

Panel administrativo para gestión de pagos, pedidos y tracking geográfico. Incluye sidebar condicional por rol, verificación de pagos con modal de comprobantes, gestión de pedidos con drawer de detalle, tracking geográfico y timeline de estados para clientes.

## Technical Context

**Language/Version**: TypeScript 5.x

**Primary Dependencies**: Next.js 16.3, React 19, Supabase SSR, Radix UI, Tailwind CSS v4, Zustand

**Storage**: PostgreSQL en Supabase con RLS

**Testing**: Vitest para unit tests

**Target Platform**: Web (desktop + mobile responsive)

**Project Type**: Web application (Next.js App Router)

**Performance Goals**: SC-001 (< 2min verificación), SC-002 (< 1min update), SC-003 (< 5s carga), SC-004 (95% precisión), SC-005 (100% validación), SC-006 (100% sidebar)

**Constraints**: WCAG 2.1 AA, paginación server-side 20/página, email automático en cambios de estado

**Scale/Scope**: < 50 productos en 6 meses, ~100 órdenes/mes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| Runtime: bun | ✅ PASS | bun como runtime y package manager |
| Idioma: español | ✅ PASS | Toda documentación y UI en español |
| Sin zod | ✅ PASS | Validación manual + type guards |
| CSS relativo (sin px) | ✅ PASS | Tailwind CSS con unidades relativas |
| Server Components por defecto | ✅ PASS | Admin pages usan Server Components donde sea posible |
| `use client` solo con hooks/eventos | ✅ PASS | Drawers, modals, filtros requieren interactividad |
| `export default` por archivo | ✅ PASS | Todos los componentes usan export default |
| Sin `any` | ✅ PASS | TypeScript estricto |
| Server Actions retorno estándar | ✅ PASS | { success, data?, error? } en todas las acciones |
| Validación manual (sin zod) | ✅ PASS | Type guards en server actions |
| Aislamiento de marcas | ✅ PASS | Admin usa tema neutro, shop usa tokens por marca |
| RLS obligatorio | ✅ PASS | Todas las tablas tienen RLS |

## Project Structure

### Documentation (this feature)

```text
specs/006-admin-panels-tracking/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── server-actions.md
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── (admin)/
│   │   ├── layout.tsx              # Admin layout with sidebar
│   │   ├── pagos/
│   │   │   └── page.tsx            # Payment verification page
│   │   └── pedidos/
│   │       └── page.tsx            # Order management page
│   └── (shop)/
│       └── pedidos/
│           ├── page.tsx            # Client order history
│           └── [id]/
│               └── page.tsx        # Client order detail
├── components/
│   ├── admin/
│   │   ├── admin-sidebar.tsx       # Conditional sidebar by role
│   │   ├── payment-table.tsx       # Payment verification table
│   │   ├── payment-modal.tsx       # Proof inspection modal
│   │   ├── order-table.tsx         # Order management table
│   │   ├── order-drawer.tsx        # Order detail drawer
│   │   └── tracking-form.tsx       # Tracking note form
│   ├── shared/
│   │   ├── step-indicator.tsx      # Reuse from spec 005
│   │   └── brand-badge.tsx         # Reuse from spec 005
│   └── shop/
│       └── order-timeline.tsx      # Client timeline component
├── lib/
│   ├── supabase/
│   │   ├── server.ts               # Server client
│   │   ├── client.ts               # Browser client
│   │   └── middleware.ts           # Auth middleware
│   ├── actions/
│   │   ├── admin/
│   │   │   ├── payments.ts         # Admin payment verification actions (getAdminPayments, approvePayment, rejectPayment)
│   │   │   ├── orders.ts           # Admin order management actions (getAdminOrders, getAdminOrder, updateOrderStatus)
│   │   │   └── tracking.ts         # Admin tracking actions (addTrackingNote, getTrackingNotes)
│   │   └── orders.ts               # Client order actions (getClientOrders, getClientOrderDetail)
│   ├── hooks/
│   │   ├── use-admin-sidebar.ts    # Sidebar state hook
│   │   └── use-order-filters.ts    # Filter state hook
│   └── utils/
│       ├── order-helpers.ts        # Order state transitions
│       └── payment-helpers.ts      # Payment calculation helpers
└── types/
    ├── order.ts                    # Order types
    ├── payment.ts                  # Payment types
    └── admin.ts                    # Admin-specific types
```

**Structure Decision**: Seleccionado Option 2 (Web application) con estructura Next.js App Router. Admin y Shop separados por route groups `(admin)` y `(shop)`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | No violations detected | N/A |
