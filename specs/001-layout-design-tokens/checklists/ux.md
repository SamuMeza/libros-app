# Checklist de Calidad de Requerimientos: Layout Base y Sistema de Diseño

**Purpose**: Validar la calidad, claritud y completitud de los requerimientos de diseño UI/UX  
**Created**: 2026-08-26  
**Feature**: [spec.md](../spec.md)  
**Audience**: Autor (durante desarrollo)  
**Depth**: Estándar  

---

## Requirement Completeness

- [x] CHK001 - ¿Están definidos los requerimientos de accesibilidad por teclado para TODOS los elementos interactivos (Header, Footer, ProductCard, Toast, Modal)? [Gap, Accesibilidad]
- [x] CHK002 - ¿Se especifican los斷点 responsivos exactos (mobile, tablet, desktop) para el layout del Header y Footer? [Gap, Responsive]
- [x] CHK003 - ¿Están documentados los estados de carga (skeletons) para cada componente que dependa de datos asíncronos? [Completeness, Loading States]
- [x] CHK004 - ¿Se definen los requerimientos para cuando las imágenes de producto fallan al cargar (fallback/placeholder)? [Edge Case, Gap]
- [x] CHK005 - ¿Están especificados los comportamientos del Toast cuando se alcanza el límite máximo de 3 notificaciones? [Completeness, Toast]

## Requirement Clarity

- [x] CHK006 - ¿Está "experiencia visual consistente" cuantificada con criterios medibles (proporciones, espaciados, colores específicos)? [Clarity, Qualitative Criteria]
- [x] CHK007 - ¿Está "navegación intuitiva" definida con comportamientos observables específicos? [Clarity, Qualitative Criteria]
- [x] CHK008 - ¿Se cuantifican los断点 de responsive con valores específicos de anchura (ej: <768px, 768-1024px, >1024px)? [Clarity, Responsive]
- [x] CHK009 - ¿Está definido el comportamiento exacto del underline dinámico en la navegación (velocidad de animación, grosor, posición)? [Clarity, Header]
- [x] CHK010 - ¿Se especifica el comportamiento del drawer mobile cuando el contenido excede la altura de la pantalla? [Clarity, Edge Case]

## Requirement Consistency

- [x] CHK011 - ¿Son consistentes los tokens de color entre el DESIGN_SYSTEM.md y los requerimientos de la especificación? [Consistency, Tokens]
- [x] CHK012 - ¿Se alinean los断ptipográficos entre la tabla de tipografía del DESIGN_SYSTEM.md y los criterios de aceptación? [Consistency, Tipografía]
- [x] CHK013 - ¿Son consistentes los requerimientos de accesibilidad entre Header (drawer), Modal y otros elementos interactivos? [Consistency, Accesibilidad]
- [x] CHK014 - ¿Se alinean los tiempos de transición (200ms) entre diferentes secciones de la especificación? [Consistency, Animaciones]

## Acceptance Criteria Quality

- [x] CHK015 - ¿Son todos los criterios de aceptación medibles y verificables objetivamente? [Measurability]
- [x] CHK016 - ¿Se definen métricas específicas para "cambio de modo <100ms" (cómo medir, qué herramientas)? [Measurability, Performance]
- [x] CHK017 - ¿Se especifica cómo verificar que "no se usan valores absolutos en px" (herramientas de lint, revisión manual)? [Measurability, CSS]
- [x] CHK018 - ¿Están definidos los umbrales específicos para "cobertura de tests > 80%" (qué archivos incluir, qué excluir)? [Measurability, Testing]

## Scenario Coverage

- [x] CHK019 - ¿Se cubre el escenario de usuario sin JavaScript habilitado (degradación graceful)? [Coverage, Edge Case]
- [x] CHK020 - ¿Se definen requerimientos para navegadores sin soporte de backdrop-blur? [Coverage, Browser Support]
- [x] CHK021 - ¿Se cubre el comportamiento del modo oscuro cuando el usuario cambia preferencia del sistema mientras usa la app? [Coverage, Theme Switching]
- [x] CHK022 - ¿Se definen requerimientos para el estado vacío del carrito (0 productos)? [Coverage, Empty States]
- [x] CHK023 - ¿Se cubre el escenario de múltiples modales abiertos simultáneamente? [Coverage, Modal Stacking]

## Edge Case Coverage

- [x] CHK024 - ¿Se define el comportamiento del Header cuando el usuario scrollea hacia abajo y luego hacia arriba (sticky behavior)? [Edge Case, Scroll]
- [x] CHK025 - ¿Se especifica qué ocurre cuando localStorage está lleno o deshabilitado (persistencia del tema)? [Edge Case, Storage]
- [x] CHK026 - ¿Se definen requerimientos para pantallas extremadamente pequeñas (<320px) o extremadamente grandes (>2560px)? [Edge Case, Responsive]
- [x] CHK027 - ¿Se cubre el comportamiento del focus trap en Modal cuando hay iframes embebidos? [Edge Case, Accessibility]

## Non-Functional Requirements

- [x] CHK028 - ¿Se definen requerimientos de rendimiento específicos para la carga inicial de fuentes tipográficas? [NFR, Performance]
- [x] CHK029 - ¿Se especifican requerimientos de accesibilidad más allá de WCAG 2.1 AA (ej: WCAG 2.1 AAA)? [NFR, Accessibility]
- [x] CHK030 - ¿Se definen requerimientos de compatibilidad con navegadores específicos (versión mínima de Chrome, Firefox, Safari, Edge)? [NFR, Browser Support]
- [x] CHK031 - ¿Se especifican requerimientos de SEO para los componentes de layout (semantic HTML, meta tags)? [NFR, SEO]

## Dependencies & Assumptions

- [x] CHK032 - ¿Se valida que la dependencia de Google Fonts es aceptable (vs auto-hospedaje para privacidad)? [Dependency, External]
- [x] CHK033 - ¿Se documenta el impacto si Radix UI cambia su API pública? [Dependency, External]
- [x] CHK034 - ¿Se verifica que la asunción de "soporte universal de CSS custom properties" es correcta para el navegador objetivo? [Assumption, Browser Support]
- [x] CHK035 - ¿Se documenta la dependencia de Lucide React y su impacto si no está disponible? [Dependency, External]

## Ambiguities & Conflicts

- [x] CHK036 - ¿Hay ambigüedades en la definición de "underline dinámico por marca" (cómo determinar qué marca activa)? [Ambiguity, Header]
- [x] CHK037 - ¿Se resuelve el potencial conflicto entre "Server Component por defecto" y la necesidad de `'use client'` para interactividad? [Conflict, Architecture]
- [x] CHK038 - ¿Se clarifica el alcance de "accesibilidad WCAG 2.1 AA" (qué componentes específicos requieren qué niveles)? [Ambiguity, Accessibility]
- [x] CHK039 - ¿Se define qué constituye "parpadeo visual" y cómo medir su eliminación en el cambio de modo? [Ambiguity, Theme]
- [x] CHK040 - ¿Se resuelve la ambigüedad de "logo compacto HL & KC" en mobile (cómo se muestra exactamente)? [Ambiguity, Header]

---

**Total Items**: 40  
**Categories**: 9  
**Traceability**: Todos los ítems incluyen referencia a sección de especificación o marcador [Gap]/[Ambiguity]/[Conflict]
