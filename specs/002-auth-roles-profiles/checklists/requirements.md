# Checklist: Calidad de Requerimientos — Autenticación, Roles y Perfiles

**Feature:** 002-auth-roles-profiles  
**Creado:** 2026-08-26  
**Profundidad:** Estándar (~35 items)  
**Audiencia:** Autor (pre-implementación)

---

## Requirement Completeness

- [x] CHK001 — ¿Los requerimientos definen qué campos son obligatorios vs opcionales en cada formulario de auth? [Completeness, Spec §3.1]
- [x] CHK002 — ¿Se especifican los mensajes de error exactos para cada tipo de fallo (email duplicado, contraseña débil, credenciales incorrectas)? [Completeness, Spec §3.1]
- [x] CHK003 — ¿Se definen los requerimientos para el layout del grupo de rutas `(auth)` (sin header/footer)? [Completeness, Gap]
- [x] CHK004 — ¿Se documentan los requerimientos de responsive design para las pantallas de auth en mobile? [Completeness, Gap]
- [x] CHK005 — ¿Los requerimientos cubren el comportamiento del formulario cuando Supabase Auth está caído durante el envío? [Completeness, Spec §3.2]
- [x] CHK006 — ¿Se definen los campos del email de restablecimiento de contraseña (asunto, contenido, enlace)? [Completeness, Gap]
- [x] CHK007 — ¿Se especifican los requerimientos para el autocomplete de los campos del formulario (nombre, email, contraseña)? [Completeness, Gap]

## Requirement Clarity

- [x] CHK008 — ¿El término "loader sutil con fondo difuminado" está cuantificado con opacidad, color, y duración específicas? [Clarity, Spec §3.1]
- [x] CHK009 — ¿"Mensaje de error claro" está definido con formato, posición y estilo específicos? [Clarity, Spec §3.1]
- [x] CHK010 — ¿"Cambios se reflejan inmediatamente en la UI" tiene un umbral de tiempo definido? [Clarity, Spec §3.5]
- [x] CHK011 — ¿El campo "Internacional (+XX)" tiene especificado el formato exacto de validación para diferentes países? [Clarity, Spec §3.5]
- [x] CHK012 — ¿"Acceso denegado se maneja con redirección suave" define qué constituye una redirección "suave" vs un error crudo? [Clarity, Spec §4]

## Requirement Consistency

- [x] CHK013 — ¿Los campos de entrada de `signIn` en §3.3 son consistentes con los campos del formulario de login en §3.1? [Consistency, Spec §3.1 vs §3.3]
- [x] CHK014 — ¿El comportamiento de "Recordarme" documentado en las Clarifications es consistente con los criterios de aceptación de §3.2? [Consistency, Clarifications vs Spec §3.2]
- [x] CHK015 — ¿La ruta del middleware en §3.6 es consistente con la estructura de directorios del plan? [Consistency, Spec §3.6 vs Plan]
- [x] CHK016 — ¿Los tipos definidos en data-model.md son consistentes con los campos del formulario en §3.5? [Consistency, Data Model vs Spec §3.5]

## Acceptance Criteria Quality

- [x] CHK017 — ¿Los criterios de aceptación de §3.1 son medibles y verificables objetivamente? [Measurability, Spec §3.1]
- [x] CHK018 — ¿El criterio "Login completado en < 3 segundos" tiene definido cómo se mide (tiempo de respuesta del servidor vs tiempo total del usuario)? [Measurability, Spec §4]
- [x] CHK019 — ¿El criterio "Tasa de éxito en login > 95%" tiene definido el período de medición y cómo se excluyen credenciales incorrectas? [Measurability, Spec §4]
- [x] CHK020 — ¿Los criterios de §3.4 (creación automática de perfil) son verificables sin inspeccionar la base de datos directamente? [Measurability, Spec §3.4]

## Scenario Coverage

- [x] CHK021 — ¿Se definen requerimientos para el flujo de registro cuando el usuario cierra el navegador a mitad del proceso? [Coverage, Exception Flow]
- [x] CHK022 — ¿Se especifica el comportamiento cuando un usuario autenticado intenta acceder a `/login` o `/register`? [Coverage, Alternate Flow]
- [x] CHK023 — ¿Se documentan los requerimientos para múltiples pestañas abiertas con diferentes estados de sesión? [Coverage, Gap]
- [x] CHK024 — ¿Se definen requerimientos para el caso en que el email de restablecimiento no llega (timeout, spam)? [Coverage, Recovery Flow]
- [x] CHK025 — ¿Se especifica el comportamiento del middleware cuando la tabla `profiles` no existe o está vacía? [Coverage, Exception Flow]

## Edge Case Coverage

- [x] CHK026 — ¿Se definen requerimientos para inputs con caracteres especiales (emojis, HTML, SQL injection)? [Edge Case, Gap]
- [x] CHK027 — ¿Se especifica el comportamiento con contraseñas en el límite exacto (8 caracteres) y por encima del máximo permitido? [Edge Case, Spec §3.3]
- [x] CHK028 — ¿Se documenta qué sucede cuando el usuario intenta eliminar su perfil con órdenes activas? [Edge Case, Gap]
- [x] CHK029 — ¿Se definen requerimientos para la sesión cuando el usuario cambia de dispositivo (desktop a mobile)? [Edge Case, Gap]

## Non-Functional Requirements

- [x] CHK030 — ¿Los requerimientos de accesibilidad (§3.1) cubren lectores de pantalla, contraste de colores, y zoom del navegador? [Coverage, Spec §3.1]
- [x] CHK031 — ¿Se definen requerimientos de seguridad para la transmisión de credenciales (HTTPS obligatorio)? [Gap, Security]
- [x] CHK032 — ¿Se especifican los headers de seguridad en las cookies de sesión (SameSite, Secure, HttpOnly)? [Gap, Security]
- [x] CHK033 — ¿Se definen requerimientos para el comportamiento en conexiones lentas o intermitentes? [Gap, Performance]

## Dependencies & Assumptions

- [x] CHK034 — ¿Las dependencias de Feature 001 (Layout Base) están documentadas con los componentes específicos requeridos? [Dependency, Spec §6]
- [x] CHK035 — ¿Se validan los supuestos de §5 (Supabase Auth configurado, email habilitado, etc.) con criterios de verificación? [Assumption, Spec §5]

## Ambiguities & Conflicts

- [x] CHK036 — ¿Existe ambigüedad en "No se permite al usuario especificar un rol diferente" cuando el campo role no está en el formulario? [Ambiguity, Spec §3.4]
- [x] CHK037 — ¿El término "inmediatamente accesible tras el registro" tiene un umbral de tiempo definido? [Ambiguity, Spec §3.4]
