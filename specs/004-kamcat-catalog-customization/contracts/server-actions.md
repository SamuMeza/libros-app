# Server Actions Contract: Products KamCat

**Feature**: 004-kamcat-catalog-customization  
**Date**: 2026-08-27

---

## getProducts

**Purpose**: Consulta productos KamCat con filtros, búsqueda, ordenamiento y paginación

**Input**:
```typescript
interface GetProductsFilters {
  categoryIds?: string[];    // UUIDs de categorías (OR dentro del grupo)
  minPrice?: number;         // Precio mínimo
  maxPrice?: number;         // Precio máximo
  search?: string;           // Búsqueda por nombre
  sort?: 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'alpha';
  page?: number;             // Default: 1
  pageSize?: number;         // Default: 24
}
```

**Output**:
```typescript
interface GetProductsResponse {
  success: boolean;
  data?: {
    products: Product[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  error?: string;
}
```

**Behavior**:
- Retorna solo productos con `is_active = TRUE` y `brand = 'kc'`
- Filtros se combinan con AND entre grupos, OR dentro del mismo
- Búsqueda es case-insensitive y sin tildes
- Paginación incluye total de resultados

---

## getProductBySlug

**Purpose**: Obtiene un producto por su slug con categoría, variantes y opciones de personalización

**Input**:
```typescript
slug: string
```

**Output**:
```typescript
interface GetProductBySlugResponse {
  success: boolean;
  data?: Product & {
    category: Category;
    variants: Variant[];
    customizationOptions: CustomizationOption[];
  };
  error?: string;
}
```

**Behavior**:
- Retorna `null` en `data` si el slug no existe o `is_active = FALSE`
- Parsea JSONB de variants y customization_options de forma segura
- Retorna arrays vacíos si JSONB es inválido

---

## getProductCategories

**Purpose**: Obtiene las categorías de KamCat con recuento de productos

**Input**: Ninguno

**Output**:
```typescript
interface GetProductCategoriesResponse {
  success: boolean;
  data?: {
    id: string;
    name: string;
    slug: string;
    productCount: number;
  }[];
  error?: string;
}
```

**Behavior**:
- Retorna solo categorías con `brand = 'kc'` e `is_active = TRUE`
- Incluye recuento de productos activos por categoría
- Ordenado por `sort_order`

---

## calculateProductPrice

**Purpose**: Calcula el precio final base + variantes seleccionadas

**Input**:
```typescript
interface CalculatePriceInput {
  productId: string;
  selectedVariants?: {
    size?: string;
    color?: string;
  };
}
```

**Output**:
```typescript
interface CalculatePriceResponse {
  success: boolean;
  data?: {
    basePrice: number;
    variantAdjustment: number;
    finalPrice: number;
  };
  error?: string;
}
```

**Behavior**:
- Obtiene el producto por ID
- Suma `price_adjustment` de las variantes seleccionadas
- Si variante no encontrada, ignora (ajuste = 0)
- Si JSONB inválido, retorna solo precio base

---

## Response Format

Todos los Server Actions retornan:
```typescript
{ success: boolean; data?: T; error?: string }
```

- `success: true` → `data` contiene el resultado
- `success: false` → `error` contiene mensaje en español

---

## Error Cases

| Error | Message |
|-------|---------|
| Producto no encontrado | "Producto no encontrado" |
| JSONB inválido | Se retorna array vacío sin error |
| Filtros inválidos | "Parámetros de filtro inválidos" |
| Error de BD | "Error al consultar productos" |
