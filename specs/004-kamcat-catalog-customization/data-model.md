# Data Model: Catálogo y Personalización KamCat

**Feature**: 004-kamcat-catalog-customization  
**Date**: 2026-08-27

---

## Entities

### Product (products table)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Identificador único |
| name | TEXT | NOT NULL | Nombre del producto |
| description | TEXT | | Descripción del producto |
| price | DECIMAL(10,2) | NOT NULL, CHECK > 0 | Precio base |
| images | TEXT[] | | Array de URLs de imágenes (Cloudinary) |
| category_id | UUID | FK → categories.id | Categoría del producto |
| brand | TEXT | NOT NULL, DEFAULT 'kc' | Marca (siempre 'kc') |
| variants | JSONB | DEFAULT '[]' | Variantes de producto |
| customization_options | JSONB | DEFAULT '[]' | Opciones de personalización |
| is_active | BOOLEAN | DEFAULT TRUE | Producto visible en catálogo |
| created_by | UUID | FK → auth.users.id | Creador del producto |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Fecha de creación |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Última actualización |

### Category (categories table)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Identificador único |
| name | TEXT | NOT NULL | Nombre de la categoría |
| slug | TEXT | NOT NULL, UNIQUE | Slug URL-friendly |
| brand | TEXT | NOT NULL, CHECK IN ('hl','kc') | Marca |
| description | TEXT | | Descripción de la categoría |
| image_url | TEXT | | Imagen de la categoría |
| sort_order | INTEGER | DEFAULT 0 | Orden de aparición |
| is_active | BOOLEAN | DEFAULT TRUE | Categoría visible |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Fecha de creación |

---

## JSONB Structures

### variants

```json
[
  {
    "name": "Tamaño",
    "options": [
      {
        "label": "Pequeño",
        "price_adjustment": 0,
        "value": "small"
      },
      {
        "label": "Mediano",
        "price_adjustment": 2.00,
        "value": "medium"
      },
      {
        "label": "Grande",
        "price_adjustment": 4.00,
        "value": "large"
      }
    ]
  },
  {
    "name": "Color",
    "options": [
      {
        "label": "Rojo",
        "price_adjustment": 0,
        "value": "red",
        "color_hex": "#FF0000"
      },
      {
        "label": "Azul",
        "price_adjustment": 0,
        "value": "blue",
        "color_hex": "#0000FF"
      }
    ]
  }
]
```

### customization_options

```json
[
  {
    "type": "text",
    "label": "Nombre a estampar",
    "max_length": 50,
    "placeholder": "Ej: María"
  }
]
```

---

## Relationships

```
categories (1) ──── (N) products
                          │
                          ├── variants (JSONB)
                          └── customization_options (JSONB)
```

- Un producto pertenece a una categoría
- Una categoría puede tener muchos productos
- Las variantes y opciones de personalización se almacenan como JSONB en el producto

---

## Validation Rules

| Rule | Source | Description |
|------|--------|-------------|
| price > 0 | DB CHECK | Precio base debe ser positivo |
| brand = 'kc' | DB CHECK | Solo productos KamCat |
| is_active = TRUE | RLS | Solo productos activos son visibles |
| variants JSONB | App | Debe ser array de objetos con name y options |
| customization_options JSONB | App | Debe ser array de objetos con type, label, max_length |
| color_hex format | App | Debe ser color hexadecimal válido (#RRGGBB) |

---

## State Transitions

No aplica para esta feature — los productos no tienen ciclo de vida complexo en esta fase.

---

## Indexes

| Index | Table | Columns | Purpose |
|-------|-------|---------|---------|
| idx_products_category | products | category_id | Filtro por categoría |
| idx_products_brand | products | brand | Filtro por marca |
| idx_products_active | products | is_active | Filtrar productos activos |
| idx_categories_slug | categories | slug | Lookup por slug |
| idx_categories_brand | categories | brand | Filtro por marca |
