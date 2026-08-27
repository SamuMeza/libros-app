# Data Model: Catálogo y Detalle de Libros (Hecho Letras)

**Feature:** 003-catalog-hecho-letras  
**Fecha:** 2026-08-26

---

## 1. Entidades

### 1.1 Book (Libro)

| Campo | Tipo | Constraints | Descripción |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Identificador único |
| `title` | TEXT | NOT NULL | Título del libro |
| `author` | TEXT | NOT NULL | Autor del libro |
| `description` | TEXT | NULL | Sinopsis/descripción |
| `price` | DECIMAL(10,2) | NOT NULL, CHECK > 0 | Precio en USD |
| `images` | TEXT[] | NOT NULL | URLs de Cloudinary (primera = portada) |
| `slug` | TEXT | UNIQUE NOT NULL | URL amigable generada desde título |
| `category_id` | UUID | FK → categories(id) | Categoría/género |
| `status` | TEXT | NOT NULL DEFAULT 'available' | Estado: 'available', 'pre_order', 'out_of_stock' |
| `stock_status` | TEXT | NOT NULL DEFAULT 'in_stock' | Stock: 'in_stock', 'on_demand' |
| `delivery_days` | INTEGER | DEFAULT 7 | Días hábiles de entrega estimada |
| `editorial` | TEXT | NULL | Editorial / sello editorial |
| `pages` | INTEGER | NULL | Número de páginas |
| `language` | TEXT | NULL | Idioma del libro (ej. 'Español', 'Inglés') |
| `binding` | TEXT | NULL | Tipo de encuadernación (ej. 'Tapa blanda', 'Tapa dura') |
| `is_featured` | BOOLEAN | DEFAULT FALSE | Libro destacado |
| `is_active` | BOOLEAN | DEFAULT FALSE | Visibilidad en catálogo |
| `created_by` | UUID | FK → auth.users(id) | Admin que creó el registro |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Fecha de creación |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Última actualización |

**Índices:**
- `idx_books_search` (GIN): `to_tsvector('spanish', title || ' ' || author || ' ' || COALESCE(description, ''))`
- `idx_books_slug`: UNIQUE en `slug`
- `idx_books_category`: `category_id`
- `idx_books_status`: `status`, `is_active`

---

### 1.2 Category (Categoría)

| Campo | Tipo | Constraints | Descripción |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Identificador único |
| `name` | TEXT | NOT NULL | Nombre de la categoría |
| `slug` | TEXT | UNIQUE NOT NULL | URL amigable |
| `brand` | TEXT | NOT NULL CHECK (brand IN ('hl', 'kc')) | Marca |
| `description` | TEXT | NULL | Descripción de la categoría |
| `image_url` | TEXT | NULL | Imagen de la categoría |
| `sort_order` | INTEGER | DEFAULT 0 | Orden de visualización |
| `is_active` | BOOLEAN | DEFAULT TRUE | Visibilidad |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Fecha de creación |

**Filtro para HL:** `WHERE brand = 'hl' AND is_active = TRUE`

---

### 1.3 BookExtra (Extra de Libro)

| Campo | Tipo | Constraints | Descripción |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Identificador único |
| `book_id` | UUID | NOT NULL FK → books(id) ON DELETE CASCADE | Libro asociado |
| `product_id` | UUID | NOT NULL FK → products(id) ON DELETE CASCADE | Producto KamCat |
| `is_default` | BOOLEAN | DEFAULT FALSE | Pre-seleccionado en UI |
| `sort_order` | INTEGER | DEFAULT 0 | Orden de visualización |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Fecha de creación |

**RLS:** Lectura pública (SELECT para todos los usuarios autenticados y anónimos)

---

### 1.4 ContactRequest (Solicitud de Libro)

| Campo | Tipo | Constraints | Descripción |
|-------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Identificador único |
| `user_id` | UUID | NULL FK → auth.users(id) | Usuario autenticado (null si anónimo) |
| `book_title` | TEXT | NOT NULL | Título del libro solicitado |
| `book_author` | TEXT | NULL | Autor del libro |
| `email` | TEXT | NOT NULL | Email de contacto |
| `phone` | TEXT | NULL | Teléfono/WhatsApp |
| `message` | TEXT | NULL | Mensaje adicional (max 500 chars) |
| `status` | TEXT | DEFAULT 'pending' | Estado: 'pending', 'contacted', 'resolved' |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Fecha de solicitud |

**RLS:**
- `INSERT`: Cualquier usuario (autenticado o anónimo)
- `SELECT`: Solo el propio usuario o superadmin
- `UPDATE`: Solo superadmin

---

## 2. Relaciones

```
categories (1) ──── (N) books
books (1) ──── (N) book_extras
products (1) ──── (N) book_extras
auth.users (1) ──── (N) contact_requests
```

---

## 3. Tipos TypeScript

```typescript
// src/types/books.ts

export type BookStatus = 'available' | 'pre_order' | 'out_of_stock';
export type StockStatus = 'in_stock' | 'on_demand';
export type BookSort = 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'alpha';
export type AvailabilityFilter = 'in_stock' | 'on_demand' | 'all';

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string | null;
  price: number;
  images: string[];
  slug: string;
  category_id: string;
  status: BookStatus;
  stock_status: StockStatus;
  delivery_days: number;
  editorial: string | null;
  pages: number | null;
  language: string | null;
  binding: string | null;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BookWithCategory extends Book {
  categories: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface BookExtra {
  id: string;
  book_id: string;
  product_id: string;
  is_default: boolean;
  sort_order: number;
}

export interface BookExtraWithProduct extends BookExtra {
  products: {
    id: string;
    name: string;
    price: number;
    images: string[];
  };
}

export interface BookFilters {
  categoryIds?: string[];
  minPrice?: number;
  maxPrice?: number;
  availability?: AvailabilityFilter;
  search?: string;
  sort?: BookSort;
  page?: number;
  pageSize?: number;
}

export interface BookListResult {
  books: BookWithCategory[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ContactRequest {
  id: string;
  user_id: string | null;
  book_title: string;
  book_author: string | null;
  email: string;
  phone: string | null;
  message: string | null;
  status: 'pending' | 'contacted' | 'resolved';
  created_at: string;
}
```

---

## 4. Reglas de Validación

### Book
- `title`: requerido, no vacío
- `author`: requerido, no vacío
- `price`: requerido, > 0
- `images`: requerido, array no vacío (al menos 1 imagen)
- `slug`: requerido, unique, formato lowercase-kebab-case
- `status`: enum ['available', 'pre_order', 'out_of_stock']
- `stock_status`: enum ['in_stock', 'on_demand']
- `delivery_days`: >= 0
- `editorial`: string o null (opcional)
- `pages`: integer o null, >= 0 si se proporciona (opcional)
- `language`: string o null (opcional)
- `binding`: string o null (opcional)

### BookFilters
- `categoryIds`: array de UUIDs válidos (opcional)
- `minPrice`: >= 0 (opcional)
- `maxPrice`: >= minPrice (opcional)
- `search`: string no vacío (opcional)
- `sort`: enum de opciones de ordenamiento (opcional, default 'relevance')
- `page`: >= 1 (opcional, default 1)
- `pageSize`: 1-100 (opcional, default 24)

### ContactRequest
- `book_title`: requerido, no vacío
- `email`: requerido, formato válido
- `message`: max 500 caracteres
