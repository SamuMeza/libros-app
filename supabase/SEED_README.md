# Seed Data — Instrucciones de Configuracion

Guia paso a paso para poblar la base de datos con datos de prueba.

---

## Prerrequisitos

- Proyecto Supabase activo: `uymzhsautlyiavajyzqc.supabase.co`
- Migraciones ya aplicadas (tablas + RLS):
  - `20260901000001_cart_checkout_tables.sql`
  - `20260901000002_cart_checkout_rls.sql`
- Acceso al **SQL Editor** del dashboard de Supabase

---

## Paso 1: Crear Usuarios en Supabase Auth

1. Ir al dashboard de Supabase: https://supabase.com/dashboard
2. Seleccionar el proyecto
3. Ir a **Authentication** > **Users** > **Add user**
4. Crear los 4 usuarios uno por uno:

| # | Email | Password | Nombre |
|---|-------|----------|--------|
| 1 | `admin@sistema.com` | (definir uno seguro) | Super Admin |
| 2 | `admin@hechoyletras.com` | (definir uno seguro) | Admin HL |
| 3 | `admin@kamcat.com` | (definir uno seguro) | Admin KC |
| 4 | `cliente@test.com` | (definir uno seguro) | Cliente Prueba |

5. **Copiar el UUID** de cada usuario. Se muestra en la columna "UID" de la lista de usuarios, o al hacer click en cada usuario.

> **Tip:** Guarda los UUIDs en un archivo temporal. Los necesitas en el Paso 2.

Ejemplo de UUID: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`

---

## Paso 2: Insertar Profiles con Roles

Los profiles vinculan cada usuario de Auth con su rol en la aplicacion.

1. Ir a **SQL Editor** en el dashboard
2. Copiar el siguiente SQL y **reemplazar los UUIDs** con los reales del Paso 1:

```sql
-- =============================================
-- Profiles de prueba con roles
-- =============================================
-- REEMPLAZAR cada 'UUID_A_REEMPLAZAR' con el UUID real del Paso 1

INSERT INTO profiles (id, full_name, phone, role) VALUES
  ('UUID_DEL_SUPERADMIN', 'Super Admin', '+58 414 000 0001', 'superadmin'),
  ('UUID_DEL_ADMIN_HL', 'Admin Hecho Letras', '+58 414 000 0002', 'admin_hl'),
  ('UUID_DEL_ADMIN_KC', 'Admin KamCat', '+58 414 000 0003', 'admin_kc'),
  ('UUID_DEL_CLIENTE', 'Cliente Prueba', '+58 414 000 0004', 'customer')
ON CONFLICT (id) DO NOTHING;
```

**Ejemplo real** (reemplaza con tus UUIDs):

```sql
INSERT INTO profiles (id, full_name, phone, role) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Super Admin', '+58 414 000 0001', 'superadmin'),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Admin Hecho Letras', '+58 414 000 0002', 'admin_hl'),
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Admin KamCat', '+58 414 000 0003', 'admin_kc'),
  ('d4e5f6a7-b8c9-0123-def0-234567890123', 'Cliente Prueba', '+58 414 000 0004', 'customer')
ON CONFLICT (id) DO NOTHING;
```

3. Hacer click en **Run** (o presionar Ctrl+Enter)
4. Verificar que diga "Success. No rows returned"

### Roles y permisos

| Rol | Puede ver | Puede gestionar |
|-----|-----------|-----------------|
| `superadmin` | Todo | Todo (libros, productos, pedidos, pagos, usuarios, config) |
| `admin_hl` | Todo el catalogo | Libros, pedidos HL, pagos HL |
| `admin_kc` | Todo el catalogo | Productos KC, pedidos KC, pagos KC |
| `customer` | Catalogo publico, sus propios pedidos | Su carrito, sus pagos, su perfil |

---

## Paso 3: Ejecutar Seed Data

1. Abrir el archivo `supabase/seeds/001_initial_seed.sql`
2. Copiar **todo** el contenido
3. Pegarlo en el **SQL Editor** de Supabase
4. Hacer click en **Run** (o Ctrl+Enter)
5. Verificar que diga "Success" sin errores

### Que inserta este script

| Tabla | Registros | Contenido |
|-------|-----------|-----------|
| `categories` | 6 | 3 categorias HL + 3 categorias KC |
| `books` | 6 | Libros de ejemplo con metadatos completos |
| `products` | 6 | Productos KC con variants y customization_options |
| `book_extras` | 6 | Enlaces cross-sell (libro → producto) |

### Notas importantes

- El script es **idempotente**: puede ejecutarse varias veces sin duplicar datos (`ON CONFLICT DO NOTHING`)
- Los `category_id` de libros y productos se resuelven automaticamente con subqueries
- Los `variants` y `customization_options` estan en formato JSONB

---

## Paso 4: Verificar los Datos

1. Ir a **Table Editor** en el dashboard
2. Verificar cada tabla:

| Tabla | Registros esperados | Que buscar |
|-------|---------------------|------------|
| `categories` | 6 | 3 con `brand='hl'`, 3 con `brand='kc'` |
| `books` | 6 | Titulos como "Cien anos de soledad", "El principito" |
| `products` | 6 | "Cuaderno Arcoiris", "Lapicero Brillante", etc. |
| `book_extras` | 6 | Relaciones libro → producto |
| `profiles` | 4 | Los 4 usuarios con sus roles |

3. Ir a la aplicacion y probar:
   - Login con `cliente@test.com` → debe ver el catalogo
   - Login con `admin@hechoyletras.com` → debe ver el panel admin HL
   - Login con `admin@kamcat.com` → debe ver el panel admin KC
   - Login con `admin@sistema.com` → debe ver todo el admin

---

## Discrepancia de Env Vars (⚠️ Revisar)

El `.env.local` usa:
```
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Pero la documentacion (`docs/ENV_VARIABLES.md`) y el codigo Supabase client esperan:
```
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

**Acción:** Verificar cual nombre es correcto y actualizar el otro archivo para que coincidan.

---

## Como Resetear los Datos

Si necesitas re-ejecutar el seed desde cero, ejecutar en el SQL Editor:

```sql
-- Orden inverso de dependencias (respetar foreign keys)
TRUNCATE book_extras CASCADE;
TRUNCATE products CASCADE;
TRUNCATE books CASCADE;
TRUNCATE categories CASCADE;
-- NO tocar profiles (los usuarios de Auth se mantienen)
```

Luego re-ejecutar `001_initial_seed.sql`.

Para un reset completo (incluyendo profiles y usuarios):

```sql
-- ⚠️ ESTO ELIMINA TODO. Usar solo en desarrollo.
TRUNCATE book_extras CASCADE;
TRUNCATE products CASCADE;
TRUNCATE books CASCADE;
TRUNCATE categories CASCADE;
TRUNCATE profiles CASCADE;
-- Los usuarios de Auth se eliminan desde el dashboard:
-- Authentication > Users > seleccionar > Delete user
```

---

## Archivos de Migracion y Seeds

```
supabase/
├── migrations/
│   ├── 20260901000001_cart_checkout_tables.sql   # Tablas + datos de config
│   └── 20260901000002_cart_checkout_rls.sql      # Politicas RLS
├── seeds/
│   └── 001_initial_seed.sql                      # Datos de prueba (este archivo)
└── SEED_README.md                                # Este documento
```

**Orden de ejecucion:**
1. `migrations/..._tables.sql` → crea tablas
2. `migrations/..._rls.sql` → habilita RLS y politicas
3. Crear usuarios en Auth (Paso 1 de esta guia)
4. Insertar profiles con roles (Paso 2 de esta guia)
5. `seeds/001_initial_seed.sql` → datos de prueba (Paso 3 de esta guia)
