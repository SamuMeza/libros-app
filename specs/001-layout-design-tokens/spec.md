# Especificación: Layout Base y Sistema de Diseño

**Feature:** 001-layout-design-tokens  
**Fecha:** 2026-08-26  
**Estado:** borrador  

---

## 1. Resumen

Implementar el layout base y sistema de diseño para la plataforma e-commerce unificada Hecho Letras & KamCat. Esto incluye variables CSS para ambos modos (claro/oscuro), tipografía con escala relativa, componentes de navegación (Header/Footer), card de producto reutilizable y componentes transversales (Toast, Modal, Skeletons).

---

## 2. Contexto y Motivo

La plataforma requiere una base de diseño consistente que soporte dos marcas con identidades visuales diferenciadas:
- **Hecho Letras (HL):** Azul profundo (#1E3A5F) con acentos dorados
- **KamCat (KC):** Púrpura creativo (#7C3AED) con acentos rosados

El sistema debe permitir:
- Cambio entre modo claro y oscuro
- Navegación fluida entre marcas
- Experiencia mobile-first responsive
- Accesibilidad WCAG 2.1 AA

---

## 3. Requerimientos Funcionales

### 3.1 Variables CSS (`src/styles/brand-variables.css`)

**Entradas:**
- Paleta de colores completa del DESIGN_SYSTEM.md
- Tokens de espaciado (escala base 4px)
- Tokens de bordes y sombras

**Salidas:**
- Archivo CSS con variables customizadas para modo claro
- Media query `@media (prefers-color-scheme: dark)` para modo oscuro
- Clases utilitarias `brand-hl` y `brand-kc` para activar colores por marca

**Criterios de Aceptación:**
- [ ] Todas las variables del DESIGN_SYSTEM.md están definidas
- [ ] El modo oscuro se activa automáticamente según preferencias del sistema
- [ ] Las clases `brand-hl` y `brand-kc` sobreescriben colores primarios y de acento
- [ ] No se usan valores absolutos en px (solo rem, em, vw, vh, %)
- [ ] Transiciones suaves de <100ms entre modos

### 3.2 Tipografía

**Entradas:**
- Fuentes: Playfair Display (títulos) e Inter (cuerpo)
- Escala relativa del DESIGN_SYSTEM.md

**Salidas:**
- Importación de fuentes via `next/font`
- Variables CSS para cada rol tipográfico (H1, H2, H3, Body, Caption, Button, Badge, Price, Nav)
- Clases utilitarias Tailwind configuradas

**Criterios de Aceptación:**
- [ ] Playfair Display cargada con pesos 600 y 700
- [ ] Inter cargada con pesos 400, 500, 600 y 700
- [ ] Tamaños en escala relativa rem (no px)
- [ ] Responsive: tamaños mobile vs desktop según tabla del DESIGN_SYSTEM.md
- [ ] Line-height configurado por cada rol tipográfico

### 3.3 Header (`src/components/layout/header.tsx`)

**Entradas:**
- Especificaciones de MOCKUPS_SHARED.md
- Tokens de color y tipografía

**Salidas:**
- Componente Server Component con `'use client'` para interactividad
- Posición fija con backdrop-blur
- Branding dual con colores diferenciados
- Navegación desktop con underline dinámico por marca
- Drawer mobile deslizante
- Badges interactivos (carrito, favoritos, modo oscuro)

**Criterios de Aceptación:**
- [ ] Posición `fixed` con `z-index: 50`
- [ ] Altura `4rem` (64px)
- [ ] Logo: "Hecho Letras" en `--hl-primary`, "&" en `--text-muted`, "KamCat" en `--kc-primary`
- [ ] Navegación desktop: Libros, Papelería, Novedades, Ofertas
- [ ] Underline dinámico: `--hl-primary` para Libros, `--kc-primary` para Papelería
- [ ] Mobile: hamburguesa + logo compacto "HL & KC"
- [ ] Drawer mobile: `75vw` ancho, deslizante desde derecha
- [ ] Badges: carrito con contador, modo oscuro toggle, búsqueda, favoritos, cuenta
- [ ] Accesibilidad: navegación por teclado, aria-labels

### 3.4 Footer (`src/components/layout/footer.tsx`)

**Entradas:**
- Especificaciones de MOCKUPS_SHARED.md

**Salidas:**
- Componente Server Component
- Grid 4 columnas (desktop), 2 columnas (tablet), 1 columna (mobile)
- Contenido: marca, enlaces rápidos, legal, contacto/redes

**Criterios de Aceptación:**
- [ ] Padding: `space-16` top, `space-8` bottom
- [ ] Max-width: `1200px` centrado
- [ ] Columna 1: Logo + tagline
- [ ] Columna 2: Enlaces rápidos (Inicio, Catálogo Libros, Papelería, Sobre Nosotros, Contacto)
- [ ] Columna 3: Legal (Términos, Privacidad, Envíos)
- [ ] Columna 4: Redes sociales + números de contacto
- [ ] Copyright centrado al pie
- [ ] Responsive: grid se adapta a 2 y 1 columna

### 3.5 Card de Producto (`src/components/shared/product-card.tsx`)

**Entradas:**
- Mockup de MOCKUPS_SHARED.md
- Tokens de color, tipografía y espaciado

**Salidas:**
- Componente reutilizable con props para tipo de producto
- Soporte para ratio 3:4 (libros) y 1:1 (KamCat)
- Badges dinámicos según estado
- Botón de adición rápida

**Criterios de Aceptación:**
- [ ] Props: `product`, `brand` ('hl' | 'kc'), `onAddToCart`
- [ ] Ratio de imagen: 3:4 para HL, 1:1 para KC
- [ ] Badges: "EN STOCK" (success), "POR ENCARGO" (warning), "PERSONALIZABLE" (kc-primary)
- [ ] Hover: sombra `shadow-lg`, elevación `translate-y: -4px`
- [ ] Botón flotante: círculo 40px, icono Plus, color de marca al hover
- [ ] Texto: Marca (caption muted), Título (H3, 2 líneas max), Autor/Categoría (caption secondary), Precio (price token)
- [ ] Accesibilidad: alt text en imagen, aria-label en botón

### 3.6 Componentes Transversales

#### 3.6.1 Toast

**Entradas:**
- Variantes: éxito, error, información
- Auto-dismiss: 5 segundos
- Botón manual de cierre

**Criterios de Aceptación:**
- [ ] Posición: `fixed top-20 right-4`, `z-index: 60`
- [ ] Variantes: éxito (success), error (danger), información (info)
- [ ] Auto-dismiss: 5 segundos con botón manual de cierre
- [ ] Apilamiento: máximo 3 visibles, los más antiguos desaparecen
- [ ] Accesibilidad: `aria-live="polite"`, `role="alert"`

#### 3.6.2 Modal Accesible

**Entradas:**
- Overlay: negro 50% opacity + backdrop-blur
- Contenedor: max-width variable, radio `radius-xl`

**Criterios de Aceptación:**
- [ ] Overlay: negro 50% opacity + `backdrop-blur-sm`
- [ ] Contenedor: max-width `450px` a `650px`, fondo `--bg-primary`, radio `radius-xl`
- [ ] Cierre: tecla `Esc` y click fuera del modal
- [ ] Accesibilidad: trampa de foco, bloqueo de scroll en body
- [ ] Transición: fade-in/out 200ms

#### 3.6.3 Skeletons

**Entradas:**
- Cards de producto: rectángulo pulsante + líneas simulando contenido
- Animación: `pulse` de 2 segundos

**Criterios de Aceptación:**
- [ ] Ratio: `3:4` para HL, `1:1` para KC (match ProductCard)
- [ ] Estructura: rectángulo imagen + 2 líneas título + 1 línea precio
- [ ] Animación: `pulse` suave de 2 segundos
- [ ] Color: `--bg-secondary` con opacidad 0.5

---

## 4. Criterios de Éxito

### Cuantitativos
- Tiempo de carga inicial < 2 segundos
- Cambio de modo oscuro/claro < 100ms
- Renderizado de cards < 50ms por card
- Cobertura de tests > 80%

### Cualitativos
- Experiencia visual consistente entre marcas: mismo espaciado, tipografía y patrones de componente
- Navegación intuitiva en mobile y desktop: tasa de éxito >90% en tareas de navegación básico
- Accesibilidad WCAG 2.1 AA cumplida: score Lighthouse >90
- Cambio de modo sin parpadeos visuales: transición <100ms sin flicker

---

## 5. Supuestos

1. Las fuentes Playfair Display e Inter están disponibles en Google Fonts
2. El soporte de CSS custom properties es universal en navegadores modernos
3. El usuario puede cambiar manualmente el modo oscuro además de detectar preferencia del sistema
4. Las imágenes de productos están optimizadas y disponibles via URL externa (Cloudinary)
5. El carrito se persiste en base de datos (Supabase), no en localStorage
6. Las imágenes de productos dependen de Cloudinary; si el servicio no está disponible, se muestra placeholder genérico

---

## 6. Dependencias

- **Interno:** Ninguna (primera feature)
- **Externo:** Google Fonts (Playfair Display, Inter), Lucide React (iconos)

---

## 7. Fuera de Alcance

- Lógica de negocio de carrito y checkout
- Autenticación y gestión de sesiones
- Conexión con base de datos
- Implementación de pagos
- Gestión de inventario

---

## Clarifications

### Session 2026-08-26
- Q: ¿Cómo debe persistir la preferencia del modo oscuro del usuario entre sesiones? → A: localStorage con detección automática del sistema como fallback. La primera vez se detecta `prefers-color-scheme` y se guarda en localStorage. El usuario puede cambiar manualmente y la preferencia se persiste.
- Q: ¿Qué nivel de soporte de accesibilidad por teclado debe tener el Header mobile drawer? → A: Navegación completa con Escape para cerrar, Tab cycling dentro del drawer y return focus al elemento que lo abrió.
- Q: ¿Qué fallback tipográfico debe usar cuando Playfair Display o Inter no estén disponibles? → A: Fallbacks nativos del sistema: Georgia y serif para Playfair Display, -apple-system y sans-serif para Inter.
- Q: ¿Cómo debe comportarse el Toast cuando se genera múltiples notificaciones simultáneamente? → A: Apilamiento vertical con límite máximo de 3 Toasts visibles, los más antiguos desaparecen automáticamente.
- Q: ¿Cómo debe manejar el sistema el parpadeo visual al cambiar entre modo claro y oscuro? → A: Transición selectiva en background-color y color con <100ms, usando `will-change` para optimizar el rendimiento.

---

**Fin de la Especificación**