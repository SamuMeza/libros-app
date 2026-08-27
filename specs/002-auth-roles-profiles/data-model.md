# Data Model: Autenticación, Roles y Perfiles

## Entities

### 1. Profile

**Tabla**: `profiles` (ya existe en DATABASE.md)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, FK → auth.users(id) ON DELETE CASCADE | ID del usuario de Supabase Auth |
| full_name | TEXT | | Nombre completo del usuario |
| phone | TEXT | | Teléfono con formato +58XXXXXXXXXX o +XXXXXXXXXXXX |
| avatar_url | TEXT | | URL de foto de perfil (no implementado en esta feature) |
| role | TEXT | NOT NULL, DEFAULT 'customer', CHECK IN ('customer', 'admin_hl', 'admin_kc', 'superadmin') | Rol del usuario |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Fecha de creación |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Fecha de última actualización |

**RLS Policies**:
- `USERS_OWN_PROFILE`: `auth.uid() = id` → SELECT, UPDATE, DELETE
- `ADMIN_HL_READ`: `role IN ('admin_hl', 'superadmin')` → SELECT (para gestión de usuarios)

### 2. Address

**Tabla**: `addresses` (ya existe en DATABASE.md)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | ID único de la dirección |
| user_id | UUID | FK → auth.users(id) ON DELETE CASCADE | ID del propietario |
| label | TEXT | | Etiqueta descriptiva (ej: "Casa", "Oficina") |
| street | TEXT | NOT NULL | Dirección principal |
| city | TEXT | NOT NULL | Ciudad |
| state | TEXT | NOT NULL | Estado/Provincia |
| zip_code | TEXT | | Código postal |
| phone | TEXT | | Teléfono de contacto en la dirección |
| is_default | BOOLEAN | DEFAULT FALSE | Si es la dirección predeterminada |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Fecha de creación |

**RLS Policies**:
- `USER_OWN_ADDRESSES`: `auth.uid() = user_id` → SELECT, INSERT, UPDATE, DELETE

## Relationships

```
auth.users (1) ──── (1) profiles
auth.users (1) ──── (N) addresses
```

## State Transitions

### Profile Lifecycle

```
[Registro] → profiles INSERT (role: 'customer')
    ↓
[Login] → profiles SELECT (verificar role)
    ↓
[Actualizar perfil] → profiles UPDATE (full_name, phone)
    ↓
[Agregar dirección] → addresses INSERT
    ↓
[Eliminar cuenta] → profiles DELETE, addresses DELETE (CASCADE)
```

### Role Assignment (fuera de alcance)

```
[Registro] → role: 'customer' (por defecto)
    ↓
[Superadmin asigna] → profiles UPDATE role → 'admin_hl' | 'admin_kc' | 'superadmin'
```

## Validation Rules

### Profile
- `full_name`: No vacío, máximo 100 caracteres
- `phone`: Formato válido según selector (VE: 10 dígitos, Internacional: +XX + dígitos)
- `role`: Solo valores permitidos: 'customer', 'admin_hl', 'admin_kc', 'superadmin'

### Address
- `street`: No vacío, máximo 200 caracteres
- `city`: No vacío, máximo 100 caracteres
- `state`: No vacío, máximo 100 caracteres
- `is_default`: Si se marca como predeterminada, desmarcar las demás del mismo usuario

## Type Definitions

```typescript
// src/types/auth.ts
type UserRole = 'customer' | 'admin_hl' | 'admin_kc' | 'superadmin'

interface AuthResponse {
  success: boolean
  data?: { user: User; session: Session }
  error?: string
}

// src/types/profile.ts
interface Profile {
  id: string
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

interface Address {
  id: string
  user_id: string
  label: string | null
  street: string
  city: string
  state: string
  zip_code: string | null
  phone: string | null
  is_default: boolean
  created_at: string
}

type PhoneFormat = 've' | 'international'
```
