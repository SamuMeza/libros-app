# Quickstart: Autenticación, Roles y Perfiles

## Prerrequisitos

- Node.js 18+ (o Bun)
- Proyecto configurado con variables de entorno de Supabase:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Tablas `profiles` y `addresses` creadas en Supabase (ver DATABASE.md)
- Políticas RLS configuradas para ambas tablas

## Escenarios de Validación

### 1. Registro de Nuevo Usuario

```bash
# Iniciar servidor de desarrollo
bun run dev

# Navegar a http://localhost:3000/register
# Completar formulario:
#   - Nombre: "Juan Pérez"
#   - Email: "juan@test.com"
#   - Contraseña: "password123"
#   - Confirmar: "password123"
# Hacer clic en "Crear cuenta"
```

**Resultado esperado**:
- Redirección a `/`
- Perfil creado en tabla `profiles` con role 'customer'
- Cookie de sesión establecida

### 2. Login con Email/Password

```bash
# Navegar a http://localhost:3000/login
# Ingresar credenciales registradas
# Marcar "Recordarme"
# Hacer clic en "Iniciar sesión"
```

**Resultado esperado**:
- Redirección a `/` (customer) o `/admin` (admin)
- Cookie de sesión con maxAge de 30 días (Recordarme)
- Loader sutil visible durante el proceso

### 3. Login con Google OAuth

```bash
# Navegar a http://localhost:3000/login
# Hacer clic en "Continuar con Google"
# Completar flujo de Google
```

**Resultado esperado**:
- Redirección a `/`
- Perfil creado automáticamente si es usuario nuevo
- Sesión establecida

### 4. Recuperación de Contraseña

```bash
# Navegar a http://localhost:3000/forgot-password
# Ingresar email registrado
# Hacer clic en "Enviar enlace"
```

**Resultado esperado**:
- Mensaje de confirmación: "Revisa tu correo"
- Email recibido con enlace de restablecimiento
- Si el email no existe: mismo mensaje (por seguridad)

### 5. Cierre de Sesión

```bash
# Con sesión activa, hacer clic en "Cerrar sesión"
```

**Resultado esperado**:
- Redirección a `/`
- Cookie de sesión eliminada
- Todas las pestañas abiertas se actualizan (eventos realtime)

### 6. Protección de Rutas Admin

```bash
# Con sesión de customer, intentar acceder a /admin
# Con sesión de admin_hl, intentar acceder a /admin/productos
# Sin sesión, intentar acceder a /perfil
```

**Resultado esperado**:
- Customer → redirigido a `/`
- admin_hl en /admin/productos → redirigido a `/admin/libros`
- Sin sesión en /perfil → redirigido a `/login`

### 7. Gestión de Perfil

```bash
# Con sesión activa, navegar a /perfil
# Editar nombre y teléfono
# Agregar dirección de envío
# Marcar dirección como predeterminada
```

**Resultado esperado**:
- Cambios guardados inmediatamente
- Dirección predeterminada marcada
- Solo se ven las propias direcciones (RLS)

### 8. Error de Supabase Auth

```bash
# Simular caída de Supabase (detener servidor de Supabase o usar wrong keys)
# Intentar hacer login
```

**Resultado esperado**:
- Página de error dedicada mostrada
- Botón "Reintentar" funcional
- Botón "Contactar por WhatsApp" funcional

### 9. Sesión Expirada

```bash
# Esperar a que expire la sesión (o manipular cookie)
# Intentar navegar a ruta protegida
```

**Resultado esperado**:
- Redirección a `/login`
- URL de origen preservada en query param
- Tras login, redirección a la URL original

## Comandos de Verificación

```bash
# Ejecutar tests unitarios
bun test tests/unit/

# Ejecutar tests de integración
bun test tests/integration/

# Verificar cobertura
bun test --coverage

# Verificar lint
bun run lint
```
