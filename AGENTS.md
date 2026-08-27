<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# 🤖 AGENTS.md - Reglas Estrictas de Desarrollo con IA

> **IMPORTANTE SOBRE ESTE ARCHIVO:**  
> Este documento contiene **únicamente las reglas, directrices y estándares esenciales de desarrollo**.  
> **CADA CAMBIO O DECISIÓN RELEVANTE DE ARQUITECTURA/REGLAS** debe reflejarse en este archivo si afecta las directrices generales, pero **NO deben incluirse cambios mínimos o efímeros**.  
> Toda la documentación detallada, historia del proyecto, esquemas y requerimientos exhaustivos se encuentran en la carpeta de documentación: [docs/](./docs/).

---

## 🌐 Reglas Generales
- **SIEMPRE** responder en español.
- **SIEMPRE** usar `bun` como package manager y runtime.
- **SIEMPRE** consultar la documentación de frameworks/librerías directamente desde `./node_modules` antes de asumir APIs obsoletas o inventadas.
- **SIEMPRE** usar las skills de `./.agents/skills/` según el tipo de tarea.
- **SIEMPRE** usar unidades relativas CSS (`rem`, `em`, `vw`, `vh`, `%`) y clases de Tailwind CSS. **PROHIBIDO** valores absolutos como `px`.
- **PROHIBIDO** usar la librería `zod`. Utilizar validaciones y type guards nativos con TypeScript o validadores ligeros propios en `src/lib/utils/`.

---

## 📚 Documentación del Proyecto y Rutas Relativas
Los agentes de IA deben consultar y mantener sincronizada la documentación en rutas relativas dentro de [docs/](./docs/):
- **Arquitectura y Visión:** [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- **Requerimientos y Módulos:** [docs/REQUIREMENTS.md](./docs/REQUIREMENTS.md)
- **Base de Datos y RLS:** [docs/DATABASE.md](./docs/DATABASE.md)
- **Flujo Git/GitHub y SDD:** [docs/GITHUB_WORKFLOW.md](./docs/GITHUB_WORKFLOW.md)
- **Sistema de Diseño y Mockups:** [docs/DESIGN_SYSTEM.md](./docs/DESIGN_SYSTEM.md) | [docs/MOCKUPS_SHARED.md](./docs/MOCKUPS_SHARED.md)


---

## 🏗️ Contexto del Proyecto y Arquitectura
Plataforma e-commerce unificada en Venezuela para dos marcas:
- **Hecho Letras (HL):** Libros por encargo y stock limitado + plan de pagos a plazos (cuotas quincenales).
- **KamCat (KC):** Papelería creativa y personalizada bajo pedido.

### Estructura de Directorios
```
src/
├── app/                  # Next.js App Router: (auth), (shop), (admin), api
├── components/
│   ├── ui/               # Componentes base Radix / Shadcn
│   ├── layout/           # Header, Footer, Sidebar, BrandSwitch
│   ├── books/            # Componentes de Hecho Letras
│   ├── products/         # Componentes de KamCat
│   ├── cart/             # Carrito unificado
│   ├── checkout/         # Checkout, pagos manuales y plan de cuotas
│   ├── admin/            # Dashboard y paneles por marca
│   └── shared/           # Buscador, paginación, skeletons
├── lib/
│   ├── supabase/         # Clientes Supabase (server, client, middleware)
│   ├── actions/          # Server Actions por dominio (auth, books, products, orders, payments)
│   ├── hooks/            # Custom hooks
│   └── utils/            # Funciones puras, helpers de cálculo, formateo y validadores
├── types/                # Interfaces y tipos de TypeScript por dominio
└── styles/               # Tokens y variables CSS por marca
```

---

## 🎨 Reglas de React, Componentes y Server Actions

### Componentes y Exports
- **Server Components por defecto:** Todo componente nuevo debe ser Server Component a menos que requiera interactividad del navegador o hooks de estado (`useState`, `useEffect`, eventos DOM), en cuyo caso se coloca `'use client'` al inicio.
- **SIEMPRE** usar `export default` para componentes principales de archivos.
- **PROHIBIDO** usar named exports para componentes principales.

### Tipado Estricto (TypeScript)
- **SIEMPRE** definir interfaces y tipos en archivos dentro de `src/types/` o en `types.ts` correspondientes.
- **PROHIBIDO** el uso de `any`. Usar tipos explícitos o `unknown` con type guards.
- **PROHIBIDO** definir interfaces extensas dentro del archivo del componente.

### Server Actions
- Ubicación: `src/lib/actions/[dominio].ts`.
- Retorno estándar: `{ success: boolean; data?: T; error?: string }`.
- Validación manual de entradas antes de realizar operaciones en la base de datos (sin dependencias como zod).
- Verificar autorización y roles de usuario (`admin_hl`, `admin_kc`, etc.) en cada Server Action que modifique información.

### Hooks y Efectos
- **PROHIBIDO** usar `useEffect` para cálculos derivados o sincronización de estado local directa.
- **USAR** `useEffect` únicamente para sincronización con APIs externas o APIs del navegador (`localStorage`, subscripciones).

### Identidad de Marca y Estilos
- Usar variables CSS por marca (`--hl-primary`, `--kc-primary`) aplicadas con clases contenedoras (`brand-hl`, `brand-kc`).
- **NUNCA** mezclar estilos o colores de ambas marcas en el mismo componente específico.

---

## 🧪 Estrategia de Testing (Vitest & Bun.WebView)

### 1. Testing Unitario e Integración (Vitest)
- Patrón **AAA (Arrange-Act-Assert)** obligatorio.
- **PROHIBIDO** llamadas a APIs reales en tests unitarios (usar `vi.mock()`).
- Cobertura de edge cases obligatoria (inputs vacíos, valores extremos, errores).

```typescript
import { describe, it, expect } from 'vitest';
import { calculateInstallments } from '@/lib/utils/payment';

describe('calculateInstallments', () => {
  it('should split total amount into equal fortnightly installments', () => {
    // ARRANGE
    const total = 30;
    const installments = 3;
    
    // ACT
    const schedule = calculateInstallments(total, installments);
    
    // ASSERT
    expect(schedule).toHaveLength(3);
    expect(schedule[0].amount).toBe(10);
  });
});
```

### 2. Testing E2E con Bun.WebView (Sustituto de Playwright)
- Debido a que Playwright presenta incompatibilidades con el runtime **Bun**, las pruebas End-to-End se ejecutan utilizando la funcionalidad nativa **`Bun.WebView`** para automatización de flujos del navegador en el entorno Bun.
- Se debe disponer de un runner/helper en `tests/e2e/` basado en `Bun.WebView` para simular y validar:
  - Registro, Login y Gestión de Sesión.
  - Carrito unificado y Checkout (subida de comprobante).
  - Verificación de pagos y actualización de estados desde el panel Admin.

```typescript
// Ejemplo conceptual de test E2E con Bun.WebView
import { describe, it, expect } from 'vitest';

describe('E2E: Checkout Flow', () => {
  it('should load storefront and navigate checkout using Bun.WebView', async () => {
    // ARRANGE & ACT
    // Utilizar Bun.WebView para levantar la página y evaluar interacción
    // ASSERT
  });
});
```

---

## 🛠️ Skills por Tipo de Tarea
La IA debe cargar y revisar automáticamente la skill correspondiente desde `./.agents/skills/`:

- **UI, Diseño y Componentes:** `frontend-ui-engineering`, `tailwind-css-patterns`, `composition-patterns`, `react-best-practices`, `frontend-design`, `accessibility`.
- **Testing:** `test-driven-development`, `vitest`, `typescript-advanced-types`, `bun`.
- **Next.js & Performance:** `next-best-practices`, `next-cache-components`.
- **Base de Datos y Backend:** `supabase`, `supabase-postgres-best-practices`.
- **Control de Versiones y Trabajo en Equipo:** `git-workflow-and-versioning`.
- **Documentación y Fuentes:** `source-driven-development`.
- **Seo:** `seo`.


---

## 🌿 Flujo Git y Commits Narrativos
- **Conventional Commits:** `tipo(ámbito): descripción` (ej. `feat(orders): implementar sub-ordenes por marca`).
- **PROHIBIDO** commits genéricos como "fix: bug" o "update".
- Branches: `feature/*`, `fix/*`, `refactor/*` originadas desde `develop`.
- `main` y `develop` son ramas protegidas que solo reciben cambios mediante Pull Request revisado.
