# Hecho Letras & KamCat

Plataforma e-commerce unificada en Venezuela para dos marcas:
- **Hecho Letras (HL):** Libros por encargo y stock limitado + plan de pagos a plazos (cuotas quincenales).
- **KamCat (KC):** Papelería creativa y personalizada bajo pedido.

## Tecnologías

- **Runtime:** [Bun](https://bun.sh) v1.4.0
- **Framework:** [Next.js](https://nextjs.org) v16.3.0 (App Router + Turbopack)
- **UI:** React 19, Tailwind CSS v4, Radix UI
- **Estado:** Zustand
- **Backend:** [Supabase](https://supabase.com) (Auth + PostgreSQL + RLS)
- **Testing:** Vitest v4.1 + Bun.WebView (E2E)
- **Deploy:** [Vercel](https://vercel.com)

## Estructura del Proyecto

```
src/
├── app/                  # Next.js App Router: (auth), (shop), (admin)
├── components/
│   ├── ui/               # Componentes base Radix / Shadcn
│   ├── layout/           # Header, Footer, Sidebar
│   ├── auth/             # Autenticación (auth-form, loading-overlay)
│   ├── profile/          # Perfil (address-form)
│   ├── books/            # Componentes Hecho Letras
│   ├── products/         # Componentes KamCat (cards, variants, gallery)
│   ├── shop/             # Pedidos del cliente
│   ├── cart/             # Carrito unificado
│   ├── checkout/         # Checkout y pagos
│   ├── admin/            # Dashboard y paneles admin
│   └── shared/           # Buscador, paginación, skeletons
├── lib/
│   ├── supabase/         # Clientes Supabase (server, client)
│   ├── actions/          # Server Actions por dominio
│   │   └── admin/        # Server Actions administrativas
│   ├── hooks/            # Custom hooks y Zustand stores
│   └── utils/            # Helpers de cálculo, formateo y validación
├── types/                # Interfaces y tipos TypeScript
└── styles/               # Tokens y variables CSS por marca
tests/
├── unit/                 # Tests unitarios (Vitest)
├── integration/          # Tests de integración (Vitest)
└── e2e/                  # Tests E2E con Bun.WebView
supabase/
├── migrations/           # Migraciones SQL
└── seeds/                # Datos de prueba
```

## Inicio Rápido

### 1. Instalar dependencias

```bash
bun install
```

### 2. Variables de entorno

Crear `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

### 3. Desarrollo

```bash
bun dev
```

Abrir [http://localhost:3000](http://localhost:3000).

### 4. Build de producción

```bash
bun run build
bun start
```

### 5. Tests

```bash
# Tests unitarios e integración
bunx vitest run

# Tests E2E (requiere dev server corriendo)
bunx vitest run tests/e2e/
```

## Base de Datos

### Migraciones

Las migraciones SQL están en `supabase/migrations/`. Para aplicarlas:

```bash
# Usando Supabase CLI
supabase db push

# O directamente via SQL Editor en el dashboard
```

### Seed Data

Para poblar la base de datos con datos de prueba:

1. Crear usuarios en **Authentication → Users** del dashboard de Supabase
2. Seguir las instrucciones en `supabase/SEED_README.md`

Ver `supabase/SEED_README.md` para instrucciones detalladas paso a paso.

## Despliegue en Vercel

El proyecto está configurado para desplegarse automáticamente en Vercel desde la rama `main`.

```bash
# Push a main para desplegar
git checkout main
git merge develop
git push origin main
```

## Reglas de Desarrollo

Ver [AGENTS.md](./AGENTS.md) para las reglas completas de desarrollo con IA.

### Convenciones principales

- **Runtime:** Solo `bun` (npm/yarn/pnpm prohibidos)
- **CSS:** Unidades relativas (`rem`, `em`, `%`), Tailwind CSS. `px` solo en excepciones documentadas
- **Validaciones:** Sin `zod`. Type guards nativos con TypeScript
- **Components:** Server Components por defecto, `'use client'` solo cuando se necesiten hooks
- **Exports:** `export default` para componentes principales
- **Testing:** TDD obligatorio (RED → GREEN → REFACTOR)
- **Git:** Conventional Commits, branches `feature/*`, `fix/*`, `refactor/*`

## Documentación

| Documento | Contenido |
|-----------|-----------|
| [AGENTS.md](./AGENTS.md) | Reglas de desarrollo con IA |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | Arquitectura y visión del proyecto |
| [docs/REQUIREMENTS.md](./docs/REQUIREMENTS.md) | Requerimientos y módulos |
| [docs/DATABASE.md](./docs/DATABASE.md) | Esquema de BD y políticas RLS |
| [docs/DESIGN_SYSTEM.md](./docs/DESIGN_SYSTEM.md) | Sistema de diseño |
| [docs/ENV_VARIABLES.md](./docs/ENV_VARIABLES.md) | Variables de entorno |
| [supabase/SEED_README.md](./supabase/SEED_README.md) | Instrucciones de seed data |

## Licencia

Proyecto privado. Hecho Letras & KamCat © 2026.
