# Checklist de Calidad de Requisitos: Carrito Unificado y Checkout

**Propósito**: Auditoría exhaustiva de calidad de requisitos para auto-revisión del autor
**Creado**: 2026-08-27
**Feature**: [spec.md](../spec.md)
**Nivel**: Exhaustivo
**Áreas**: Todas (Carrito, Checkout, Pagos, Órdenes, Edge Cases)
**Audiencia**: Autor (auto-revisión antes de marcar spec como completa)

---

## Completitud de Requisitos

- [ ] CHK001 - ¿Los requisitos del carrito especifican comportamiento cuando un producto se agota mientras el usuario está en el proceso de checkout? [Cobertura, Gap, Spec §Edge Cases]
- [ ] CHK002 - ¿Los requisitos definen qué sucede cuando el usuario tiene solo libros con Plan de Pagos y productos KamCat en la misma orden? [Cobertura, Gap, Spec §Edge Cases]
- [ ] CHK003 - ¿Los requisitos especifican el comportamiento del sistema cuando la tasa de cambio es inválida o no está configurada? [Cobertura, Gap, Spec §FR-CK4]
- [ ] CHK004 - ¿Los requisitos definen qué ocurre si el comprobante de pago no coincide con el monto de la orden? [Cobertura, Gap, Spec §Edge Cases]
- [ ] CHK005 - ¿Los requisitos especifican el comportamiento cuando el usuario sube un archivo que excede el límite de 5MB? [Cobertura, Spec §FR-CK9]
- [ ] CHK006 - ¿Los requisitos definen qué sucede si el usuario abandona el checkout a mitad de proceso? [Cobertura, Gap]
- [ ] CHK007 - ¿Los requisitos especifican el comportamiento cuando el carrito está vacío al intentar iniciar checkout? [Cobertura, Spec §FR-CT6]
- [ ] CHK008 - ¿Los requisitos definen qué ocurre si un ítem del carrito es eliminado del catálogo mientras el usuario está en checkout? [Cobertura, Gap]
- [ ] CHK009 - ¿Los requisitos especifican el comportamiento cuando el usuario intenta agregar un ítem ya existente en el carrito? [Cobertura, Spec §FR-CT1]
- [ ] CHK010 - ¿Los requisitos definen qué sucede si el usuario selecciona Plan de Pagos pero la orden no contiene libros? [Cobertura, Spec §FR-CK6]

---

## Claridad de Requisitos

- [ ] CHK011 - ¿El término "en tiempo real" en FR-CT3 está cuantificado con un umbral de latencia específico? [Claridad, Spec §FR-CT3]
- [ ] CHK012 - ¿El costo de envío "según el peso total del paquete" (FR-CK3) especifica cómo se obtiene el peso de cada producto? [Claridad, Spec §FR-CK3]
- [ ] CHK013 - ¿La "tasa de cambio fija configurada por administrador" (FR-CK4) define dónde y cómo se almacena la tasa? [Claridad, Spec §FR-CK4]
- [ ] CHK014 - ¿Las "cuotas quincenales" (FR-CK7) especifican si son cada 14 días exactos o días hábiles? [Claridad, Spec §FR-CK7]
- [ ] CHK015 - ¿El "número de orden" (FR-OR1) define el formato exacto para órdenes con una sola marca vs. ambas marcas? [Claridad, Spec §FR-OR1]
- [ ] CHK016 - ¿El "monto configurable por administrador" (FR-CK7) define si es monto fijo por cuota o porcentaje del total? [Claridad, Spec §FR-CK7]
- [ ] CHK017 - ¿La "descuento del 5%" (FR-CK5) especifica si se aplica antes o después del cálculo de envío? [Claridad, Spec §FR-CK5]
- [ ] CHK018 - ¿El "peso del paquete" (FR-CK3) define si se usa peso real o peso volumétrico? [Claridad, Spec §FR-CK3]
- [ ] CHK019 - ¿Los "datos bancarios destino" (FR-CK4) especifican qué campos exactos se muestran al usuario? [Claridad, Spec §FR-CK4]
- [ ] CHK020 - ¿La "dirección de billetera (TRC-20/BEP-20)" (FR-CK5) define si el usuario elige la red o se muestra automáticamente? [Claridad, Spec §FR-CK5]

---

## Consistencia de Requisitos

- [ ] CHK021 - ¿Los requisitos de envío (FR-CK2, FR-CK3) son consistentes entre sí en cuanto a datos de entrada requeridos? [Consistencia, Spec §FR-CK2, §FR-CK3]
- [ ] CHK022 - ¿Los requisitos de pago (FR-CK4, FR-CK5, FR-CK7) son consistentes en cuanto a información mostrada al usuario? [Consistencia, Spec §FR-CK4, §FR-CK5, §FR-CK7]
- [ ] CHK023 - ¿Los requisitos de orden (FR-OR1, FR-OR2, FR-OR3) son consistentes en cuanto a estructura de datos? [Consistencia, Spec §FR-OR1, §FR-OR2, §FR-OR3]
- [ ] CHK024 - ¿Los escenarios de aceptación de User Story 1 son consistentes con los requisitos funcionales FR-CT1 a FR-CT6? [Consistencia, Spec §User Story 1, §FR-CT1-CT6]
- [ ] CHK025 - ¿Los escenarios de aceptación de User Story 2 son consistentes con los requisitos funcionales FR-CK1 a FR-CK11? [Consistencia, Spec §User Story 2, §FR-CK1-CK11]
- [ ] CHK026 - ¿Los escenarios de aceptación de User Story 3 son consistentes con los requisitos funcionales FR-OR1 a FR-OR5? [Consistencia, Spec §User Story 3, §FR-OR1-OR5]
- [ ] CHK027 - ¿Los estados de transición en el data-model.md son consistentes con los estados mencionados en los requisitos? [Consistencia, Spec §FR-OR1, data-model.md]
- [ ] CHK028 - ¿Los campos del formulario de envío (FR-CK1) son consistentes con la dirección de envío almacenada (data-model.md)? [Consistencia, Spec §FR-CK1, data-model.md]

---

## Criterios de Aceptación

- [ ] CHK029 - ¿El SC-001 ("agregar productos en menos de 30 segundos") es medible y verificable? [Medibilidad, Spec §SC-001]
- [ ] CHK030 - ¿El SC-002 ("actualización en menos de 100ms") es medible y verificable? [Medibilidad, Spec §SC-002]
- [ ] CHK031 - ¿El SC-003 ("completar checkout en menos de 5 minutos") es medible y verificable? [Medibilidad, Spec §SC-003]
- [ ] CHK032 - ¿El SC-004 ("creación de orden en menos de 2 segundos") es medible y verificable? [Medibilidad, Spec §SC-004]
- [ ] CHK033 - ¿El SC-005 ("95% de usuarios completan sin errores") define cómo se mide el porcentaje? [Medibilidad, Spec §SC-005]
- [ ] CHK034 - ¿El SC-006 ("100% de cobertura de pruebas") define qué constituye "100% de escenarios"? [Medibilidad, Spec §SC-006]
- [ ] CHK035 - ¿Los criterios de éxito cubren todos los flujos principales (carrito, checkout, órdenes)? [Cobertura, Spec §Success Criteria]
- [ ] CHK036 - ¿Los criterios de éxito incluyen métricas de rendimiento para operaciones críticas? [Cobertura, Spec §Success Criteria]

---

## Cobertura de Escenarios

- [ ] CHK037 - ¿Los escenarios de aceptación cubren el flujo feliz completo de carrito → checkout → orden? [Cobertura, Spec §User Stories]
- [ ] CHK038 - ¿Los escenarios de aceptación cubren la modificación de cantidades en el carrito? [Cobertura, Spec §User Story 1]
- [ ] CHK039 - ¿Los escenarios de aceptación cubren la eliminación de ítems del carrito? [Cobertura, Spec §User Story 1]
- [ ] CHK040 - ¿Los escenarios de aceptación cubren todos los métodos de pago (Pago Móvil, Binance, Plan de Pagos)? [Cobertura, Spec §User Story 2]
- [ ] CHK041 - ¿Los escenarios de aceptación cubren la subida de comprobantes de pago? [Cobertura, Spec §User Story 2]
- [ ] CHK042 - ¿Los escenarios de aceptación cubren la creación de sub-órdenes por marca? [Cobertura, Spec §User Story 3]
- [ ] CHK043 - ¿Los escenarios de aceptación cubren el estado vacío del carrito? [Cobertura, Spec §User Story 1]
- [ ] CHK044 - ¿Los escenarios de aceptación cubren la personalización de productos KamCat en el carrito? [Cobertura, Spec §User Story 1]

---

## Cobertura de Edge Cases

- [ ] CHK045 - ¿Los edge cases definen comportamiento cuando el usuario tiene productos de ambas marcas y selecciona Plan de Pagos? [Cobertura, Spec §Edge Cases]
- [ ] CHK046 - ¿Los edge cases definen comportamiento cuando la tasa de cambio falla o no está disponible? [Cobertura, Spec §Edge Cases]
- [ ] CHK047 - ¿Los edge cases definen comportamiento cuando el comprobante de pago no coincide con el monto? [Cobertura, Spec §Edge Cases]
- [ ] CHK048 - ¿Los edge cases definen comportamiento cuando un producto se agota durante el checkout? [Cobertura, Spec §Edge Cases]
- [ ] CHK049 - ¿Los edge cases definen comportamiento cuando el usuario intenta pagar con un método no disponible? [Cobertura, Gap]
- [ ] CHK050 - ¿Los edge cases definen comportamiento cuando la referencia de pago ya existe? [Cobertura, Gap]
- [ ] CHK051 - ¿Los edge cases definen comportamiento cuando el archivo de comprobante está corrupto o no es legible? [Cobertura, Gap]
- [ ] CHK052 - ¿Los edge cases definen comportamiento cuando el usuario no está autenticado durante checkout? [Cobertura, Gap]

---

## Requisitos No Funcionales

- [ ] CHK053 - ¿Los requisitos de rendimiento (SC-002: <100ms) están definidos para todas las operaciones críticas del carrito? [Cobertura, Spec §SC-002]
- [ ] CHK054 - ¿Los requisitos de accesibilidad (WCAG 2.1 AA) están especificados para todos los componentes interactivos? [Cobertura, Gap]
- [ ] CHK055 - ¿Los requisitos de seguridad definen protección contra manipulación de precios en el carrito? [Cobertura, Gap]
- [ ] CHK056 - ¿Los requisitos de seguridad definen validación server-side de todos los cálculos de pago? [Cobertura, Gap]
- [ ] CHK057 - ¿Los requisitos de UX definen estados de carga para operaciones asíncronas? [Cobertura, Gap]
- [ ] CHK058 - ¿Los requisitos de UX definen mensajes de error específicos para cada tipo de fallo? [Cobertura, Gap]
- [ ] CHK059 - ¿Los requisitos de persistencia definen comportamiento cuando Supabase no está disponible? [Cobertura, Gap]
- [ ] CHK060 - ¿Los requisitos de rendimiento están definidos bajo condiciones de carga específicas? [Claridad, Spec §SC-001-SC-006]

---

## Dependencias y Supuestos

- [ ] CHK061 - ¿El supuesto de "Cloudinary o similar" (Assumptions) define requisitos mínimos del servicio de almacenamiento? [Claridad, Spec §Assumptions]
- [ ] CHK062 - ¿El supuesto de "tarifas predefinidas por empresa" (FR-CK3) define dónde se almacenan y cómo se actualizan? [Claridad, Spec §FR-CK3]
- [ ] CHK063 - ¿El supuesto de "número de referencia único por pago" (Assumptions) define la estrategia de unicidad? [Claridad, Spec §Assumptions]
- [ ] CHK064 - ¿Las dependencias con Supabase Auth están documentadas para todas las operaciones que requieren autenticación? [Cobertura, Gap]
- [ ] CHK065 - ¿Las dependencias con Cloudinary para upload de comprobantes están documentadas? [Cobertura, Gap]
- [ ] CHK066 - ¿Los supuestos sobre la configuración de moneda (USD) están validados? [Cobertura, Gap]

---

## Ambigüedades y Conflictos

- [ ] CHK067 - ¿Hay conflicto entre el método de cálculo de envío por peso (FR-CK3) y la ausencia de campo de peso en la tabla products (data-model.md)? [Conflicto, Spec §FR-CK3, data-model.md]
- [ ] CHK068 - ¿Hay conflicto entre el descuento de Binance del 5% (FR-CK5) y la afirmación de que se aplica "solo sobre productos, no sobre envío" (Assumptions)? [Conflicto, Spec §FR-CK5, §Assumptions]
- [ ] CHK069 - ¿Hay ambigüedad en qué tasa de cambio se usa cuando hay múltiples configuraciones en ExchangeRate? [Ambigüedad, data-model.md]
- [ ] CHK070 - ¿Hay ambigüedad en el comportamiento del Plan de Pagos cuando el usuario tiene productos de ambas marcas? [Ambigüedad, Spec §FR-CK6]
- [ ] CHK071 - ¿Hay conflicto entre el formato de número de orden "Marca(s)-Año-Sequential" y la generación automática en FR-OR1? [Conflicto, Spec §FR-OR1, §Assumptions]
- [ ] CHK072 - ¿Hay ambigüedad en quién puede verificar pagos cuando hay admin_hl y admin_kc? [Ambigüedad, Spec §payments.ts]

---

## Trazabilidad

- [ ] CHK073 - ¿Cada requisito funcional (FR-CT1 a FR-OR5) tiene al menos un escenario de aceptación asociado? [Trazabilidad, Spec §Requirements]
- [ ] CHK074 - ¿Cada criterio de éxito (SC-001 a SC-006) está vinculado a un requisito funcional específico? [Trazabilidad, Spec §Success Criteria]
- [ ] CHK075 - ¿Los edge cases están vinculados a requisitos funcionales o escenarios de aceptación? [Trazabilidad, Spec §Edge Cases]
- [ ] CHK076 - ¿Los supuestos están validados contra los requisitos funcionales? [Trazabilidad, Spec §Assumptions]
