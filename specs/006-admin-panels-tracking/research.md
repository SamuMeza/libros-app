# Research: Panel Administrativo y Tracking

**Feature**: 006-admin-panels-tracking
**Date**: 2026-08-27

## Decision 1: Admin Sidebar Architecture

**Decision**: Conditional sidebar using React context + role-based rendering

**Rationale**: 
- El sidebar debe mostrar diferentes navegaciones según el rol (admin_hl, admin_kc, superadmin)
- React Context permite compartir el estado del sidebar entre componentes
- La renderización condicional basada en role es el patrón más directo

**Alternatives considered**:
- Route-based middleware: Más complejo, requiere lógica en servidor
- Configuración estática por archivo: Menos flexible, difícil de mantener

---

## Decision 2: Payment Verification Flow

**Decision**: Modal overlay para inspección de comprobantes con backdrop-blur

**Rationale**:
- El modal permite inspeccionar comprobantes sin perder contexto de la tabla
- backdrop-blur proporciona UX moderna y enfoca la atención
- Radix UI Dialog ofrece accesibilidad built-in (focus trap, aria-labels)

**Alternatives considered**:
- Navegación a página separada: Pierde contexto de la tabla
- Tooltip/popover: Insuficiente para imágenes de alta resolución

---

## Decision 3: Order State Machine

**Decision**: State machine con transiciones lineales (no retroceso)

**Rationale**:
- El flujo pending_payment → payment_verified → preparing → shipped → in_transit → delivered es lineal
- No se permite retroceso según[edge case] y clarify session
- Error messages explicativos cuando la transición es inválida

**Alternatives considered**:
- State machine con retroceso: Más flexible pero complejo de auditar
- Sin validación: Riesgo de estados inconsistentes

---

## Decision 4: Server-Side Pagination

**Decision**: Paginación del servidor con 20 registros por página

**Rationale**:
- Confirmado en clarify session (Q4)
- Mejor rendimiento con grandes volúmenes
- Supabase soporta .range() para paginación eficiente

**Alternatives considered**:
- Client-side pagination: Más simple pero lento con muchos datos
- Infinite scroll: Complejo de implementar, problemas de accesibilidad

---

## Decision 5: Email Notifications

**Decision**: Email automático en cada cambio de estado usando Supabase Edge Functions

**Rationale**:
- Confirmado en clarify session (Q3)
- Supabase Edge Functions permite ejecutar lógica post-database
- Puede dispararse desde database triggers o Server Actions

**Alternatives considered**:
- Server-side polling: Más latencia, más carga
- Third-party service (SendGrid, Resend): Agrega dependencia externa

---

## Decision 6: Tracking Notes Storage

**Decision**: Tabla tracking_notes con foreign key a sub_orders

**Rationale**:
- Ya definida en DATABASE.md
- Permite histórico completo de ubicaciones
- RLS policies ya definidas para admin_hl/admin_kc

**Alternatives considered**:
- JSON field en sub_orders: Menos queryable, sin histórico
- Servicio externo: Agrega dependencia

---

## Decision 7: Admin Layout Architecture

**Decision**: Route group `(admin)` con layout compartido para sidebar

**Rationale**:
- Next.js App Router permite layouts por route group
- Sidebar se renderiza una vez y persiste entre páginas
- Separación limpia entre admin y shop

**Alternatives considered**:
- Layout por página: Duplicación de código
- Middleware-based: Más complejo de mantener

---

## Decision 8: Client Order Timeline

**Decision**: Timeline vertical con estados por marca usando CSS Grid

**Rationale**:
- Timeline vertical es el patrón estándar para estados de pedidos
- CSS Grid permite layout responsive sin dependencias
- Los estados se muestran por separado para HL y KC

**Alternatives considered** horizontal timeline: Menos espacio para contenido
- Stepper component: Requiere librería externa

---

## Decision 9: RLS Policy Enforcement

**Decision**: Combinación de RLS en BD + validación en Server Actions

**Rationale**:
- RLS proporciona seguridad a nivel de base de datos
- Server Actions validan antes de ejecutar queries
- Defensa en profundidad (doble validación)

**Alternatives considered**:
- Solo RLS: Más seguro pero errores poco informativos
- Solo Server Actions: Riesgo de bypass si hay errores de configuración

---

## Decision 10: Proof Upload Handling

**Decision**: Cloudinary para almacenamiento de comprobantes

**Rationale**:
- Ya definido en spec assumptions
- Soporta JPG, PNG, PDF
- URL pública para inspección en modal

**Alternatives considered**:
- Supabase Storage: Menos features de transformación de imágenes
- S3 directo: Más complejo de configurar

---

## Summary

| Decision | Choice | Confidence |
|----------|--------|------------|
| Sidebar | React Context + role | High |
| Payment modal | Radix Dialog + backdrop | High |
| State machine | Lineal, sin retroceso | High |
| Pagination | Server-side, 20/page | High |
| Notifications | Edge Functions | Medium |
| Tracking | Table tracking_notes | High |
| Admin layout | Route group (admin) | High |
| Timeline | CSS Grid vertical | High |
| RLS | Dual validation | High |
| File upload | Cloudinary | High |
