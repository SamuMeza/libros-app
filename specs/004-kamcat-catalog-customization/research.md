# Research: Catálogo y Personalización KamCat

**Feature**: 004-kamcat-catalog-customization  
**Date**: 2026-08-27

---

## 1. JSONB Parsing Safety

**Decision**: Validar JSONB con interfaces TypeScript y fallback a valores por defecto

**Rationale**: Los campos `variants` y `customization_options` son JSONB en Supabase. La estructura puede ser inválida o estar vacía. Se necesita parsing seguro que nunca lance errores.

**Alternatives Considered**:
- `JSON.parse()` directo — Rechazado: lanza excepciones con JSON inválido
- Validación con zod — Rechazado: prohibido por AGENTS.md
- Validación manual con type guards — Seleccionado: más control, sin dependencias

**Pattern**:
```typescript
interface Variant {
  name: string;
  options: {
    label: string;
    price_adjustment: number;
    value: string;
    color_hex?: string;
  }[];
}

function safeParseVariants(jsonb: unknown): Variant[] {
  if (!Array.isArray(jsonb)) return [];
  return jsonb.filter(v => 
    typeof v === 'object' && 
    v !== null && 
    'name' in v && 
    'options' in v
  ) as Variant[];
}
```

---

## 2. Reactive Price Calculation

**Decision**: Calcular precio en el cliente usando estado local de React

**Rationale**: El precio se actualiza instantáneamente al seleccionar variantes. No necesita llamada al servidor — los precios de variantes están en el JSONB del producto.

**Alternatives Considered**:
- Server Action por cada cambio de variante — Rechazado: latencia innecesaria
- WebSocket para precios en tiempo real — Rechazado: complejidad excesiva para < 50 productos
- Cálculo local con `useMemo` — Seleccionado: reactivo, sin latencia

**Pattern**:
```typescript
const finalPrice = useMemo(() => {
  const base = product.price;
  const sizeAdjustment = selectedSize?.price_adjustment ?? 0;
  const colorAdjustment = selectedColor?.price_adjustment ?? 0;
  return base + sizeAdjustment + colorAdjustment;
}, [product.price, selectedSize, selectedColor]);
```

---

## 3. WCAG 2.1 AA Accessible Variant Selector

**Decision**: Usar `role="radio"` con `aria-checked` para chips, `aria-label` para colores

**Rationale**: Los chips de tamaño y círculos de color son selección única por tipo. `role="radio"` comunica esto a lectores de pantalla. Los colores hex necesitan `aria-label` con nombre legible.

**Alternatives Considered**:
- `role="button"` con `aria-pressed` — Rechazado: no comunica selección única
- `role="option"` con `aria-selected` — Rechazado: requiere contenedor `listbox`
- `role="radio"` con `role="radiogroup"` — Seleccionado: patrón estándar para selección única

**Pattern**:
```tsx
<div role="radiogroup" aria-label="Tamaño">
  {sizes.map(size => (
    <button
      key={size.value}
      role="radio"
      aria-checked={selectedSize === size.value}
      aria-label={`${size.label} — precio adicional $${size.price_adjustment}`}
    >
      {size.label}
    </button>
  ))}
</div>

<div role="radiogroup" aria-label="Color">
  {colors.map(color => (
    <button
      key={color.value}
      role="radio"
      aria-checked={selectedColor === color.value}
      aria-label={`Color: ${color.label}`}
      style={{ backgroundColor: color.color_hex }}
    />
  ))}
</div>
```

---

## 4. Supabase SSR with Next.js App Router

**Decision**: Usar `@supabase/ssr` con clientes server y client separados

**Rationale**: Next.js 16 App Router requiere manejo especial de cookies para autenticación. `@supabase/ssr` proporciona helpers para Server Components y Client Components.

**Alternatives Considered**:
- `@supabase/supabase-js` directo — Rechazado: no maneja cookies en SSR
- Client-side only con `createBrowserClient` — Rechazado: pierde SEO y performance
- `@supabase/ssr` con createServerClient/createBrowserClient — Seleccionado: soporte completo

**Pattern**:
```typescript
// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'

export async function createClient() {
  // ... server client setup
}

// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // ... browser client setup
}
```

---

## 5. Filter Sidebar with URL State

**Decision**: Sincronizar filtros con URL usando `useSearchParams` de Next.js

**Rationale**: Los filtros deben ser compartibles via URL (criterio de aceptación). `useSearchParams` permite leer/escribir parámetros de URL de forma reactiva.

**Alternatives Considered**:
- Estado local con `useState` — Rechazado: no es compartible via URL
- Zustand para filtros — Rechazado: complejidad innecesaria para filtros simples
- `useSearchParams` de Next.js — Seleccionado: nativo, compartible, reactivo

**Pattern**:
```typescript
const [searchParams, setSearchParams] = useSearchParams()

const selectedCategories = searchParams.getAll('category')

function toggleCategory(categoryId: string) {
  const params = new URLSearchParams(searchParams)
  // ... toggle logic
  setSearchParams(params)
}
```

---

## 6. Debounced Search

**Decision**: Implementar debounce manual con `setTimeout`/`clearTimeout`

**Rationale**: Búsqueda en tiempo real con máximo 500ms de espera. No se necesita librería externa para un debounce simple.

**Alternatives Considered**:
- `lodash.debounce` — Rechazado: dependencia innecesaria
- `useDeferredValue` de React — Rechazado: no controla el timing exacto
- Debounce manual con hooks — Seleccionado: sin dependencias, control total

**Pattern**:
```typescript
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  
  return debouncedValue
}
```

---

## Summary

| Decision | Choice | Risk |
|----------|--------|------|
| JSONB parsing | Type guards manuales | Bajo |
| Price calculation | useMemo local | Bajo |
| Accessible variants | role="radio" + aria-label | Bajo |
| Supabase SSR | @supabase/ssr | Bajo |
| URL state | useSearchParams | Bajo |
| Debounce | Manual hook | Bajo |

All decisions follow project conventions (no zod, no external deps, TypeScript estricto). No NEEDS CLARIFICATION items remain.
