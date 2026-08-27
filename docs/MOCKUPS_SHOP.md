# 🛍️ Mockups y Especificaciones de Vistas Públicas de Tienda

> Especificaciones detalladas de diseño y comportamiento para la Landing Page unificada, Catálogos y Páginas de Detalle de Producto.

---

## 1. Landing Page Unificada (`/`)

### 1.1 Hero Section (Carrusel Dual Manual)
- **Dimensiones:** Altura `75vh` (mínimo `500px`, máximo `700px`).
- **Comportamiento:** Carrusel manual (sin autoplay forzado). Navegación mediante flechas laterales, dots inferiores centrados y swipe táctil en dispositivos móviles.
- **Transición:** `fade` con `translateX(10px)` sutil de `500ms ease-out`.

#### Slide 1 — Hecho Letras (Libros)
- **Fondo:** Fotografía de libros y ambientación cálida con overlay `linear-gradient(to right, rgba(30,58,95,0.88), rgba(30,58,95,0.45))`.
- **Título:** *"Tu próxima historia te espera"* — Token `H1`, `--text-on-dark`.
- **Subtítulo:** *"Encuentra libros de terror, romance, fantasía y más. Por encargo o en stock."* — Token `Body`, `--text-on-dark`.
- **CTA:** Botón *"Explorar libros →"* (`bg --hl-accent`, `text --text-primary`, radio `radius-lg`, padding `space-3 space-6`).

#### Slide 2 — KamCat (Papelería Creativa)
- **Fondo:** Fotografía de papelería, stickers y detalles creativos con overlay `linear-gradient(to right, rgba(124,58,237,0.88), rgba(124,58,237,0.45))`.
- **Título:** *"Detalles hechos con amor y creatividad"* — Token `H1`, `--text-on-dark`.
- **Subtítulo:** *"Papelería personalizada, stickers, photocards y más. Hecho a tu medida."* — Token `Body`, `--text-on-dark`.
- **CTA:** Botón *"Explorar papelería →"* (`bg --kc-accent`, `text --text-primary`, radio `radius-lg`, padding `space-3 space-6`).

### 1.2 Sección "Sobre Nosotros" (Historia de la Pareja)
- **Layout:** Contenedor `max-w-[1200px]` centrado, grid 2 columnas en desktop (1 columna en mobile), padding vertical `space-20`. Fondo `--bg-secondary`.
- **Columna Izquierda:** Fotografía real de los creadores en ratio `4:3`, radio `radius-xl`, sombra `shadow-lg`, `object-cover`.
- **Columna Derecha:** 
  - Etiqueta *"Sobre nosotros"* (`Caption`, `--text-muted`, uppercase, `tracking-wide`).
  - Título: *"Somos Hecho Letras & KamCat"* (`H2`, `--text-primary`).
  - Párrafo: *"Él encuentra historias que te hacen sentir. Ella las hace tangibles, únicas, tuyas. Juntos creamos un espacio donde la literatura y la creatividad se encuentran."*
  - Enlace CTA: *"Conoce más sobre nosotros →"* con subrayado sutil en `--hl-primary`.

### 1.3 Sección "Novedades" (Feed Mixto)
- **Estructura:** Grid responsivo de 4 columnas en desktop, 2 en mobile con las últimas incorporaciones de libros y papelería.
- **Encabezado:** Título *"Lo último en nuestra tienda"* (`H2`) y subtítulo explicativo.

### 1.4 Sección "Hecho Letras" (Destacados de Libros)
- **Encabezado:** Icono `BookOpen` (`--hl-primary`) + Título *"Hecho Letras"* (`H2`) + Subtítulo *"Libros seleccionados con amor"*.
- **Grid:** 4 columnas con libros destacados, badges de disponibilidad y CTA inferior centrado *"Ver todos los libros →"*.

### 1.5 Sección "KamCat" (Destacados de Papelería)
- **Encabezado:** Icono `Sparkles` (`--kc-primary`) + Título *"KamCat"* (`H2`) + Subtítulo *"Papelería que lleva tu esencia"*.
- **Grid:** 4 columnas con artículos creativos, badges de personalización y CTA *"Ver toda la papelería →"*.

### 1.6 Sección "¿No encuentras tu libro?" (Formulario Rápido)
- **Contenedor:** Fondo `--bg-secondary` con sutil trama visual, `max-w-[600px]` centrado, padding vertical `space-20`.
- **Campos:** Título del libro (input), Autor (input), WhatsApp de contacto (input tel).
- **Botón:** *"Solicitar búsqueda"* (`bg --hl-primary`, `text --text-on-dark`, ancho completo).

---

## 2. Catálogo de Libros (`/libros`)

```
┌─────────────────┬─────────────────────────────────────────────────────────┐
│ FILTROS         │ CATÁLOGO DE LIBROS                                      │
│                 │ Mostrando 24 de 120 resultados      [ Ordenar por: v ]  │
│ [x] Terror      ├─────────────────────────────────────────────────────────┤
│ [ ] Romance     │ [ Card Libro 1 ] [ Card Libro 2 ] [ Card Libro 3 ] ... │
│ [x] Fantasía    │ [ Card Libro 4 ] [ Card Libro 5 ] [ Card Libro 6 ] ... │
│                 ├─────────────────────────────────────────────────────────┤
│ Rango Precio    │                                                         │
│ [$0 - $50]      │                  [ < ] [ 1 ] [ 2 ] [ 3 ] [ > ]          │
│                 │                                                         │
│ Disponibilidad  │                                                         │
│ [x] En Stock    │                                                         │
└─────────────────┴─────────────────────────────────────────────────────────┘
```

- **Sidebar de Filtros:** Sticky top `6rem`, ancho fijo `280px` en desktop (drawer colapsable en mobile).
  - Filtro por Categorías: Checkboxes nativos accesibles con recuento de ítems.
  - Filtro por Rango de Precios: Control numérico dual min/max.
  - Filtro por Disponibilidad: "En stock" vs "Por encargo".
- **Grid Principal:** 4 columnas desktop, 3 tablet, 2 mobile. Gap `space-6`.
- **Selector de Ordenamiento:** Select alineado a la derecha (Relevancia, Precio menor a mayor, Precio mayor a menor, Novedades, A-Z).
- **Paginación:** Botones cuadrados (`40px`) con estado activo en `--hl-primary`.

---

## 3. Detalle de Libro (`/libros/[slug]`)

### Layout
- Contenedor centrado `max-w-[1200px]`, padding top `6rem`, gap `space-12`.
- Breadcrumb accesible: `Inicio > Libros > [Categoría] > [Título del Libro]`.

### Columna Izquierda — Galería de Imágenes
- Imagen de portada principal con ratio `2:3`, radio `radius-xl`, sombra `shadow-lg`.
- Galería inferior de miniaturas (`80px`), con borde activo en `--hl-primary` y transición suave.

### Columna Derecha — Información y Acciones
1. **Header de Información:**
   - Badge de marca: *"Hecho Letras"* (`bg --hl-primary/10`, `text --hl-primary`).
   - Título: Token `H1` en *Playfair Display*.
   - Autor: Token `Body` en `--text-secondary`.
   - Precio: Token `H2` destacado en color `--hl-accent`.
   - Badge de disponibilidad: *"EN STOCK"* (`--success`) o *"POR ENCARGO: ~7 días hábiles"* (`--warning`).
2. **Sinopsis y Detalles:**
   - Sinopsis descriptiva en max-width `65ch`.
   - Ficha técnica: Editorial, Páginas, Idioma, Encuadernación, Tiempos de entrega.
3. **Módulo de Extras y Upsell de KamCat ("Hazlo especial ✨"):**
   - Lista horizontal/vertical de accesorios complementarios fabricados por KamCat (Marcapáginas laminado +$2, Stickers temáticos +$3, Lámpara de lectura LED +$8).
   - Checkbox o stepper para anexar extras directamente al libro.
4. **Acciones de Compra:**
   - Selector de cantidad (`-` `1` `+`).
   - Botón principal *"Agregar al carrito"* (`bg --hl-primary`, `text --text-on-dark`, ancho completo, icono `ShoppingCart`).
   - Botón secundario *"♡ Agregar a favoritos"* (outline sutil).
5. **Acordeones Informativos:**
   - Política de envíos (MRW / Zoom), Métodos de pago y Plan de cuotas quincenales.

---

## 4. Catálogo y Detalle de KamCat (`/kamcat` & `/kamcat/[slug]`)

- **Catálogo (`/kamcat`):** Misma estructura modular que el catálogo de libros pero adaptado a la identidad de KamCat (filtros por tipo de producto: Stickers, Photocards, Posters, Llaveros, Pins, Polaroids; precios y acentos en `--kc-primary` / `--kc-accent`).
- **Detalle de Producto (`/kamcat/[slug]`):**
  - **Selector de Variantes:** Chips de selección para Tamaño (Pequeño, Mediano, Grande) y círculos cromáticos para selección de Color.
  - **Módulo de Personalización:** Área de texto / input para indicaciones especiales (ej: Nombre a estampar, frase personalizada, elección de acabado mate o brillante) con contador de caracteres (`0/50`).
  - **Precio Dinámico Reactivo:** El total se recalcula al instante en base al precio base + variaciones seleccionadas.
  - **Botón de Compra:** *"Agregar al carrito"* con acento de marca en `--kc-primary`.
