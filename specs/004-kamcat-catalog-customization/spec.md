# Especificación: Catálogo y Personalización de Productos KamCat

**Feature:** 004-kamcat-catalog-customization  
**Fecha:** 2026-08-27  
**Estado:** borrador  

---

## 1. Resumen

Implementar el módulo de catálogo y detalle de productos KamCat con soporte completo de personalización. Incluye una página de catálogo con filtros por categoría, una página de detalle con selector interactivo de variantes (tamaño y color), formulario de personalización con contador de caracteres, cálculo reactivo del precio final (base + variantes), y Server Actions para consulta segura de datos JSONB.

---

## 2. Contexto y Motivo

KamCat es la marca de papelería creativa y personalizada de la plataforma. A diferencia de Hecho Letras (libros), KamCat ofrece productos que los usuarios pueden customizar: stickers con nombres, photocards con frases, posters personalizados, llaveros con diseños, pins, polaroids, etc.

Los usuarios necesitan:
- Explorar productos KamCat filtrando por tipo/categoría
- Ver detalles de cada producto incluyendo variantes disponibles (tamaños, colores)
- Personalizar productos con texto propio (nombres, frases, instrucciones de diseño)
- Ver el precio final actualizado en tiempo real según las opciones seleccionadas
- Agregar productos personalizados al carrito con todas las opciones conservadas

---

## 3. Requerimientos Funcionales

### 3.1 Página de Catálogo KamCat (`/kamcat`)

**Ruta:** `src/app/(shop)/kamcat/page.tsx`

**Identidad Visual:**
- Paleta de colores adaptada a KamCat: acentos en `--kc-primary` / `--kc-accent`
- Tokens de marca consistentes con el design system
- **Accesibilidad WCAG 2.1 AA:** contraste mínimo 4.5:1 para texto, 3:1 para gráficos grandes

**Sidebar de Filtros:**
- Filtro por Categorías de Producto: checkboxes con recuento de productos por categoría
- Categorías típicas: Stickers, Photocards, Posters, Llaveros, Pins, Polaroids
- Sidebar sticky con top `6rem`, ancho fijo `280px` en desktop; drawer overlay en mobile con animación de deslizamiento desde la izquierda
- Los filtros se aplican combinadamente (AND entre categorías, OR dentro de la misma)
- **Accesibilidad:** cada checkbox tiene `<label>` asociado, el drawer mobile tiene botón de toggle con `aria-expanded`, navegación por teclado completa

**Grid de Resultados:**
- 4 columnas en desktop, 3 en tablet, 2 en mobile
- Gap `space-6` entre cards
- Cards con: imagen principal, nombre del producto, precio base, badge de personalización y categoría
- El badge de personalización indica si el producto admite customización

**Selector de Ordenamiento:**
- Selector con opciones: Relevancia (por defecto: orden alfabético), Precio (menor a mayor), Precio (mayor a menor), Novedades, A-Z

**Paginación:**
- Botones cuadrados (`40px`) con estado activo en `--kc-primary`
- Mostrar total de resultados: "Mostrando X de Y resultados"
- 24 productos por página

**Búsqueda:**
- Campo de búsqueda por nombre de producto
- Búsqueda en tiempo real con debounce de 100ms, tiempo de respuesta máximo 500ms

**Criterios de Aceptación:**
- [ ] El sidebar de filtros muestra categorías de KamCat con recuento de productos
- [ ] Los filtros se aplican combinadamente (AND entre categorías, OR dentro de la misma)
- [ ] La búsqueda retorna resultados en menos de 500ms
- [ ] La búsqueda es insensible a mayúsculas/minúsculas y tildes
- [ ] El grid muestra 4 columnas en desktop, 3 en tablet, 2 en mobile
- [ ] La paginación muestra 24 productos por página
- [ ] Los resultados vacíos muestran un mensaje amigable con sugerencia
- [ ] El sidebar es colapsable en mobile con botón de toggle
- [ ] Los parámetros de filtros se reflejan en la URL (compartible)
- [ ] El estado de carga muestra skeleton cards consistentes con el layout final
- [ ] Los acentos de color usan `--kc-primary` y `--kc-accent` consistentemente
- [ ] Las cards muestran: imagen, nombre, precio base, badge de personalización y categoría

### 3.2 Página de Detalle de Producto KamCat (`/kamcat/[slug]`)

**Ruta:** `src/app/(shop)/kamcat/[slug]/page.tsx`

**Server Component con SEO:**
- Generación dinámica de metadata (título, descripción, imagen Open Graph)
- Breadcrumb accesible: Inicio > KamCat > [Categoría] > [Nombre del Producto]

**Columna Izquierda — Galería de Imágenes:**
- Imagen principal con ratio `2:3`, radio `radius-xl`, sombra `shadow-lg`
- Galería inferior de miniaturas (`80px`) con borde activo en `--kc-primary`
- Transición de imagen: suave y perceptible (aproximadamente 200ms)
- Las imágenes se obtienen del campo `images TEXT[]` de la tabla `products`
- **Accesibilidad:** cada imagen tiene `alt` descriptivo, miniaturas son botones con `aria-label`, navegación por teclado entre miniaturas

**Columna Derecha — Información:**
- Badge de marca: "KamCat" (`bg --kc-primary/10`, `text --kc-primary`)
- Nombre del producto con token `H1`
- Descripción del producto con token `Body` en `--text-secondary`
- Precio base con token `H2` en `--kc-accent`
- Badge de personalización: "Personalizable" (`bg --kc-accent/10`, `text --kc-accent`, `text-xs`, `px-2 py-0.5 rounded-full`) o "Producto Estándar" (`bg --text-muted/10`, `text --text-muted`, `text-xs`, `px-2 py-0.5 rounded-full`)

**Selector Interactivo de Variantes:**
- **Chips de Tamaño:** Botones tipo chip para selección de tamaño (Pequeño, Mediano, Grande)
- Cada chip muestra el nombre del tamaño y el precio adicional si aplica
- El chip seleccionado se resalta con `--kc-primary`
- **Círculos de Color:** Círculos cromáticos para selección de color
- Cada círculo muestra el color visualmente usando `background-color` con el valor hex del JSONB
- El color seleccionado se indica con borde `2px solid --kc-primary`
- Las variantes se obtienen del campo `variants JSONB` del producto
- **Accesibilidad:** chips usan `role="radio"` y `aria-checked`, círculos de color tienen `aria-label` con nombre del color, navegación por teclado con flechas

**Formulario de Personalización:**
- **Campo de Texto:** Input para texto personalizado (nombre, frase, instrucción) con `<label>` visible
- **Contador de Caracteres:** Indicador visual `0/50` que actualiza en tiempo real, vinculado con `aria-describedby`
- **Límite de Caracteres:** Máximo 50 caracteres (configurable por producto), validación con `aria-invalid`
- **Campo de Texto Habilitado Solo:** Cuando el producto tiene `customization_options JSONB` configurado
- Las opciones de personalización se obtienen del campo `customization_options` del producto
- **Almacenamiento:** El texto se almacena tal cual en la BD, se muestra al usuario en su historial de pedidos y al admin en el panel de gestión. **Nota de seguridad:** El texto se renderiza como texto plano en la UI (no como HTML) para prevenir XSS

**Cálculo Reactivo del Precio Final:**
- Precio final = Precio base + Precio variante tamaño + Precio variante color
- El precio se actualiza instantáneamente al seleccionar variantes
- Formato: `$XX.XX` con separador de miles si aplica
- Animación sutil de transición en el cambio de precio
- **Manejo de errores:** Si el cálculo falla, mostrar el precio base con el mensaje "Precio final se confirmará al agregar al carrito" en texto secundario (`--text-muted`) con icono de información. No bloquear la compra.

**Botón de Agregar al Carrito:**
- Botón principal "Agregar al carrito" con acento `--kc-primary` e icono `ShoppingCart`
- Envía: producto seleccionado, variante tamaño (opcional), variante color (opcional), personalización (opcional)
- El botón **siempre está habilitado** — las variantes y la personalización son opcionales
- Si el usuario no selecciona variantes ni escribe personalización, el producto se agrega al carrito sin opciones adicionales

**Criterios de Aceptación:**
- [ ] El metadata dinámico genera título, descripción e imagen Open Graph correctos
- [ ] El breadcrumb refleja la jerarquía correcta (Inicio > KamCat > Categoría > Nombre)
- [ ] La galería muestra la imagen principal en ratio `2:3`
- [ ] Las miniaturas permiten cambiar la imagen principal con transición suave
- [ ] Los chips de tamaño muestran el nombre y precio adicional de cada variante
- [ ] Los círculos de color muestran visualmente cada color disponible
- [ ] Solo se puede seleccionar un tamaño y un color a la vez
- [ ] El campo de personalización aparece solo cuando el producto tiene `customization_options`
- [ ] El contador de caracteres se actualiza en tiempo real
- [ ] El límite de caracteres se respeta (no permite exceder el máximo)
- [ ] El precio final se recalcula instantáneamente al cambiar variantes
- [ ] El precio muestra el desglose: base + variante(s) = total
- [ ] El botón "Agregar al carrito" **siempre está habilitado** (las variantes y personalización son opcionales)
- [ ] Si el usuario no selecciona variantes ni escribe personalización, el producto se agrega al carrito sin opciones
- [ ] La información de envío y pago se muestra correctamente
- [ ] La página es accesible por teclado (navegación entre variantes, campo de texto)
- [ ] La página de detalle muestra: múltiples imágenes, nombre, precio, descripción y opciones de personalización

### 3.3 Server Actions de Productos KamCat

**Ubicación:** `src/lib/actions/products.ts`

**Acciones:**
- `getProducts(filters)` — Consulta productos con filtros, búsqueda, ordenamiento y paginación
- `getProductBySlug(slug)` — Obtiene un producto por su slug con categoría, variantes y opciones de personalización
- `getProductCategories()` — Obtiene las categorías de KamCat con recuento de productos
- `calculateProductPrice(productId, selectedVariants)` — Calcula el precio final base + variantes seleccionadas

**Parámetros de `getProducts`:**
- `categoryIds`: UUID[] — Filtro por categorías (OR dentro del grupo)
- `minPrice`, `maxPrice`: number — Rango de precios
- `search`: string — Búsqueda por nombre de producto
- `sort`: 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'alpha' — Ordenamiento (relevance = orden alfabético por defecto)
- `page`: number — Número de página (default: 1)
- `pageSize`: number — Elementos por página (default: 24)

**Manejo Seguro de JSONB:**
- Los campos `variants` y `customization_options` son JSONB en la tabla `products`
- Las Server Actions deben validar y parsear el JSONB de forma segura
- Usar validación de tipos (TypeScript interfaces) para los datos parseados
- Manejar casos donde el JSONB sea inválido o esté vacío (retornar arrays vacíos `[]`)
- Nunca confiar en la estructura del JSONB sin validar previamente

**Parámetros de `calculateProductPrice`:**
- `productId`: UUID — Identificador del producto
- `selectedVariants`: `{ size?: string; color?: string }` — Variantes seleccionadas
- Retorna: `{ basePrice: number; variantAdjustment: number; finalPrice: number }`

**Criterios de Aceptación:**
- [ ] `getProducts` retorna productos activos con paginación correcta
- [ ] `getProducts` combina filtros correctamente (AND entre grupos, OR dentro)
- [ ] `getProducts` retorna el total de resultados para paginación
- [ ] `getProductBySlug` retorna el producto con categoría, variantes y opciones de personalización
- [ ] `getProductBySlug` retorna `null` si el slug no existe o el producto no está activo
- [ ] `getProductCategories` retorna solo categorías de KamCat (`brand = 'kc'`) con recuento
- [ ] `calculateProductPrice` suma correctamente base + variantes
- [ ] `calculateProductPrice` maneja variantes no encontradas (retorna solo precio base)
- [ ] Todos los JSONB se parsean de forma segura con validación de tipos
- [ ] Los JSONB inválidos o vacíos retornan arrays/objetos por defecto sin errores
- [ ] Todos los Server Actions usan `export default` en archivos separados
- [ ] Las respuestas siguen el formato estándar `{ success: boolean; data?: T; error?: string }`
- [ ] Las respuestas de error son descriptivas en español

---

## 4. Criterios de Éxito

### Cuantitativos
- La búsqueda de productos retorna resultados en < 500ms
- La página de catálogo carga en < 2 segundos
- La página de detalle carga en < 1.5 segundos
- El cálculo reactivo del precio se muestra en < 100ms
- La paginación responde en < 300ms

### Cualitativos
- Los usuarios pueden encontrar productos KamCat usando filtros y búsqueda sin frustración
- La personalización de productos es intuitiva y no requiere instrucciones adicionales
- El cálculo del precio final es transparente y genera confianza en la compra
- El flujo de selección de variantes es rápido y visualmente claro
- Los productos personalizados se agregan al carrito con todas las opciones correctas

---

## 5. Supuestos

1. Los productos KamCat tienen slugs únicos generados a partir del nombre
2. Las categorías de KamCat están predefinidas en la tabla `categories` con `brand = 'kc'`
3. El campo `variants JSONB` tiene la estructura: `[{ name: string, options: [{ label: string, price_adjustment: number, value: string, color_hex?: string }] }]` — `color_hex` es opcional, solo para variantes de tipo color (formato `#RRGGBB`)
4. El campo `customization_options JSONB` tiene la estructura: `[{ type: 'text', label: string, max_length: number, placeholder: string }]`
5. Las imágenes de productos están almacenadas en Cloudinary
6. El max-width del contenedor principal es `1200px` según el design system
7. Los precios de variantes son ajustes positivos sobre el precio base (no hay descuentos por variante)

---

## 6. Dependencias

- **Interno:** Feature 001 (Layout Base y Sistema de Diseño) — tokens CSS y componentes UI
- **Interno:** Feature 002 (Auth y Perfiles) — para usuario autenticado en carrito
- **Externo:** Supabase PostgreSQL — tablas products, categories

---

## 7. Fuera de Alcance

- Gestión administrativa de productos KamCat (CRUD, uploads) — Feature futura
- Agregar al carrito y checkout — Feature futura (carrito unificado)
- Sistema de favoritos — Feature futura
- Comparación de productos — Feature futura
- Reseñas y calificaciones de usuarios — Feature futura
- Recomendaciones personalizadas basadas en historial — Feature futura
- Subida de archivos de referencia/instrucciones de diseño — Feature futura
- Variantes de tipo "acabado mate/brillante" — Feature futura

---

## Entidades Clave

| Entidad | Tabla | Campos Clave | RLS |
|---------|-------|--------------|-----|
| Producto | `products` | id, name, description, price, images (TEXT[]), category_id, brand (kc), variants (JSONB), customization_options (JSONB), is_active | Lectura pública |
| Categoría | `categories` | id, name, slug, brand (kc), description, image_url, sort_order, is_active | Lectura pública |

---

---

## Clarifications

### Session 2026-08-27
- Q: ¿Cómo debe manejar el sistema el texto de personalización que los usuarios ingresan? → A: Almacenar el texto tal cual en la BD, mostrarlo al usuario en su historial de pedidos y al admin en el panel de gestión. No se sanitiza ni se filtra contenido.
- Q: ¿Las variantes (tamaño, color) y la personalización son obligatorias para agregar al carrito? → A: No, son opcionales. El usuario puede agregar el producto sin seleccionar nada. Si desea personalizar, puede indicarlo por mensaje. El botón "Agregar al carrito" siempre está habilitado.
- Q: ¿Qué nivel de accesibilidad debe tener el catálogo y detalle de KamCat? → A: Cumplimiento WCAG 2.1 nivel AA: navegación completa por teclado, labels ARIA en todos los controles interactivos, contraste de colores suficiente, alternativas de texto para imágenes.
- Q: ¿Qué debe mostrar el sistema cuando el cálculo del precio final falla? → A: Mostrar el precio base del producto con un mensaje sutil: "Precio final se confirmará al agregar al carrito". No bloquear la compra.
- Q: ¿Cuántos productos KamCat se espera tener en el catálogo? → A: Menos de 50 productos en los próximos 6 meses. Paginación simple y filtros por categoría son suficientes.
- Q: ¿Los colores de las variantes deben ser hexadecimales o nombres legibles? → A: Hexadecimales (#FF5733). Más precisos para diseño y renderizado de círculos de color en la UI.

**Fin de la Especificación**
