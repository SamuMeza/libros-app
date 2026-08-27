# Quickstart: Catálogo y Personalización KamCat

**Feature**: 004-kamcat-catalog-customization  
**Date**: 2026-08-27

---

## Prerequisites

- Node.js 18+ o Bun 1.3+
- Supabase project con tablas `products` y `categories`
- Variables de entorno configuradas (`.env.local`):
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Validation Scenarios

### 1. Catálogo con Filtros

**Setup**: Insertar 5 productos KamCat en 2 categorías diferentes

**Steps**:
1. Navegar a `/kamcat`
2. Verificar que se muestran los 5 productos
3. Seleccionar una categoría en el sidebar
4. Verificar que solo se muestran productos de esa categoría
5. Verificar que el contador de resultados se actualiza

**Expected**: Grid muestra productos filtrados, "Mostrando X de Y resultados" se actualiza

---

### 2. Búsqueda de Productos

**Setup**: Insertar productos con nombres variados

**Steps**:
1. Navegar a `/kamcat`
2. Escribir "sticker" en el campo de búsqueda
3. Esperar 500ms (debounce)
4. Verificar que solo se muestran productos con "sticker" en el nombre

**Expected**: Resultados se filtran en tiempo real, búsqueda case-insensitive

---

### 3. Detalle de Producto con Variantes

**Setup**: Insertar producto con variantes de tamaño y color

**Steps**:
1. Navegar a `/kamcat/[slug]`
2. Verificar que se muestra el precio base
3. Seleccionar tamaño "Mediano" (con ajuste de +$2)
4. Verificar que el precio se actualiza a base + $2
5. Seleccionar color "Rojo" (sin ajuste)
6. Verificar que el precio se mantiene

**Expected**: Precio se recalcula instantáneamente, desglose visible

---

### 4. Personalización de Producto

**Setup**: Insertar producto con `customization_options`

**Steps**:
1. Navegar a `/kamcat/[slug]`
2. Verificar que aparece el campo de texto personalizado
3. Escribir "María" (5 caracteres)
4. Verificar que el contador muestra "5/50"
5. Intentar escribir más de 50 caracteres
6. Verificar que no se permite exceder el límite

**Expected**: Campo aparece solo si hay customization_options, contador funciona

---

### 5. Agregar al Carrito sin Variantes

**Setup**: Insertar producto sin variantes ni personalización

**Steps**:
1. Navegar a `/kamcat/[slug]`
2. Verificar que el botón "Agregar al carrito" está habilitado
3. Hacer clic en el botón
4. Verificar que el producto se agrega al carrito

**Expected**: Producto se agrega sin opciones adicionales

---

### 6. Accesibilidad por Teclado

**Setup**: Navegador con soporte de lectores de pantalla

**Steps**:
1. Navegar a `/kamcat`
2. Usar Tab para navegar entre filtros
3. Usar Enter/Espacio para seleccionar categorías
4. Navegar a un producto y presionar Enter
5. En detalle, usar Tab para navegar variantes
6. Usar flechas para seleccionar entre chips de tamaño

**Expected**: Navegación completa por teclado, aria-labels correctos

---

### 7. Error de Cálculo de Precio

**Setup**: Insertar producto con variante de precio inválido

**Steps**:
1. Navegar a `/kamcat/[slug]`
2. Seleccionar variante con precio inválido
3. Verificar que se muestra el precio base
4. Verificar que aparece el mensaje "Precio final se confirmará al agregar al carrito"
5. Verificar que el botón "Agregar al carrito" sigue habilitado

**Expected**: Error se maneja graceful, compra no se bloquea

---

## Run Commands

```bash
# Instalar dependencias
bun install

# Iniciar servidor de desarrollo
bun run dev

# Ejecutar tests unitarios
bun run test

# Ejecutar lint
bun run lint

# Ejecutar typecheck
bun run typecheck
```

---

## Key Files to Verify

| File | Purpose |
|------|---------|
| `src/app/(shop)/kamcat/page.tsx` | Catálogo KamCat |
| `src/app/(shop)/kamcat/[slug]/page.tsx` | Detalle de producto |
| `src/components/products/variant-selector.tsx` | Selector de variantes |
| `src/components/products/customization-form.tsx` | Formulario de personalización |
| `src/components/products/price-display.tsx` | Precio reactivo |
| `src/lib/actions/products.ts` | Server Actions |
| `src/types/product.ts` | Interfaces TypeScript |
