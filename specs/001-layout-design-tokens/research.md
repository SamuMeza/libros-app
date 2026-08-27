# Research: Layout Base y Sistema de Diseño

**Feature**: 001-layout-design-tokens  
**Date**: 2026-08-26  

## Decisiones Técnicas

### 1. Persistencia del Modo Oscuro

**Decision**: localStorage con detección automática del sistema como fallback  
**Rationale**: El localStorage permite persistir la preferencia del usuario sin requerir autenticación. La detección automática de `prefers-color-scheme` proporciona la experiencia correcta la primera vez.  
**Alternatives considered**:
- Cookie: Requeriría integración con perfil de usuario y no funciona sin autenticación
- Solo preferencia del sistema: No permite personalización del usuario

### 2. Accesibilidad del Drawer Mobile

**Decision**: Navegación completa con Escape, Tab cycling y return focus  
**Rationale**: Cumple con WCAG 2.1 AA para navegación por teclado. El return focus es esencial para usuarios de lectores de pantalla.  
**Alternatives considered**:
- Solo Escape: No cumple con estándares de accesibilidad completos
- Roving tabindex: Complejidad innecesaria para un menú de navegación

### 3. Fallbacks Tipográficos

**Decision**: Fallbacks nativos del sistema (Georgia/serif, -apple-system/sans-serif)  
**Rationale**: Máxima compatibilidad entre dispositivos y sistemas operativos. Los fallbacks nativos proporcionan la mejor experiencia de lectura cuando las fuentes externas no están disponibles.  
**Alternatives considered**:
- Web-safe (Times New Roman, Arial): Menor calidad visual
- Sin fallback: Riesgo de texto invisible durante carga

### 4. Comportamiento de Toasts

**Decision**: Apilamiento vertical con máximo 3 visibles  
**Rationale**: Permite múltiples notificaciones sin saturar la interfaz. El límite de 3 evita obstruir el contenido principal.  
**Alternatives considered**:
- Reemplazo: Pierde notificaciones anteriores
- Cola: Retrasa la visibilidad de notificaciones simultáneas

### 5. Transiciones de Modo

**Decision**: Transición selectiva en background-color y color con 200ms + will-change  
**Rationale**: Optimiza el rendimiento al animar solo propiedades clave. `will-change` prepara al navegador para la transición.  
**Alternatives considered**:
- Sin transición: Experiencia visual pobre
- Transición global: Rendimiento deficiente al animar todas las propiedades

## Mejores Prácticas Identificadas

### CSS Custom Properties
- Usar `:root` para valores por defecto (modo claro)
- Usar `[data-theme="dark"]` o `@media (prefers-color-scheme: dark)` para modo oscuro
- Clases `brand-hl` y `brand-kc` como selectores de contexto

### Next.js Font Loading
- Usar `next/font` para optimización automática
- Configurar `variable` para CSS custom properties
- Precargar pesos críticos

### Componentes React
- Server Components para elementos estáticos (Footer)
- Client Components solo para interactividad (Header drawer, Toast, Modal)
- `export default` para todos los componentes principales

### Testing con Vitest
- Patrón AAA (Arrange-Act-Assert)
- Mock de `localStorage` para tests de persistencia
- Testing Library para tests de renderizado
