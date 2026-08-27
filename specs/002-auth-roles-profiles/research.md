# Research: Autenticación, Roles y Perfiles

## Decisiones Técnicas

### 1. Supabase Auth + SSR Integration

**Decisión**: Usar `@supabase/ssr` para integración con Next.js App Router.

**Razón**: Supabase SSR gestiona cookies httpOnly automáticamente, soporta Server Components y Client Components, y maneja el refresh de tokens de forma transparente.

**Alternativas consideradas**:
- Supabase Auth sin SSR: Requiere manejo manual de cookies, no funciona con Server Components
- NextAuth.js: Adds dependencia innecesaria, Supabase ya tiene auth integrado
- Custom JWT: Requiere infraestructura adicional (jwks endpoint, key rotation)

**Patrón de implementación**:
```typescript
// src/lib/supabase/client.ts - Browser
import { createBrowserClient } from '@supabase/ssr'
export function createClient() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}

// src/lib/supabase/server.ts - Server Components / Server Actions
import { createServerClient } from '@supabase/ssr'
export async function createClient() {
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies })
}
```

### 2. Middleware de Protección de Rutas

**Decisión**: Middleware en `src/lib/supabase/middleware.ts` que verifica sesión y rol antes de cada request a rutas protegidas.

**Razón**: Next.js middleware se ejecuta antes de que la request llegue al route handler, ideal para verificación de auth. Supabase SSR soporta verificación de sesión desde middleware.

**Lógica de rutas**:
- `/admin/*`: Verificar rol en tabla `profiles` (admin_hl, admin_kc, superadmin)
- `/perfil/*`: Verificar sesión activa
- `/checkout/*`: Verificar sesión activa

**Redirecciones**:
- No autenticado → `/login` (preservar URL de retorno)
- Sin rol admin → `/` (mensaje de acceso denegado)
- admin_hl en `/admin/productos/*` → `/admin/libros`
- admin_kc en `/admin/libros/*` → `/admin/productos`

### 3. Creación Automática de Perfil

**Decisión**: Crear perfil en Server Action `signUp` después de crear el usuario, con rollback si falla.

**Razón**: No usar database trigger porque Supabase Auth no garantiza que el trigger se ejecute en la misma transacción. Usar Server Action permite controlar el flujo y manejar errores.

**Flujo**:
1. `supabase.auth.signUp({ email, password })` → crear usuario
2. `supabase.from('profiles').insert({ id: userId, full_name, role: 'customer' })` → crear perfil
3. Si falla (2), eliminar usuario creado en (1)

### 4. "Recordarme" — Duración de Sesión

**Decisión**: Cuando el usuario marca "Recordarme", configurar la cookie de sesión con `maxAge` de 30 días.

**Razón**: Supabase SSR permite configurar `cookieOptions` al crear el cliente. Por defecto la cookie dura 1 hora. Con "Recordarme" se extiende a 30 días.

**Implementación**: Pasar parámetro `rememberMe` al Server Action `signIn`, que configura el cliente Supabase con `cookieOptions: { maxAge: 60 * 60 * 24 * 30 }`.

### 5. Auto-refresh de Token (FR-3.2.8, FR-3.2.9)

**Decisión**: Supabase SSR maneja automáticamente el refresh del token de acceso cuando expira.

**Razón**: `@supabase/ssr` incluye lógica de refresh en el cliente. Cuando el token expira, el cliente solicita uno nuevo automáticamente. Si el refresh falla (refresh token inválido/expirado), se redirige a `/login`.

**Implementación**: En el cliente, usar `supabase.auth.onAuthStateChange()` para detectar cambios de sesión. En el middleware, verificar si la sesión es válida antes de permitir acceso.

**FR-3.2.9 (refresh failure redirect)**: Este es un concern arquitectónico manejado por Supabase SSR. Cuando `onAuthStateChange` detecta un evento `SIGNED_OUT` o la sesión es nula, el middleware redirige a `/login` preservando la URL de origen via query param `from`. No requiere task explícito — se implementa como parte de T018 (middleware).

### 6. Página de Error de Supabase Auth

**Decisión**: Página dedicada `/auth-error` con opciones de reintentar y contactar WhatsApp.

**Razón**: Mejor UX que un mensaje de error crudo. El usuario puede reintentar la operación o contactar soporte directamente.

**Contenido**:
- Mensaje: "No pudimos conectar con el servicio de autenticación"
- Botón: "Reintentar" (volver a la página anterior)
- Botón: "Contactar por WhatsApp" (abrir wa.me con mensaje predefinido)

### 7. Teléfono con Selector de Formato

**Decisión**: Selector con opciones "Venezolano (+58)" e "Internacional (+XX)" con validación según formato.

**Razón**: Venezuela tiene formato específico (10 dígitos). El selector permite al usuario elegir su formato y se valida accordingly.

**Implementación**:
- Select con opciones: "Venezolano (+58)", "Internacional (+XX)"
- Input de teléfono: 10 dígitos para VE, variable para internacional
- Validación: regex según formato seleccionado
- Almacenamiento: formato completo (+58XXXXXXXXXX o +XXXXXXXXXXXX)

### 8. Type Guards para Roles

**Decisión**: Type guard `isValidRole(role: string): role is UserRole` que valida contra los valores permitidos.

**Razón**: TypeScript type guards permiten narrowing de tipos en tiempo de ejecución. Más seguro que asumir que el rol de la DB es válido.

**Implementación**:
```typescript
const VALID_ROLES = ['customer', 'admin_hl', 'admin_kc', 'superadmin'] as const
type UserRole = typeof VALID_ROLES[number]

function isValidRole(role: string): role is UserRole {
  return VALID_ROLES.includes(role as UserRole)
}
```

### 9. Validación de Email

**Decisión**: Type guard `isValidEmail(email: string): boolean` con regex estándar.

**Razón**: Validación en el cliente para UX inmediata, y en Server Action para seguridad. Sin dependencias externas.

**Implementación**:
```typescript
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}
```
