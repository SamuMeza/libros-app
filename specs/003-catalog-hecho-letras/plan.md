# Implementation Plan: Catálogo y Detalle de Libros (Hecho Letras)

**Branch**: `003-catalog-hecho-letras` | **Date**: 2026-08-26 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-catalog-hecho-letras/spec.md`

## Summary

Implementar el módulo de catálogo y detalle de libros para Hecho Letras. Incluye página de catálogo con filtros combinados, búsqueda Full-Text Search en español, ordenamiento y paginación; página de detalle con galería de imágenes, módulo de extras KamCat para upsell, selector de cantidad y acordeones informativos; formulario de solicitud de libros no catalogados; y Server Actions para consulta y filtrado de datos.

## Technical Context

**Language/Version**: TypeScript 5.x
**Primary Dependencies**: Next.js 16.3.0, React 19.2.8, Supabase SSR
**Storage**: PostgreSQL (Supabase) — tablas books, categories, book_extras, contact_requests
**Testing**: Vitest 4.1.10
**Target Platform**: Web (desktop y mobile responsive)
**Project Type**: Web application (Next.js App Router)
**Performance Goals**: Búsqueda < 500ms, Catálogo < 2s, Detalle < 1.5s, Paginación < 300ms
**Constraints**: Sin zod, validaciones manuales + type guards, sin valores px, CSS relativo
**Scale/Scope**: 2 páginas (catálogo + detalle), 1 formulario, 4 Server Actions, 1 acción de mutations

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Estado | Cumplimiento |
|-----------|--------|--------------|
| Runtime: bun | ✅ PASS | package.json usa bun como packageManager |
| Idioma: español | ✅ PASS | Toda la documentación en español |
| Sin zod | ✅ PASS | Validaciones manuales + type guards |
| CSS: solo unidades relativas | ✅ PASS | Sin valores px en componentes |
| Server Components por defecto | ✅ PASS | Páginas son Server Components; 'use client' solo en interactividad |
| Export default | ✅ PASS | Server Actions usan export default |
| Aislamiento de marcas | ✅ PASS | SoloHL, tokens --hl-* |
| RLS obligatorio | ✅ PASS | Tablas books, categories, book_extras, contact_requests con RLS |

**Resultado**: Todos los gates pasan. Proceder a Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/003-catalog-hecho-letras/
├── plan.md              # Este archivo
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A para feature interna)
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── app/
│   └── (shop)/
│       ├── libros/
│       │   ├── page.tsx              # Página de catálogo
│       │   └── [slug]/
│       │       └── page.tsx          # Página de detalle
│       └── layout.tsx                # Layout de tienda (ya existe)
├── components/
│   ├── books/
│   │   ├── book-card.tsx             # Card de libro en catálogo
│   │   ├── book-gallery.tsx          # Galería de imágenes del detalle
│   │   ├── book-extras.tsx           # Módulo de extras KamCat
│   │   ├── book-quantity.tsx         # Selector de cantidad
│   │   ├── book-accordions.tsx       # Acordeones informativos (envío, pago, cuotas)
│   │   └── book-request-form.tsx     # Formulario de solicitud de libros no catalogados
│   ├── shared/
│   │   ├── filter-sidebar.tsx        # Sidebar de filtros (catálogo)
│   │   ├── search-bar.tsx            # Campo de búsqueda con debounce
│   │   ├── sort-selector.tsx         # Selector de ordenamiento
│   │   ├── pagination.tsx            # Paginación de resultados
│   │   ├── skeleton-book-card.tsx    # Skeleton loader de card
│   │   └── empty-state.tsx           # Estado vacío de resultados
│   └── ui/
│       ├── accordion.tsx             # Componente acordeón base
│       └── breadcrumb.tsx            # Componente breadcrumb
├── lib/
│   ├── actions/
│   │   ├── get-books.ts              # Server Action: getBooks
│   │   ├── get-book-by-slug.ts       # Server Action: getBookBySlug
│   │   ├── get-book-extras.ts        # Server Action: getBookExtras
│   │   └── submit-book-request.ts    # Server Action: submitBookRequest
│   └── utils/
│       ├── slug-helpers.ts           # Generación de slugs desde título
│       └── search-helpers.ts         # Helpers de Full-Text Search
├── types/
│   └── books.ts                      # Tipos: Book, BookExtra, BookFilters, etc.
tests/
├── unit/
│   ├── books-actions.test.ts         # Tests de Server Actions
│   └── slug-helpers.test.ts          # Tests de generación de slugs
└── integration/
    └── catalog-flow.test.ts          # Tests de flujo de catálogo
```

**Structure Decision**: Next.js App Router con route group `(shop)` para layouts de tienda. Server Actions en `src/lib/actions/` (un archivo por action). Componentes en `src/components/books/` para elementos específicos de HL y `src/components/shared/` para elementos reutilizables.

## Complexity Tracking

> No hay violaciones de la constitución. Todos los gates pasan sin necesidad de justificación.
