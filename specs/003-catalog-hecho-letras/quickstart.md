# Quickstart: Catálogo y Detalle de Libros (Hecho Letras)

**Feature:** 003-catalog-hecho-letras  
**Fecha:** 2026-08-26

---

## Prerrequisitos

- Supabase ejecutándose con tablas `books`, `categories`, `book_extras`, `contact_requests`
- Al menos 10 libros de prueba en tabla `books` con diferentes categorías, precios y estados
- Al menos 3 categorías HL en tabla `categories` con `brand = 'hl'`
- Al menos 2 extras configurados en `book_extras` asociados a libros de prueba
- Feature 001 (Layout y Design Tokens) completada
- Feature 002 (Auth) completada (para formulario de solicitud)

---

## Escenarios de Validación

### 1. Catálogo — Carga y Filtros

**Comando:** Navegar a `/libros`

**Escenario:**
1. Abrir `/libros` → verificar que se muestran libros activos
2. Verificar skeleton loader durante la carga
3. Seleccionar categoría "Terror" → verificar que solo se muestran libros de Terror
4. Establecer precio min $10, max $30 → verificar filtrado por rango
5. Seleccionar "En stock" → verificar que solo se muestran con `stock_status = 'in_stock'`
6. Verificar que los filtros se reflejan en la URL
7. Combinar categoría + precio + disponibilidad → verificar AND entre grupos
8. Deseleccionar todos los filtros → verificar que se muestran todos los libros

**Resultado esperado:** Los filtros funcionan correctamente, la URL se actualiza, el sidebar muestra recuentos.

### 2. Catálogo — Búsqueda

**Comando:** Escribir en el campo de búsqueda

**Escenario:**
1. Escribir "terror" → verificar que aparecen libros con "terror" en título, autor o descripción
2. Escribir "garcía márquez" → verificar resultados del autor
3. Esperar 500ms sin escribir → verificar que la búsqueda se ejecuta (debounce)
4. Limpiar búsqueda → verificar que se muestran todos los libros
5. Buscar término sin resultados → verificar mensaje de estado vacío

**Resultado esperado:** La búsqueda es rápida (< 500ms), insensible a tildes, y muestra resultados relevantes.

### 3. Catálogo — Ordenamiento y Paginación

**Comando:** Cambiar selector de ordenamiento

**Escenario:**
1. Seleccionar "Precio (menor a mayor)" → verificar orden ascendente
2. Seleccionar "Precio (mayor a menor)" → verificar orden descendente
3. Seleccionar "Novedades" → verificar orden por fecha de creación
4. Seleccionar "A-Z" → verificar orden alfabético por título
5. Navegar a página 2 → verificar que se muestran los siguientes 24 libros
6. Verificar "Mostrando X de Y resultados" refleja el total

**Resultado esperado:** El ordenamiento y paginación funcionan correctamente.

### 4. Detalle de Libro — Galería e Información

**Comando:** Navegar a `/libros/[slug]`

**Escenario:**
1. Hacer clic en un libro del catálogo → verificar que se abre la página de detalle
2. Verificar breadcrumb: Inicio > Libros > [Categoría] > [Título]
3. Verificar título, autor, precio, badge de disponibilidad
4. Hacer clic en miniaturas → verificar que cambia la imagen principal
5. Verificar sinopsis y ficha técnica (Editorial, Páginas, Idioma, etc.)
6. Verificar metadata dinámico (title tag, Open Graph)

**Resultado esperado:** La página muestra toda la información del libro correctamente.

### 5. Detalle de Libro — Extras y Cantidad

**Comando:** Interactuar con módulo de extras y selector de cantidad

**Escenario:**
1. Verificar que se muestran los extras configurados para el libro
2. Verificar que los extras con `is_default = TRUE` están pre-seleccionados
3. Seleccionar/deseleccionar extras → verificar que el precio total se actualiza
4. Cambiar cantidad con botones +/- → verificar que no baja de 1 ni sube de 10
5. Escribir cantidad directamente → verificar validación
6. Verificar que el botón "Agregar al carrito" está deshabilitado si el libro está agotado

**Resultado esperado:** Los extras y la cantidad funcionan correctamente con cálculo de precio.

### 6. Detalle de Libro — Acordeones

**Comando:** Abrir/cerrar acordeones informativos

**Escenario:**
1. Abrir acordeón "Política de envíos" → verificar información de MRW/Zoom
2. Abrir acordeón "Métodos de pago" → verificar Pago Móvil, Binance, Plan de Pagos
3. Abrir acordeón "Plan de cuotas" → verificar desglose de 2-4 cuotas quincenales
4. Verificar transiciones suaves de apertura/cierre

**Resultado esperado:** Los acordeones muestran información correcta y son accesibles por teclado.

### 7. Formulario de Solicitud

**Comando:** Enviar formulario "¿No encuentras tu libro?"

**Escenario:**
1. Ir al final de `/libros` → verificar que se muestra el formulario
2. Enviar con campos obligatorios vacíos → verificar errores de validación
3. Llenar nombre, email, título del libro → enviar → verificar mensaje de confirmación
4. Verificar que el formulario se resetea después del envío exitoso
5. Verificar que los datos se insertan en `contact_requests` con estado `pending`
6. Si hay sesión activa → verificar que los datos del perfil se pre-rellenan

**Resultado esperado:** El formulario funciona para usuarios autenticados y anónimos.

### 8. SEO

**Comando:** Verificar metadata de páginas

**Escenario:**
1. Abrir `/libros/[slug]` → inspeccionar `<title>` tag → verificar formato "[Título] — Hecho Letras"
2. Verificar `<meta name="description">` → verificar descripción de la sinopsis (max 160 chars)
3. Verificar `<meta property="og:image">` → verificar imagen principal del libro
4. Verificar que libros inexistentes retornan 404

**Resultado esperado:** El SEO está correctamente configurado para cada libro.

---

## Comandos de Verificación

```bash
# Ejecutar tests unitarios
bun test tests/unit/books-actions.test.ts
bun test tests/unit/slug-helpers.test.ts

# Ejecutar tests de integración
bun test tests/integration/catalog-flow.test.ts

# Verificar que no hay errores de TypeScript
bun run typecheck

# Verificar que no hay errores de lint
bun run lint
```
