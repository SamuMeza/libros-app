# Implementation Plan: Autenticación, Roles y Perfiles

**Branch**: `002-auth-roles-profiles` | **Date**: 2026-08-26 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-auth-roles-profiles/spec.md`

## Summary

Implementar el módulo completo de autenticación y gestión de perfiles para la plataforma e-commerce unificada Hecho Letras & KamCat. Incluye registro con creación automática de perfil, inicio de sesión con "Recordarme", recuperación de contraseña, gestión de perfil con teléfonos venezolano/internacional, middleware de protección de rutas por rol, y manejo de errores de Supabase Auth.

## Technical Context

**Language/Version**: TypeScript 5.x  
**Primary Dependencies**: Next.js 16.3.0, React 19.2.8, Supabase SSR, Supabase Auth  
**Storage**: PostgreSQL (Supabase) — tablas profiles, addresses  
**Testing**: Vitest 4.1.10  
**Target Platform**: Web (desktop y mobile responsive)  
**Project Type**: Web application (Next.js App Router)  
**Performance Goals**: Login < 3s, Registro < 5s, Tasa de éxito login > 95%  
**Constraints**: Sin zod, validaciones manuales + type guards, sin valores px  
**Scale/Scope**: 4 pantallas auth, 1 página perfil, 4 Server Actions, 1 middleware

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Estado | Cumplimiento |
|-----------|--------|--------------|
| Runtime: bun | ✅ PASS | package.json usa bun como packageManager |
| Idioma: español | ✅ PASS | Toda la documentación en español |
| Sin zod | ✅ PASS | Validaciones manuales + type guards |
| CSS: solo unidades relativas | ✅ PASS | Sin valores px en componentes de auth |
| Server Components por defecto | ✅ PASS | Formularios usan 'use client' solo por interactividad |
| Export default | ✅ PASS | Server Actions usan export default |
| Aislamiento de marcas | ✅ PASS | Middleware distingue admin_hl/admin_kc |
| RLS obligatorio | ✅ PASS | Tablas profiles/addresses con RLS |

**Resultado**: Todos los gates pasan. Proceder a Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/002-auth-roles-profiles/
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
│   ├── (auth)/
│   │   ├── layout.tsx              # Layout de auth (sin header/footer)
│   │   ├── login/
│   │   │   └── page.tsx            # Formulario de login
│   │   ├── register/
│   │   │   └── page.tsx            # Formulario de registro
│   │   └── forgot-password/
│   │       └── page.tsx            # Formulario de recuperación
│   └── (shop)/
│       └── perfil/
│           └── page.tsx            # Gestión de perfil
├── components/
│   ├── auth/
│   │   ├── auth-form.tsx           # Componente compartido de formulario auth
│   │   ├── error-page.tsx          # Página de error de Supabase Auth
│   │   └── loading-overlay.tsx     # Loader con fondo difuminado
│   └── ui/
│       └── phone-input.tsx         # Selector de teléfono VE/Internacional
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Cliente Supabase para browser
│   │   ├── server.ts               # Cliente Supabase para Server Components
│   │   └── middleware.ts           # Middleware de protección de rutas
│   ├── actions/
│   │   ├── sign-in.ts               # Server Action: signIn
│   │   ├── sign-up.ts               # Server Action: signUp + auto profile
│   │   ├── sign-out.ts              # Server Action: signOut
│   │   └── reset-password.ts        # Server Action: resetPassword
│   └── utils/
│       ├── validators.ts           # Type guards: isValidEmail, isValidRole
│       └── phone-helpers.ts        # Helpers de validación de teléfono VE/Internacional
├── types/
│   └── auth.ts                     # Tipos: UserRole, AuthResponse, Profile
│   └── profile.ts                  # Tipos: Profile, Address, PhoneFormat
tests/
├── unit/
│   ├── auth-actions.test.ts        # Tests de Server Actions
│   ├── validators.test.ts          # Tests de type guards
│   └── middleware.test.ts          # Tests de middleware
└── integration/
    └── auth-flow.test.ts           # Tests de flujo completo
```

**Structure Decision**: Next.js App Router con route groups `(auth)` y `(shop)` para layouts separados. Server Actions en `src/lib/actions/` (un archivo por action). Middleware en `src/lib/supabase/middleware.ts`.

## Complexity Tracking

> No hay violaciones de la constitución. Todos los gates pasan sin necesidad de justificación.
