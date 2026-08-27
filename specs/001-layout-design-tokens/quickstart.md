# Quickstart Validation: Layout Base y Sistema de Diseño

**Feature**: 001-layout-design-tokens  
**Date**: 2026-08-26  

## Prerrequisitos

- Bun instalado (v1.3.14 o superior)
- Node.js instalado
- Dependencias del proyecto instaladas (`bun install`)

## Escenarios de Validación

### 1. Variables CSS y Modo Oscuro

**Comando**:
```bash
bun run dev
# Abrir http://localhost:3000
# Inspeccionar CSS en DevTools
```

**Resultado esperado**:
- Variables CSS definidas en `:root`
- Modo oscuro activo al cambiar preferencia del sistema
- Persistencia de preferencia al recargar página
- Transición suave de 200ms al cambiar modo

### 2. Tipografía

**Comando**:
```bash
# Verificar carga de fuentes en DevTools > Network
```

**Resultado esperado**:
- Playfair Display cargada (pesos 600, 700)
- Inter cargada (pesos 400, 500, 600, 700)
- Fallbacks funcionales (Georgia, -apple-system)
- Tamaños responsivos (mobile vs desktop)

### 3. Header

**Comando**:
```bash
# Desktop: Verificar navegación horizontal
# Mobile: Verificar drawer deslizante
```

**Resultado esperado**:
- Header fijo en top:0
- Branding con colores diferenciados (HL azul, KC púrpura)
- Underline dinámico al hover (azul para Libros, púrpura para Papelería)
- Drawer mobile abre desde derecha (75vw)
- Badges interactivos (carrito, modo oscuro, etc.)
- Navegación por teclado funciona (Tab, Escape)

### 4. Footer

**Comando**:
```bash
# Desktop: 4 columnas
# Tablet: 2 columnas
# Mobile: 1 columna
```

**Resultado esperado**:
- Grid responsivo según breakpoint
- Contenido correcto en cada columna
- Copyright centrado al pie
- Enlaces funcionales

### 5. ProductCard

**Comando**:
```bash
# HL: Verificar ratio 3:4
# KC: Verificar ratio 1:1
```

**Resultado esperado**:
- Imágenes con ratio correcto según marca
- Badges visibles ("EN STOCK", "POR ENCARGO", "PERSONALIZABLE")
- Hover con elevación y sombra
- Botón flotante con color de marca
- Texto con tokens tipográficos correctos

### 6. Toast

**Comando**:
```bash
# Disparar múltiples notificaciones
```

**Resultado esperado**:
- Toasts apilados verticalmente
- Máximo 3 visibles
- Auto-dismiss después de 5 segundos
- Botón de cierre funcional

### 7. Modal

**Comando**:
```bash
# Abrir modal
# Presionar Escape
# Hacer click fuera del modal
```

**Resultado esperado**:
- Overlay con blur
- Cierre con Escape
- Focus trap dentro del modal
- Scroll del body bloqueado

### 8. Tests Unitarios

**Comando**:
```bash
bun test
```

**Resultado esperado**:
- Todos los tests pasan
- Cobertura >80%
- Sin errores de tipado

## Validación de Accesibilidad

**Herramientas**:
- Chrome DevTools > Accessibility
- Lighthouse audit
- Navegación por teclado manual

**Criterios WCAG 2.1 AA**:
- [ ] Contraste de colores >= 4.5:1
- [ ] Navegación completa por teclado
- [ ] Labels aria en todos los elementos interactivos
- [ ] Focus visible en todos los elementos
- [ ] Skip to content link
