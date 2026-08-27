# Research: Catálogo y Detalle de Libros (Hecho Letras)

**Feature:** 003-catalog-hecho-letras  
**Fecha:** 2026-08-26

---

## 1. Full-Text Search en PostgreSQL

**Decisión**: Usar `to_tsvector('spanish', ...)` con `@@` y `ts_rank` para búsqueda por título y autor.

**Razón**: PostgreSQL ya tiene un índice GIN configurado en DATABASE.md:
```sql
CREATE INDEX idx_books_search ON books 
  USING gin(to_tsvector('spanish', title || ' ' || author || ' ' || COALESCE(description, '')));
```
El filtro usa `plainto_tsquery('spanish', ...)` para queries de usuario.

**Implementación**:
- Búsqueda insensible a mayúsculas/minúsculas y tildes (PostgreSQL FTS maneja esto con configuración `spanish`)
- Para sort por "Relevancia": usar `ts_rank(tsvector, tsquery)` como criterio de ordenamiento
- Fallback: si no hay resultados con FTS, usar búsqueda LIKE simple como backup

**Alternativas consideradas**:
- `pg_trgm` (trigram similarity): Más potente pero requiere extensión adicional; FTS es suficiente para búsqueda de libros
- Buscar en el cliente: No escalable para catálogos grandes

---

## 2. Generación de Slugs

**Decisión**: Generar slugs a partir del título con normalización: lowercase, sin tildes, espacios a guiones, caracteres especiales removidos.

**Razón**: Consistente con el patrón de `categories.slug` en la base de datos. El campo `slug TEXT UNIQUE NOT NULL` fue confirmado en clarificaciones.

**Implementación**:
- Función `generateSlug(title: string): string` en `src/lib/utils/slug-helpers.ts`
- Normalización: `title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')`
- Manejo de colisiones: si el slug ya existe, agregar sufijo numérico (`-1`, `-2`, etc.)
- Esta función se usará en Feature 006 (CRUD admin) al crear/editar libros

**Alternativas consideradas**:
- Usar UUID en URLs: Menos SEO-friendly, peor UX
- Usar solo título sin normalizar: URLs con caracteres especiales, inconsistencias

---

## 3. Filtrado Combinado de Libros

**Decisión**: Implementar filtro AND entre grupos (categorías + precio + disponibilidad) y OR dentro del mismo grupo (múltiples categorías seleccionadas).

**Razón**: Es el estándar de e-commerce. Los usuarios esperan ver menos resultados al agregar filtros (AND entre grupos) pero más al seleccionar múltiples opciones del mismo tipo (OR dentro).

**Implementación**:
- Construir query Supabase dinámicamente con `.or()` para categorías, `.gte()/.lte()` para precio, `.eq()` para disponibilidad
- Combinar con filtro de FTS cuando hay término de búsqueda
- Contar total de resultados antes de paginar para mostrar "Mostrando X de Y"

---

## 4. Imágenes de Libros (Cloudinary)

**Decisión**: Las URLs de Cloudinary se almacenan como `TEXT[]` en el campo `images`. La primera imagen del array es la portada.

**Razón**: Consistente con cómo KamCat maneja imágenes de productos (`products.images TEXT[]`). Cloudinary proporciona URLs públicas que no requieren autenticación.

**Implementación**:
- El catálogo usa solo la primera imagen (`images[1]` en SQL, `images[0]` en JS) como portada
- La galería de detalle muestra todas las imágenes del array
- Las URLs deben incluir transformaciones de Cloudinary para optimizar tamaño (w_400 para thumbnails, w_800 para principal)

---

## 5. Filtros en URL (Shareability)

**Decisión**: Serializar parámetros de filtros en query params de la URL.

**Razón**: Permite compartir resultados filtrados, mantener estado al navegar, y soporte de botón "atrás" del navegador.

**Implementación**:
- Parámetros soportados: `?category=uuid1,uuid2&minPrice=10&maxPrice=50&availability=in_stock&sort=price_asc&page=2&q=terror`
- El Server Component lee `searchParams` de la URL
- El Client Component actualiza la URL con `useRouter` + `useSearchParams`

---

## 6. Skeleton Loaders

**Decisión**: Mostrar skeletons durante la carga inicial de la página y al cambiar filtros/paginación.

**Razón**: Mejora la percepción de rendimiento (spec §3.1 requiere skeleton cards).

**Implementación**:
- Skeleton de 24 cards (6 filas x 4 columnas) para carga inicial
- Skeleton de resultado actual para cambio de filtros
- Componente `skeleton-book-card.tsx` que replica la estructura de `book-card.tsx` con animación pulse

---

## 7. Acordeones Informativos

**Decisión**: Contenido estático hardcodeado en componentes, no consultado desde base de datos.

**Razón**: La información de envío, pago y cuotas es fija y no cambia frecuentemente. No justifica una tabla dedicada.

**Implementación**:
- Tres acordeones: Envíos (MRW/Zoom), Métodos de pago, Plan de cuotas
- Contenido basado en la constitución §9 y los mockups §3.5
- Componente reutilizable de acordeón base en `src/components/ui/accordion.tsx`

---

## 8. Módulo de Extras KamCat (Cross-sell)

**Decisión**: Los extras se consultan desde `book_extras` (JOIN con `products`) y se muestran como checkboxes con precio adicional.

**Razón**: La tabla `book_extras` ya define la relación libro-producto con `is_default` y `sort_order`.

**Implementación**:
- `getBookExtras(bookId)` retorna los extras con datos del producto (nombre, precio, imagen)
- Los extras con `is_default = TRUE` se pre-seleccionan en el UI
- El precio total se calcula: `(libro.precio * cantidad) + sum(extras seleccionados * cantidad)`
- La integración con el carrito es responsabilidad de Feature 004

---

## 9. Formulario de Solicitud (Anónimos vs Autenticados)

**Decisión**: El formulario detecta si hay sesión activa y pre-llena datos del perfil. Los anónimos completan manualmente.

**Razón**: Confirmado en Q3 de clarificaciones. Maximiza la tasa de solicitudes.

**Implementación**:
- En el Server Component, verificar si hay sesión con `getUser()` de Supabase
- Si autenticado: pre-llenar `nombre`, `email`, `telefono` desde `profiles`
- Si anónimo: campos vacíos con validación de obligatorios
- El campo `user_id` en `contact_requests` se llena solo si hay sesión

---

## 10. SEO y Metadata Dinámico

**Decisión**: Usar `generateMetadata` de Next.js para generar título, descripción e imagen Open Graph dinámicamente.

**Razón**: Next.js App Router soporta `generateMetadata` en Server Components para SEO.

**Implementación**:
- `generateMetadata({ params })` consulta el libro por slug
- Título: `${libro.title} — Hecho Letras`
- Descripción: Primera oración de la sinopsis (max 160 caracteres)
- Open Graph: imagen principal del libro, título, descripción
- Si el libro no existe:返回 metadata de error 404
