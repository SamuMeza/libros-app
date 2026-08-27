# Implementation Plan: Layout Base y Sistema de Diseño

**Branch**: `001-layout-design-tokens` | **Date**: 2026-08-26 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-layout-design-tokens/spec.md`

## Summary

Implementar el layout base y sistema de diseño para la plataforma e-commerce unificada Hecho Letras & KamCat. Esto incluye variables CSS para ambos modos (claro/oscuro), tipografía con escala relativa, componentes de navegación (Header/Footer), card de producto reutilizable y componentes transversales (Toast, Modal, Skeletons).

## Technical Context

**Language/Version**: TypeScript 5.x  
**Primary Dependencies**: Next.js 16.3.0, React 19.2.8, Tailwind CSS 4.x, Radix UI 1.6.7  
**Storage**: N/A (feature de UI, sin persistencia propia)  
**Testing**: Vitest 4.1.10  
**Target Platform**: Web (desktop y mobile responsive)  
**Project Type**: Web application (Next.js App Router)  
**Performance Goals**: Tiempo de carga <2s, renderizado de cards <50ms, cambio de modo <100ms  
**Constraints**: Sin valores px, solo unidades relativas (rem, em, vw, vh, %)  
**Component Metrics**: Header height 4rem (64px), Footer padding 4rem top/2rem bottom, ProductCard max-width 300px  
**Scale/Scope**: 11 componentes/ui files, 6 archivos de tests, 1 archivo de estilos CSS

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Estado | Cumplimiento |
|-----------|--------|--------------|
| Runtime: bun | ✅ PASS | package.json usa bun como packageManager |
| Idioma: español | ✅ PASS | Toda la documentación en español |
| Sin zod | ✅ PASS | No se usa zod en esta feature |
| CSS: solo unidades relativas | ✅ PASS | Especificación usa rem, em, vw, vh |
| Server Components por defecto | ✅ PASS | Header usa 'use client' solo por interactividad |
| Export default | ✅ PASS | Todos los componentes usan export default |
| Aislamiento de marcas | ✅ PASS | Tokens separados brand-hl y brand-kc |

**Resultado**: Todos los gates pasan. Proceder a Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/001-layout-design-tokens/
├── plan.md              # Este archivo
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A para feature UI)
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── styles/
│   └── brand-variables.css    # Variables CSS por marca y modo
├── components/
│   ├── layout/
│   │   ├── header.tsx         # Header global fijo
│   │   └── footer.tsx         # Footer global 4 columnas
│   └── shared/
│       ├── product-card.tsx   # Card reutilizable HL/KC
│       ├── toast.tsx          # Notificaciones
│       ├── modal.tsx          # Modal accesible
│       └── skeleton.tsx       # Loading skeletons
├── lib/
│   └── hooks/
│       └── use-theme.ts       # Hook para persistencia de modo oscuro
└── app/
    └── layout.tsx             # Layout raíz que importa estilos

tests/
├── utils/
│   └── css-tokens.test.ts     # Tests de utilidades CSS
└── components/
    ├── header.test.tsx
    ├── footer.test.tsx
    ├── product-card.test.tsx
    ├── toast.test.tsx
    └── modal.test.tsx
```

**Structure Decision**: Estructura existente del proyecto Next.js. Los archivos se ubican en las rutas predefinidas por la constitución del proyecto.

## Complexity Tracking

> No hay violaciones de la constitución. Todos los gates pasan sin necesidad de justificación.
