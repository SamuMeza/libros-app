# Requirements Quality Checklist: Panel Administrativo y Tracking

**Purpose**: Validate specification completeness, clarity, and consistency before proceeding to planning
**Created**: 2026-08-27
**Feature**: [Link to spec.md](../spec.md)

## Requirement Completeness

- [ ] CHK001 - Are all user roles (admin_hl, admin_kc, superadmin, customer) explicitly defined with their capabilities? [Completeness, Spec §FR-SB1-SB4]
- [ ] CHK002 - Are the exact sidebar navigation items specified for each role? [Completeness, Spec §FR-SB2-SB4]
- [ ] CHK003 - Are all payment methods (Pago Móvil, Binance, Cuotas) covered in the verification flow? [Completeness, Spec §FR-PV2]
- [ ] CHK004 - Are email notification requirements defined for all status transitions? [Completeness, Spec §FR-PM12]
- [ ] CHK005 - Are loading state requirements defined for asynchronous data operations (tables, drawers)? [Gap]
- [ ] CHK006 - Are empty state requirements defined for /pagos, /pedidos, and /pedidos (shop)? [Gap, Spec §Edge Cases]
- [ ] CHK007 - Are error state requirements defined for failed API calls during payment verification? [Gap]
- [ ] CHK008 - Are confirmation dialog requirements defined before approve/reject actions? [Gap, Spec §FR-PV5-PV6]

## Requirement Clarity

- [ ] CHK009 - Is "alta resolución" quantified with specific resolution or sizing criteria? [Clarity, Spec §FR-PV3]
- [ ] CHK010 - Is "zoom" defined with specific zoom level or interaction pattern? [Clarity, Spec §FR-PV3]
- [ ] CHK011 - Is "motivo obligatorio" for rejection specified with minimum/maximum length? [Clarity, Spec §FR-PV6]
- [ ] CHK012 - Is "mensaje de error explicativo" for invalid transitions defined with specific messaging requirements? [Clarity, Spec §FR-PM8]
- [ ] CHK013 - Are the exact email fields/sections defined for status change notifications? [Gap, Spec §FR-PM12]
- [ ] CHK014 - Is "rango de fechas" for filters defined with date picker format and default range? [Clarity, Spec §FR-PV2]
- [ ] CHK015 - Is "timeline vertical" defined with specific layout, spacing, and visual hierarchy? [Clarity, Spec §FR-CL2]
- [ ] CHK016 - Is "drawer" behavior defined (width, animation, close behavior)? [Clarity, Spec §FR-PM2]

## Requirement Consistency

- [ ] CHK017 - Are state transition rules consistent between FR-PM8 and the Assumptions section? [Consistency, Spec §FR-PM8, §Assumptions]
- [ ] CHK018 - Are pagination requirements consistent between FR-PV9 and FR-PM13? [Consistency, Spec §FR-PV9, §FR-PM13]
- [ ] CHK019 - Are sidebar navigation items consistent with the specified pages (/pagos, /pedidos)? [Consistency, Spec §FR-SB2-SB4, §FR-PV1, §FR-PM1]
- [ ] CHK020 - Are email notification triggers consistent with all status changes mentioned in FR-PM12? [Consistency, Spec §FR-PM12]
- [ ] CHK021 - Are RLS policies (from DATABASE.md) aligned with sidebar navigation restrictions? [Consistency, Assumptions]
- [ ] CHK022 - Are "Cuotas" payment method options consistent between FR-PV2 and spec 005 (Plan de Pagos)? [Consistency, Cross-spec]

## Acceptance Criteria Quality

- [ ] CHK023 - Can SC-001 ("2 minutos") be objectively measured with timing tools? [Measurability, Spec §SC-001]
- [ ] CHK024 - Can SC-004 ("95% de pagos verificados correctamente") be tracked with analytics? [Measurability, Spec §SC-004]
- [ ] CHK025 - Can SC-005 ("100% de transiciones inválidas rechazadas") be verified via test suite? [Measurability, Spec §SC-005]
- [ ] CHK026 - Are acceptance scenarios testable with Given/When/Then format for all user stories? [Coverage, Spec §User Scenarios]
- [ ] CHK027 - Are success criteria technology-agnostic (no framework/tool references)? [Measurability, Spec §SC-001-SC-006]

## Scenario Coverage

- [ ] CHK028 - Are primary flows covered: admin verifies payment, admin manages order, client views history? [Coverage]
- [ ] CHK029 - Are alternate flows covered: admin rejects payment, admin adds tracking note? [Coverage]
- [ ] CHK030 - Are exception flows covered: invalid state transition, payment amount mismatch? [Coverage, Spec §Edge Cases]
- [ ] CHK031 - Are recovery flows covered: client uploads new proof after rejection? [Coverage, Spec §FR-PV8]
- [ ] CHK032 - Are concurrent admin scenarios addressed (two admins viewing same order)? [Gap]
- [ ] CHK033 - Are cross-role access scenarios addressed (admin_hl accessing KC data)? [Coverage, Spec §Edge Cases]

## Edge Case Coverage

- [ ] CHK034 - Is the behavior when payment amount doesn't match order amount defined? [Edge Case, Spec §Edge Cases]
- [ ] CHK035 - Is the behavior when client has no orders defined (empty state)? [Edge Case, Spec §Edge Cases]
- [ ] CHK036 - Is the behavior when sub-order has no payments defined? [Edge Case, Spec §Edge Cases]
- [ ] CHK037 - Is the behavior when admin tries to access unauthorized brand data defined? [Edge Case, Spec §Edge Cases]
- [ ] CHK038 - Is the behavior when Cloudinary upload fails during payment verification defined? [Gap]
- [ ] CHK039 - Is the behavior when email notification fails after status change defined? [Gap]
- [ ] CHK040 - Is the behavior when pagination exceeds total records defined (last page)? [Gap]

## Non-Functional Requirements

- [ ] CHK041 - Are WCAG 2.1 AA requirements specified for all interactive elements? [Coverage, Spec §FR-SB6]
- [ ] CHK042 - Are performance requirements defined for table rendering (pagination, filtering)? [Gap, Spec §SC-001-SC-003]
- [ ] CHK043 - Are accessibility requirements defined for keyboard navigation in drawers/modals? [Gap, Spec §FR-SB6]
- [ ] CHK044 - Are color contrast requirements defined for admin panel elements? [Gap, Spec §FR-SB6]
- [ ] CHK045 - Are focus management requirements defined for modal/drawer open/close? [Gap, Spec §FR-SB6, §FR-PM2]

## Dependencies & Assumptions

- [ ] CHK046 - Are dependencies on Cloudinary (file storage) documented with failure modes? [Dependency, Spec §Assumptions]
- [ ] CHK047 - Are dependencies on email service (notifications) documented? [Dependency, Spec §FR-PM12]
- [ ] CHK048 - Are RLS policies from DATABASE.md validated against sidebar navigation rules? [Dependency, Assumptions]
- [ ] CHK049 - Is the assumption "admin_hl solo puede gestionar sub-órdenes de la marca 'hl'" enforced by requirements? [Assumption, Spec §Assumptions]
- [ ] CHK050 - Are assumptions about client data sources (profiles, addresses) validated? [Assumption, Spec §Assumptions]

## Ambiguities & Conflicts

- [ ] CHK051 - Is the term "sub-orden" consistently used throughout the spec? [Consistency]
- [ ] CHK052 - Are there any conflicting requirements between admin and client views? [Conflict]
- [ ] CHK053 - Are there any undefined placeholders or TODO markers in the spec? [Ambiguity]
- [ ] CHK054 - Are all requirement IDs (FR-SB1, FR-PV1, etc.) unique and non-overlapping? [Traceability]
- [ ] CHK055 - Are all edge cases from the Edge Cases section addressed in functional requirements? [Traceability, Spec §Edge Cases]
