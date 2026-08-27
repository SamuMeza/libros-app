# 🧩 Componentes Transversales y Layout Global — Especificaciones de Mockups

> Especificaciones detalladas de los componentes globales que enmarcan la plataforma: Header, Footer, Card de Producto, Toasts, Modales, Skeletons y Estados Vacíos.

---

## 1. Header Global

### Estructura y Comportamiento
- **Posición:** `fixed top-0 left-0 right-0`, `z-index: 50`.
- **Altura:** `4rem` (64px).
- **Fondo:** `--bg-primary` con `backdrop-blur-md` y `bg-opacity-95`.
- **Borde:** `border-b` de `1px` sólido `--border`.
- **Padding horizontal:** `space-6` (`1.5rem`) en desktop, `space-4` (`1rem`) en mobile.
- **Layout:** `flex`, `justify-between`, `items-center`.

### Elementos
1. **Izquierda (Branding):**
   - Logo tipográfico: *"Hecho Letras & KamCat"* en fuente *Playfair Display*, `1.25rem`, `font-bold` (700).
   - "Hecho Letras" en `--hl-primary`, "&" en `--text-muted`, "KamCat" en `--kc-primary`.
   - En mobile: botón hamburguesa (icono 3 líneas) + logo compacto *"HL & KC"*.
2. **Centro (Navegación Desktop):**
   - Enlaces horizontales: **Libros** | **Papelería** | **Novedades** | **Ofertas**.
   - Tipografía: Token Nav (`0.875rem`, weight 500). Color: `--text-secondary`.
   - Hover: color `--text-primary` con subrayado animado de `2px` en color de marca según corresponda (`--hl-primary` para Libros, `--kc-primary` para Papelería).
   - Activo: `--text-primary`, weight 600, underline activo.
3. **Derecha (Acciones de Usuario):**
   - Toggle Modo Oscuro: botón con icono `Moon` / `Sun` (`1.25rem`), color `--text-secondary`.
   - Búsqueda: icono `Search` (`1.25rem`), activa overlay de búsqueda rápida.
   - Favoritos: icono `Heart` (`1.25rem`), enlace a lista de deseos.
   - Cuenta: icono `User` (`1.25rem`), enlace a perfil o login según sesión.
   - Carrito: icono `ShoppingCart` (`1.25rem`) con badge flotante circular (`bg --hl-accent`, `text --text-primary`, tamaño `0.75rem`).
4. **Mobile Drawer (Menú lateral):**
   - Activado por menú hamburguesa. Drawer lateral deslizante desde la derecha, ancho `75vw`, fondo `--bg-primary`, sombra `shadow-lg`.
   - Lista vertical de navegación con dividers sutiles y enlaces a redes sociales en el footer.

---

## 2. Footer Global

### Estructura
- **Padding:** `space-16` (`4rem`) top, `space-8` (`2rem`) bottom.
- **Fondo:** `--bg-primary`, `border-t` `1px` `--border`. Max-width: `1200px` centrado.
- **Layout:** Grid de 4 columnas en desktop, 2 columnas en tablet, 1 columna en mobile. Gap: `space-8`.

### Columnas
1. **Columna 1 (Marca):**
   - Logo *"Hecho Letras & KamCat"* en *Playfair Display* (`1.25rem`).
   - Tagline: *"Dos mundos, una pasión por crear y descubrir."* (`Caption`, `--text-muted`).
2. **Columna 2 (Enlaces Rápidos):**
   - Título: *"Enlaces útiles"* (`Caption`, uppercase, `--text-muted`).
   - Enlaces: Inicio, Catálogo de Libros, Papelería Creativa, Sobre Nosotros, Contacto.
3. **Columna 3 (Políticas y Legal):**
   - Título: *"Legal"* (`Caption`, uppercase, `--text-muted`).
   - Enlaces: Términos y Condiciones, Políticas de Privacidad, Políticas de Envíos (MRW/Zoom).
4. **Columna 4 (Contacto & Redes):**
   - Título: *"Síguenos & Contacto"*.
   - Iconos: Instagram, TikTok, WhatsApp (`1.25rem`, `--text-secondary`, hover `--text-primary`).
   - Atención al cliente: `0414-8602819` / `0414-3884420`.
5. **Copyright:**
   - *"© 2026 Hecho Letras & KamCat. Todos los derechos reservados."* centrado al pie con `margin-top: space-8`.

---

## 3. Componente Reutilizable: Card de Producto

```
┌─────────────────────────────────────────────────┐
│ [BADGE: EN STOCK / POR ENCARGO / PERSONALIZABLE]│
│                                                 │
│               IMAGEN DE PRODUCTO                │
│            (Ratio 3:4 HL / 1:1 KC)              │
│                                                 │
│                                       [ (+) ]   │
├─────────────────────────────────────────────────┤
│ HECHO LETRAS / KAMCAT (Marca - Caption Muted)   │
│ Título del Producto (Inter H3, 2 líneas max)    │
│ Autor / Categoría (Caption Secondary)           │
│                                                 │
│ $15.00 USD (Price Token - Acento Marca)         │
└─────────────────────────────────────────────────┘
```

### Especificaciones Técnicas
- **Contenedor:** Fondo `--bg-card`, radio `radius-lg`, sombra `shadow-card`, overflow oculto.
- **Hover State:** Sombra `shadow-lg`, elevación `translate-y: -4px`, transición `300ms ease`.
- **Imagen:** Ratio `3:4` para libros, `1:1` para papelería KamCat. `object-fit: cover`.
- **Badges flotantes (`top-left`, margin `space-2`):**
  - *"EN STOCK"*: `bg --success`, `text --text-on-dark`, radio `radius-sm`.
  - *"POR ENCARGO"*: `bg --warning`, `text --text-on-dark`, radio `radius-sm`.
  - *"PERSONALIZABLE ✏️"*: `bg --kc-primary`, `text --text-on-dark`, radio `radius-sm`.
- **Botón flotante de adición rápida:**
  - Círculo de `40px` en esquina inferior derecha de la imagen (`margin space-3`).
  - Fondo `--bg-primary`, sombra `shadow-md`, icono `Plus`. Hover: fondo color marca correspondiente (`--hl-primary` o `--kc-primary`).

---

## 4. Componentes Transversales del Sistema

### 4.1 Toasts y Notificaciones
- **Posición:** `fixed top-20 right-4` (`z-index: 60`).
- **Contenedor:** Fondo `--bg-primary`, sombra `shadow-lg`, radio `radius-lg`, padding `space-4`, borde izquierdo de `4px`.
- **Variantes de Borde:**
  - Éxito: `--success`
  - Error: `--danger`
  - Información: `--hl-primary` / `--kc-primary`
- **Comportamiento:** Desvanecimiento automático a los 5 segundos con botón manual de cierre (icono `X`).

### 4.2 Modal Genérico Accesible
- **Overlay:** Fondo negro con `50% opacity` y `backdrop-blur-sm`, centrado en pantalla.
- **Contenedor:** Max-width según variante (`450px` a `650px`), fondo `--bg-primary`, radio `radius-xl`, padding `space-6`, sombra `shadow-xl`.
- **Accesibilidad:** Cierre con tecla `Esc`, trampa de foco y bloqueo de scroll en el body.

### 4.3 Loading Skeletons
- **Cards de producto:** Rectángulo pulsante gris (`--bg-secondary`) en ratio `3:4` o `1:1` + líneas horizontales simulando título y precio.
- **Animación:** `pulse` suave de 2 segundos.

### 4.4 Estados Vacíos (Empty States)
- **Estructura:** Icono temático de `3.5rem` (`--text-muted`) centrado vertical y horizontalmente.
- **Tipografía:** Título `H3` (`--text-primary`), descripción `Body` (`--text-secondary`).
- **Llamado a la acción (CTA):** Botón con borde o botón primario para redirigir a catálogo.
