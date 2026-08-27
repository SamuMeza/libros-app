# Especificación: Autenticación, Roles y Perfiles

**Feature:** 002-auth-roles-profiles  
**Fecha:** 2026-08-26  
**Estado:** borrador  

---

## 1. Resumen

Implementar el módulo completo de autenticación y gestión de perfiles para la plataforma e-commerce unificada Hecho Letras & KamCat. Incluye registro, inicio de sesión, recuperación de contraseña, creación automática de perfil con rol por defecto, protección de rutas por rol y gestión de información personal del usuario.

---

## 2. Contexto y Motivo

La plataforma requiere un sistema de autenticación que soporte:
- Dos marcas con identidades visuales diferenciadas
- Cuatro roles de usuario: `customer`, `admin_hl`, `admin_kc`, `superadmin`
- Integración con Supabase Auth para gestión segura de sesiones
- Creación automática de registros en `profiles` al registrarse
- Protección de rutas administrativas según el rol del usuario

---

## 3. Requerimientos Funcionales

### 3.1 Pantallas de Autenticación

**Rutas en App Router:**
- `src/app/(auth)/login/page.tsx` — Inicio de sesión
- `src/app/(auth)/register/page.tsx` — Registro de nuevos usuarios
- `src/app/(auth)/forgot-password/page.tsx` — Recuperación de contraseña

**Entradas:**
- Formulario de login: email, contraseña, checkbox "Recordarme"
- Formulario de registro: nombre completo, email, contraseña, confirmar contraseña
- Formulario de recuperación: email

**Salidas:**
- Login exitoso → redirección a `/` (customer) o `/admin` (roles admin)
- Registro exitoso → creación automática de perfil + redirección a `/`
- Recuperación exitosa → mensaje de confirmación + enlace mágico por email

**Criterios de Aceptación:**
- [ ] Layout: tarjeta centrada `max-w-[440px]`, fondo `--bg-card`, radio `radius-xl`, sombra `shadow-lg`, padding `space-8`
- [ ] Inputs: fondo `--bg-primary`, borde `1px` `--border`, radio `radius-md`, foco con anillo `2px` en `--hl-primary`
- [ ] Botón primario: alto `2.75rem`, `radius-lg`, texto `--text-on-dark`
- [ ] Botón OAuth: Continuar con Google con icono oficial
- [ ] Links: "¿Olvidaste tu contraseña?" en login, "¿No tienes cuenta? Regístrate aquí" en login
- [ ] Validación de formulario: campos obligatorios, formato de email, contraseña mínimo 8 caracteres
- [ ] Mensajes de error claros en español para cada tipo de fallo: mostrar como toast en esquina superior derecha, fondo rojo suave, texto descriptivo con causa y acción sugerida
- [ ] Accesibilidad: navegación por teclado, aria-labels en todos los campos
- [ ] Estado de procesamiento: botón deshabilitado con texto dinámico ("Iniciando sesión...", "Creando cuenta...", "Enviando enlace..."), loader sutil con fondo difuminado (opacity 0.5, blur 4px) sobre el formulario, transición <100ms, sin spinner genérico

### 3.2 Integración con Supabase Auth

**Proveedores de autenticación:**
- Email/Password (obligatorio)
- OAuth de Google (opcional, habilitado por defecto)

**Entradas:**
- Credenciales del usuario (email + contraseña)
- Token de Google OAuth (cuando aplique)

**Salidas:**
- Sesión válida con tokens de acceso y refresco
- Cookie de sesión httpOnly gestionada por Supabase SSR

**Criterios de Aceptación:**
- [ ] Login con email/password funciona correctamente
- [ ] Login con Google OAuth funciona correctamente (si está habilitado)
- [ ] La sesión se persiste entre recargas de página
- [ ] El cierre de sesión destruye la sesión en servidor y cliente
- [ ] Los errores de autenticación se muestran en español
- [ ] Si Supabase Auth no está disponible, mostrar página de error dedicada con opciones: reintentar, contactar soporte por WhatsApp
- [ ] No se exponen tokens en el cliente (solo cookies httpOnly)
- [ ] Auto-refresh silencioso del token mientras el usuario esté activo
- [ ] Si el refresh falla, redirigir a `/login` preservando la URL de origen para retorno post-login

### 3.3 Server Actions de Autenticación

**Ubicación:** `src/lib/actions/` (un archivo por Server Action)

**Acciones:**
- `signIn(email, password, rememberMe?)` — Iniciar sesión
- `signUp(email, password, fullName)` — Registrar nuevo usuario
- `signOut()` — Cerrar sesión
- `resetPassword(email)` — Enviar enlace de restablecimiento

**Entradas:**
- `signIn`: email (string), password (string), rememberMe (boolean, opcional, default: false)
- `signUp`: email (string), password (string), fullName (string)
- `signOut`: sin parámetros
- `resetPassword`: email (string)

**Salidas (estándar):**
```typescript
{ success: boolean; data?: T; error?: string }
```

**Criterios de Aceptación:**
- [ ] Validaciones manuales de entrada (sin zod): email válido, contraseña ≥8 caracteres, nombre no vacío
- [ ] `signIn` retorna sesión válida o error descriptivo
- [ ] `signUp` crea usuario + perfil con rol `customer` + retorna sesión
- [ ] `signOut` limpia sesión y cookies
- [ ] `resetPassword` envía email de restablecimiento (no retorna error si el email no existe por seguridad)
- [ ] Cada Server Action se exporta como `export default` en su propio archivo (un action por archivo)
- [ ] Type guard para validar formato de email
- [ ] Type guard para validar que el rol retornado es válido

### 3.4 Creación Automática de Perfil

**Tabla:** `profiles` (definida en DATABASE.md)

**Trigger:** Al registrar un nuevo usuario mediante `signUp`, se crea automáticamente un registro en `profiles` con:
- `id`: UUID del usuario de Supabase Auth
- `full_name`: nombre proporcionado en el registro
- `role`: `'customer'` (valor por defecto)
- `created_at` y `updated_at`: timestamp actual

**Criterios de Aceptación:**
- [ ] El perfil se crea automáticamente al completar el registro
- [ ] El rol por defecto es siempre `'customer'`
- [ ] No se permite al usuario especificar un rol diferente al registrarse
- [ ] Si la creación del perfil falla, se revierte la creación del usuario
- [ ] El perfil es inmediatamente accesible tras el registro (< 500ms)

### 3.5 Gestión de Perfil de Usuario

**Ruta:** `src/app/(shop)/perfil/page.tsx` (dentro del layout protegido)

**Campos editables:**
- Nombre completo
- Teléfono con selector de formato (Venezolano: 10 dígitos / Internacional: +XX)
- Direcciones de envío (CRUD)

**Criterios de Aceptación:**
- [ ] El usuario puede ver y editar su nombre y teléfono
- [ ] Teléfono: selector con opciones "Venezolano (+58)" e "Internacional (+XX)", validación según formato seleccionado
- [ ] El usuario puede agregar, editar y eliminar direcciones de envío
- [ ] Se puede marcar una dirección como predeterminada (`is_default`)
- [ ] La dirección predeterminada se guarda con `is_default: true` (el uso automático en checkout es responsabilidad del módulo de checkout, fuera de alcance de esta feature)
- [ ] Los cambios se reflejan inmediatamente en la UI (< 100ms tras guardado)
- [ ] Solo el propio usuario puede ver/editar su perfil (RLS verified)

### 3.6 Middleware de Protección de Rutas

**Ubicación:** `src/lib/supabase/middleware.ts`

**Rutas protegidas:**
- `/admin/*` — Solo accesible para `admin_hl`, `admin_kc`, `superadmin`
- `/perfil/*` — Solo accesible para usuarios autenticados
- `/checkout/*` — Solo accesible para usuarios autenticados

**Lógica de redirección:**
- Ruta protegida + usuario no autenticado → `/login`
- Ruta admin + usuario sin rol admin → `/` (con mensaje de acceso denegado)
- Ruta admin + `admin_hl` → solo acceso a `/admin/libros/*`
- Ruta admin + `admin_kc` → solo acceso a `/admin/productos/*`

**Criterios de Aceptación:**
- [ ] El middleware verifica la sesión en cada request a rutas protegidas
- [ ] Los usuarios no autenticados son redirigidos a `/login`
- [ ] Los usuarios con rol `customer` no pueden acceder a `/admin/*`
- [ ] `admin_hl` solo puede acceder a rutas de HL en admin
- [ ] `admin_kc` solo puede acceder a rutas de KC en admin
- [ ] `superadmin` puede acceder a todas las rutas admin
- [ ] La verificación de roles usa el campo `role` de la tabla `profiles`
- [ ] El middleware no bloquea rutas públicas (catálogos, home, etc.)

### 3.7 Pruebas Unitarias

**Ubicación:** `tests/` (siguiendo estructura existente)

**Alcance:**
- Server Actions de auth (signIn, signUp, signOut, resetPassword)
- Type guards para roles de usuario
- Validaciones de entrada (email, contraseña, nombre)

**Criterios de Aceptación:**
- [ ] Tests para `signIn` con credenciales válidas e inválidas
- [ ] Tests para `signUp` con datos válidos y edge cases (email duplicado, contraseña débil)
- [ ] Tests para `signOut` (verificar limpieza de sesión)
- [ ] Tests para `resetPassword` (verificar envío de email)
- [ ] Tests para type guard de roles (valores válidos e inválidos)
- [ ] Tests para validaciones de entrada (campos vacíos, formatos incorrectos)
- [ ] Todos los tests usan patrón AAA (Arrange-Act-Assert)
- [ ] Cobertura de edge cases: email duplicado, contraseña incorrecta, sesión expirada

---

## 4. Criterios de Éxito

### Cuantitativos
- Login completado en < 3 segundos
- Registro completado en < 5 segundos
- Tasa de éxito en login > 95% (excluyendo credenciales incorrectas)
- Cobertura de tests > 80%

> **Nota:** Las métricas de rendimiento (SC-1, SC-2, SC-3) requieren infraestructura de monitoreo que será implementada como parte del feature de observabilidad (post-MVP). Para esta feature, se validará manualmente con el quickstart.

### Cualitativos
- Flujo de autenticación intuitivo sin instrucciones adicionales
- Mensajes de error claros y accionables en español
- Acceso denegado se maneja con redirección a `/` preservando query param `from` para retorno, no con errores crudos
- Perfil de usuario fácil de encontrar y editar

---

## 5. Supuestos

1. Supabase Auth está configurado correctamente con proyecto activo
2. El servicio de email de Supabase está habilitado para enlaces de restablecimiento
3. Google OAuth está configurado en Supabase Console (client ID y secret)
4. La tabla `profiles` ya existe en la base de datos con el esquema definido en DATABASE.md
5. Las políticas RLS para `profiles` ya están configuradas (usuarios solo ven/editan su propio perfil)
6. El middleware de Supabase SSR ya está instalado y configurado

---

## 6. Dependencias

- **Interno:** Feature 001 (Layout Base y Sistema de Diseño) — tokens CSS y componentes UI
- **Externo:** Supabase Auth, Supabase SSR, Google OAuth

---

## 7. Fuera de Alcance

- Gestión de roles por parte de superadmin (asignación de roles admin_hl/admin_kc)
- Autenticación por teléfono o SMS
- Autenticación de dos factores (2FA)
- Gestión de sesiones múltiples o dispositivos
- Rate limiting de intentos de login
- Verificación de email antes del primer login
- Upload de foto de perfil (campo `avatar_url` queda disponible para uso futuro)

---

## Clarifications

### Session 2026-08-26
- Q: ¿Qué opción de "Recordarme" implica técnicamente? → A: Extender la duración de la cookie de sesión de Supabase (ej: 30 días en lugar de la duración por defecto de 1 hora).
- Q: ¿Qué sucede si un usuario intenta registrarse con un email ya existente? → A: Mostrar mensaje específico "Este correo ya está registrado. ¿Olvidaste tu contraseña?" con enlace a forgot-password.
- Q: ¿Cómo se maneja el cierre de sesión desde múltiples pestañas? → A: Supabase Auth emite eventos en tiempo real; al cerrar sesión, todas las pestañas se actualizan automáticamente.
- Q: ¿Qué debería mostrar la UI mientras se procesan las operaciones de login, registro o recuperación de contraseña? → A: Ver §3.1 criterios de aceptación (estado de procesamiento).
- Q: ¿Qué sucede cuando la sesión del usuario expira mientras está navegando activamente? → A: Auto-refresh silencioso del token mientras el usuario esté activo; si el refresh falla, redirigir a `/login` preservando la URL de origen para retorno post-login.
- Q: ¿Qué debería ocurrir cuando Supabase Auth no está disponible? → A: Mostrar página de error dedicada con opciones: reintentar, contactar soporte por WhatsApp.
- Q: ¿El usuario debería poder subir foto de perfil? → A: No, omitir avatar por ahora. El campo `avatar_url` queda disponible para uso futuro.
- Q: ¿Qué formato de número de teléfono se espera validar? → A: Selector con opciones "Venezolano (+58)" e "Internacional (+XX)", validación según formato seleccionado.

---

**Fin de la Especificación**
