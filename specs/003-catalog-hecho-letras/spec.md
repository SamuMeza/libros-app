# Especificación: Catálogo y Detalle de Libros (Hecho Letras)

**Feature:** 003-catalog-hecho-letras  
**Fecha:** 2026-08-26  
**Estado:** borrador  

---

## 1. Resumen

Implementar el módulo de catálogo y detalle de libros para la marca Hecho Letras. Incluye una página de catálogo con filtros, búsqueda por texto completo, ordenamiento y paginación; una página de detalle con galería de imágenes, módulo de extras KamCat para upsell, selector de cantidad y secciones informativas; un formulario de solicitud de libros no catalogados; y Server Actions para consulta y filtrado de datos.

---

## 2. Contexto y Motivo

Hecho Letras es la marca de libros de la plataforma, ofreciendo títulos por encargo y en stock. Los usuarios necesitan:
- Explorar el catálogo de libros filtrando por género, precio y disponibilidad
- Buscar libros por título o autor de forma rápida
- Ver detalles completos de cada libro (sinopsis, ficha técnica, precio, tiempo de entrega)
- Agregar accesorios complementarios de KamCat (marcapáginas, stickers, lámparas) al comprar un libro
- Solicitar libros que no se encuentren en el catálogo

---

## 3. Requerimientos Funcionales

### 3.1 Página de Catálogo (`/libros`)

**Ruta:** `src/app/(shop)/libros/page.tsx`

**Sidebar de Filtros:**
- Filtro por Categorías/Género: checkboxes con recuento de libros por categoría
- Filtro por Rango de Precios: controles numéricos min/max
- Filtro por Disponibilidad: opciones "En stock" (`stock_status = 'in_stock'`) y "Por encargo" (`stock_status = 'on_demand'`). Solo se muestran libros con `status` en `('available', 'pre_order')` — los `out_of_stock` se ocultan del catálogo
- Sidebar sticky con top `6rem`, ancho fijo `280px` en desktop; drawer colapsable en mobile

**Búsqueda:**
- Campo de búsqueda por título o autor
- Búsqueda en tiempo real con debounce (máximo 500ms de espera)
- Soporte de PostgreSQL Full-Text Search

**Ordenamiento:**
- Selector con opciones: Relevancia, Precio (menor a mayor), Precio (mayor a menor), Novedades, A-Z

**Grid de Resultados:**
- 4 columnas en desktop, 3 en tablet, 2 en mobile
- Gap `space-6` entre cards
- Cards con imagen de portada, título, autor, precio y badge de disponibilidad

**Paginación:**
- Botones cuadrados (`40px`) con estado activo en `--hl-primary`
- Mostrar total de resultados: "Mostrando X de Y resultados"

**Criterios de Aceptación:**
- [ ] El sidebar de filtros muestra categorías con recuento de libros
- [ ] Los filtros se aplican combinadamente (AND entre categorías, OR dentro de la misma)
- [ ] La búsqueda retorna resultados en menos de 500ms
- [ ] La búsqueda es insensible a mayúsculas/minúsculas y tildes
- [ ] Los filtros de precio filtran por rango inclusivo
- [ ] El filtro de disponibilidad distingue "en stock" vs "por encargo"
- [ ] El ordenamiento funciona correctamente en todas las opciones
- [ ] La paginación muestra 24 libros por página
- [ ] Los resultados vacímos muestran un mensaje amigable con sugerencia
- [ ] El sidebar es colapsable en mobile con botón de toggle
- [ ] Los parámetros de filtros se reflejan en la URL (compartible)
- [ ] El estado de carga muestra skeleton cards consistentes con el layout final
- [ ] El sistema muestra un skeleton loader de 24 cards durante la carga inicial

### 3.2 Página de Detalle de Libro (`/libros/[slug]`)

**Ruta:** `src/app/(shop)/libros/[slug]/page.tsx`

**Server Component con SEO:**
- Generación dinámica de metadata (título, descripción, imagen Open Graph)
- Breadcrumb accesible: Inicio > Libros > [Categoría] > [Título]

**Columna Izquierda — Galería de Imágenes:**
- Imagen principal con ratio `2:3`, radio `radius-xl`, sombra `shadow-lg`
- Galería inferior de miniaturas (`80px`) con borde activo en `--hl-primary`
- Transición de imagen: `transition-all duration-200 ease-in-out` (200ms)
- Las imágenes se obtienen del campo `images TEXT[]` de la tabla `books` (primera imagen = portada)

**Columna Derecha — Información:**
- Badge de marca: "Hecho Letras"
- Título con token `H1` en Playfair Display
- Autor con token `Body` en `--text-secondary`
- Precio con token `H2` en `--hl-accent`
- Badge de disponibilidad: "EN STOCK" (`--success`) o "POR ENCARGO: ~X días hábiles" (`--warning`)

**Sinopsis y Ficha Técnica:**
- Sinopsis descriptiva en max-width `65ch`
- Ficha técnica: Editorial, Páginas, Idioma, Encuadernación, Tiempo estimado de entrega

**Módulo de Extras KamCat ("Hazlo especial ✨"):**
- Lista de accesorios complementarios fabricados por KamCat
- Cada extra muestra: nombre, precio adicional, checkbox para agregar
- Extras por defecto pre-seleccionados según configuración en `book_extras`
- Accesorios típicos: Marcapáginas laminado, Stickers temáticos, Lámpara de lectura LED

**Selector de Cantidad:**
- Control `-` `1` `+` con límite máximo de 10 unidades
- Valor numérico editable directamente

**Botón de Agregar al Carrito:**
- Botón principal "Agregar al carrito" con icono `ShoppingCart`
- Envía: libro seleccionado, cantidad, extras seleccionados

**Acordeones Informativos:**
- Contenido hardcodeado en el componente (no se consulta desde BD)
- Política de envíos (MRW / Zoom): tiempos, costos, cobertura
- Métodos de pago: Pago Móvil, Binance USDT, Plan de Pagos a Plazos
- Información del Plan de Cuotas: desglose de 2 a 4 cuotas quincenales

**Criterios de Aceptación:**
- [ ] El metadata dinámico genera título, descripción e imagen Open Graph correctos
- [ ] El breadcrumb refleja la jerarquía correcta (Inicio > Libros > Categoría > Título)
- [ ] La galería muestra la imagen principal en ratio `2:3`
- [ ] Las miniaturas permiten cambiar la imagen principal con `transition-all duration-200 ease-in-out`
- [ ] El badge de disponibilidad muestra el estado correcto del libro
- [ ] El tiempo estimado de entrega se muestra según el `delivery_days` del libro
- [ ] El módulo de extras muestra solo los extras configurados para ese libro
- [ ] Los extras pre-seleccionados se marcan según `is_default` en `book_extras`
- [ ] El selector de cantidad no permite valores menores a 1 ni mayores a 10
- [ ] Los acordeones se abren/cierran con `transition-all duration-200 ease-in-out`
- [ ] La información de envío, pago y cuotas se muestra correctamente
- [ ] La página es accesible por teclado (navegación entre miniaturas, acordeones)
- [ ] El botón "Agregar al carrito" está deshabilitado si el libro está agotado

### 3.3 Formulario de Solicitud de Libros No Catalogados

**Ubicación:** Sección al final de la página de catálogo `/libros` (después de los resultados y paginación)

**Accesibilidad:** Accesible para todos los usuarios (autenticados y anónimos). Los usuarios autenticados tienen sus datos prellenados del perfil; los anónimos completan nombre, email y teléfono manualmente.

**Campos:**
- Título del libro (obligatorio)
- Autor (opcional)
- Nombre del solicitante (obligatorio)
- Email de contacto (obligatorio)
- Teléfono/WhatsApp (opcional)
- Mensaje adicional (opcional, máximo 500 caracteres)

**Criterios de Aceptación:**
- [ ] El formulario valida campos obligatorios antes de enviar
- [ ] El email se valida con formato correcto
- [ ] El mensaje tiene un límite de 500 caracteres con contador visible
- [ ] El envío exitoso muestra un mensaje de confirmación
- [ ] Los errores de envío muestran mensajes descriptivos en español
- [ ] El formulario se resetea después de un envío exitoso
- [ ] Los datos se almacenan en la tabla `contact_requests` con estado `pending`

### 3.4 Server Actions de Libros

**Ubicación:** `src/lib/actions/` (un archivo por Server Action, cada uno con `export default`)

**Acciones:**
- `getBooks(filters)` — Consulta libros con filtros, búsqueda, ordenamiento y paginación
- `getBookBySlug(slug)` — Obtiene un libro por su slug con categoría y extras
- `getBookExtras(bookId)` — Obtiene los extras configurados para un libro
- `submitBookRequest(data)` — Registra una solicitud de libro no catalogado

**Parámetros de `getBooks`:**
- `categoryIds`: UUID[] — Filtro por categorías (OR dentro del grupo)
- `minPrice`, `maxPrice`: number — Rango de precios
- `availability`: 'in_stock' | 'on_demand' | 'all' — Filtro de disponibilidad
- `search`: string — Búsqueda por título o autor (Full-Text Search)
- `sort`: 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'alpha' — Ordenamiento
- `page`: number — Número de página (default: 1)
- `pageSize`: number — Elementos por página (default: 24)

**Criterios de Aceptación:**
- [ ] `getBooks` retorna libros activos con paginación correcta
- [ ] `getBooks` combina filtros correctamente (AND entre grupos, OR dentro)
- [ ] `getBooks` soporta búsqueda Full-Text Search en español
- [ ] `getBooks` retorna el total de resultados para paginación
- [ ] `getBookBySlug` retorna el libro con su categoría y extras asociados
- [ ] `getBookBySlug` retorna `null` si el slug no existe o el libro no está activo
- [ ] `getBookExtras` retorna los extras ordenados por `sort_order`
- [ ] `submitBookRequest` valida campos obligatorios antes de insertar
- [ ] `submitBookRequest` asocia el `user_id` si el usuario está autenticado
- [ ] Todos los Server Actions usan `export default` en archivos separados
- [ ] Las respuestas siguen el formato estándar `{ success: boolean; data?: T; error?: string }`

---

## 4. Criterios de Éxito

### Cuantitativos
- Búsqueda retorna resultados en < 500ms
- Página de catálogo carga en < 2 segundos
- Página de detalle carga en < 1.5 segundos
- Paginación responde en < 300ms

### Cualitativos
- Los usuarios pueden encontrar libros usando filtros y búsqueda sin frustración
- La información del libro es clara y completa para tomar una decisión de compra
- El módulo de extras facilita el descubrimiento de productos complementarios
- El formulario de solicitud es intuitivo y no requiere instrucciones adicionales

---

## 5. Supuestos

1. Los libros tienen slugs únicos generados a partir del título
2. Las categorías de HL están predefinidas en la tabla `categories` con `brand = 'hl'`
3. La búsqueda Full-Text Search usa el idioma español de PostgreSQL
4. Los extras de KamCat están configurados en la tabla `book_extras` por los administradores
5. Las imágenes de portada están almacenadas en Cloudinary
6. El max-width del contenedor principal es `1200px` según el design system

---

## 6. Dependencias

- **Interno:** Feature 001 (Layout Base y Sistema de Diseño) — tokens CSS y componentes UI
- **Interno:** Feature 002 (Auth y Perfiles) — para formulario de solicitud asociado a usuario
- **Externo:** Supabase PostgreSQL — tablas books, categories, book_extras, contact_requests

---

## 7. Fuera de Alcance

- Gestión administrativa de libros (CRUD, uploads) — Feature 006
- Agregar al carrito y checkout — Feature 004
- Sistema de favoritos — Feature futura
- Comparación de libros — Feature futura
- Reseñas y calificaciones de usuarios — Feature futura
- Recomendaciones personalizadas basadas en historial — Feature futura

---

## Entidades Clave

| Entidad | Tabla | Campos Clave | RLS |
|---------|-------|--------------|-----|
| Libro | `books` | id, title, author, description, price, images (TEXT[]), slug (UNIQUE), category_id, status, stock_status, delivery_days, editorial, pages, language, binding, is_featured, is_active | Lectura pública |
| Categoría | `categories` | id, name, slug, brand (hl/kc), description, image_url, sort_order, is_active | Lectura pública |
| Extra de Libro | `book_extras` | id, book_id (FK), product_id (FK), is_default, sort_order | Lectura pública |
| Solicitud | `contact_requests` | id, user_id (FK, nullable), book_title, book_author, email, phone, message, status (pending/contacted/resolved) | INSERT: cualquier usuario; SELECT: propio o superadmin; UPDATE: superadmin |

---

**Fin de la Especificación**

---

## Clarifications

### Session 2026-08-26
- Q: ¿Cómo se almacenan las múltiples imágenes de un libro si la tabla `books` solo tiene un campo `cover_image`? → A: Cambiar `cover_image TEXT` a `images TEXT[]` en la tabla `books`. La primera imagen del array se usa como portada en el catálogo; todas se muestran en la galería de detalle.
- Q: La tabla `books` tiene 3 estados (`available`, `pre_order`, `out_of_stock`) pero la UI solo muestra 2 opciones de filtro. ¿Cómo se mapean? → A: Filtro de UI usa `stock_status` ('in_stock'/'on_demand'); el campo `status` controla visibilidad (`available`/`pre_order` = visible en catálogo, `out_of_stock` = oculto).
- Q: El formulario de solicitud de libros no catalogados — ¿debe requerir login o puede ser anónimo? → A: Ambos: usuarios autenticados envían con datos prellenados del perfil; usuarios anónimos completan nombre, email y teléfono manualmente.
- Q: ¿Dónde debe ubicarse el formulario de solicitud de libros no catalogados? → A: Sección al final de la página de catálogo `/libros` (después de los resultados y paginación).
- Q: La tabla `books` no tiene campo `slug` pero el spec asume slugs únicos. ¿Cómo se resuelve? → A: Agregar `slug TEXT UNIQUE NOT NULL` a la tabla `books` con índice. Generado a partir del título con normalización (lowercase, sin tildes, guiones).
- Q: ¿De dónde sale el contenido de los acordeones informativos (envío, pago, cuotas)? → A: Contenido hardcodeado en el componente `book-accordions.tsx`. No se consulta desde BD ni CMS.
