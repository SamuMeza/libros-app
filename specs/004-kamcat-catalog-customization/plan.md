# Implementation Plan: Catálogo y Personalización KamCat

**Branch**: `004-kamcat-catalog-customization` | **Date**: 2026-08-27 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-kamcat-catalog-customization/spec.md`

## Summary

Implementar el módulo de catálogo y detalle de productos KamCat con soporte de personalización opcional. Incluye página de catálogo con filtros por categoría, página de detalle con selector de variantes (tamaño/color en hex), formulario de personalización con contador de caracteres, cálculo reactivo del precio, y Server Actions para consulta segura de datos JSONB. Catálogo de < 50 productos, accesibilidad WCAG 2.1 AA, variantes y personalización opcionales.

## Technical Context

**Language/Version**: TypeScript 5.x, React 19, Next.js 16.3

**Primary Dependencies**: Next.js App Router, Supabase SSR, Radix UI, Tailwind CSS v4, Zustand

**Storage**: PostgreSQL (Supabase) — tablas `products`, `categories` con JSONB

**Testing**: Vitest (unit/integration), Bun.WebView (E2E)

**Target Platform**: Web (desktop, tablet, mobile) — SSR + Client Components

**Project Type**: Web application (e-commerce catalog)

**Performance Goals**: Búsqueda < 500ms, carga catálogo < 2s, carga detalle < 1.5s, cálculo precio < 100ms

**Constraints**: WCAG 2.1 AA, paleta --kc-primary/--kc-accent, max-width 1200px, < 50 productos

**Scale/Scope**: < 50 productos KamCat, 6 categorías típicas (Stickers, Photocards, Posters, Llaveros, Pins, Polaroids)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

No constitution file exists. Proceeding with standard project conventions from AGENTS.md:
- Server Components por defecto, 'use client' solo cuando se requiera interactividad
- SIEMPRE usar export default para componentes principales
- PROHIBIDO el uso de any — usar tipos explícitos
- Server Actions en src/lib/actions/[dominio].ts con retorno estándar { success, data?, error? }
- Validación manual de entradas (sin zod)
- Variables CSS por marca (--kc-primary, --kc-accent)
- Unidades relativas CSS (rem, em, vw, vh, %) — PROHIBIDO px

## Project Structure

### Documentation (this feature)

```text
specs/004-kamcat-catalog-customization/
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
│       └── kamcat/
│           ├── page.tsx              # Catálogo KamCat
│           └── [slug]/
│               └── page.tsx          # Detalle de producto
├── components/
│   ├── products/
│   │   ├── product-card.tsx          # Card de producto en catálogo
│   │   ├── variant-selector.tsx      # Selector de variantes (chips + círculos)
│   │   ├── customization-form.tsx    # Formulario de personalización
│   │   └── price-display.tsx         # Precio reactivo con desglose
│   └── shared/
│       ├── filter-sidebar.tsx        # Sidebar de filtros reutilizable
│       └── pagination.tsx            # Paginación reutilizable
├── lib/
│   ├── actions/
│   │   └── products.ts              # Server Actions de KamCat
│   └── utils/
│       └── product-helpers.ts        # Helpers de cálculo de precio
└── types/
    └── product.ts                    # Interfaces de productos KamCat
```

**Structure Decision**: Next.js App Router con route groups `(shop)`. Componentes en `src/components/products/` para KamCat específicos, `src/components/shared/` para reutilizables. Server Actions en `src/lib/actions/products.ts`. Tipos en `src/types/product.ts`.

## Complexity Tracking

> No constitution violations to justify.

No aplica — feature sigue las convenciones estándar del proyecto.
