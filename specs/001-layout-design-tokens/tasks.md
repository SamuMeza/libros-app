# Tasks: Layout Base y Sistema de Diseño

**Input**: Design documents from `/specs/001-layout-design-tokens/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md

**Tests**: Incluidos según especificación (Vitest)

**Organization**: Tareas agrupadas por user story para implementación y testing independiente.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Ejecutable en paralelo (archivos diferentes, sin dependencias)
- **[Story]**: User story a la que pertenece la tarea (US1, US2, US3, etc.)
- Incluir rutas exactas de archivos en las descripciones

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Next.js App Router**: `src/app/`, `src/components/`, `src/lib/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Inicialización del proyecto y estructura básica

- [ ] T001 Create styles directory structure in src/styles/
- [ ] T002 [P] Create components/layout directory in src/components/layout/
- [ ] T003 [P] Create components/shared directory in src/components/shared/
- [ ] T004 [P] Create lib/hooks directory in src/lib/hooks/
- [ ] T005 [P] Create tests/utils directory in tests/utils/
- [ ] T006 [P] Create tests/components directory in tests/components/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestructura core que DEBE completarse ANTES de cualquier user story

**⚠️ CRITICAL**: No se puede comenzar trabajo en user stories hasta completar esta fase

- [ ] T007 Create base CSS variables file in src/styles/brand-variables.css with :root definitions
- [ ] T008 [P] Implement dark mode media query in src/styles/brand-variables.css
- [ ] T009 [P] Add brand-hl and brand-kc utility classes in src/styles/brand-variables.css
- [ ] T010 Configure Playfair Display font via next/font in src/app/layout.tsx
- [ ] T011 [P] Configure Inter font via next/font in src/app/layout.tsx
- [ ] T012 [P] Create use-theme hook for dark mode persistence in src/lib/hooks/use-theme.ts
- [ ] T013 Import brand-variables.css in src/app/layout.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Design System Base (Priority: P1) 🎯 MVP

**Goal**: Establecer variables CSS, tipografía y modo oscuro como base para todos los componentes

**Independent Test**: Verificar que las variables CSS se aplican correctamente y el modo oscuro funciona

### Tests for User Story 1

- [ ] T014 [P] [US1] Create CSS token utilities test in tests/utils/css-tokens.test.ts
- [ ] T015 [P] [US1] Test brand color for HL in tests/utils/css-tokens.test.ts
- [ ] T016 [P] [US1] Test brand color for KC in tests/utils/css-tokens.test.ts
- [ ] T017 [P] [US1] Test dark mode variant in tests/utils/css-tokens.test.ts

### Implementation for User Story 1

- [ ] T018 [P] [US1] Define color tokens (HL, KC, semantic) in src/styles/brand-variables.css
- [ ] T019 [P] [US1] Define spacing tokens (space-1 to space-24) in src/styles/brand-variables.css
- [ ] T020 [P] [US1] Define border radius tokens in src/styles/brand-variables.css
- [ ] T021 [P] [US1] Define shadow tokens in src/styles/brand-variables.css
- [ ] T022 [US1] Add responsive typography variables in src/styles/brand-variables.css
- [ ] T023 [US1] Implement dark mode overrides in src/styles/brand-variables.css
- [ ] T024 [US1] Add transition utilities for theme switching in src/styles/brand-variables.css

**Checkpoint**: Design system base complete - all CSS variables and typography ready

---

## Phase 4: User Story 2 - Header Component (Priority: P2)

**Goal**: Implementar header fijo con branding dual, navegación y drawer mobile

**Independent Test**: Verificar que el header se muestra correctamente en desktop y mobile

### Tests for User Story 2

- [ ] T025 [P] [US2] Create header component test in tests/components/header.test.tsx
- [ ] T026 [P] [US2] Test branding with correct colors in tests/components/header.test.tsx
- [ ] T027 [P] [US2] Test mobile drawer toggle in tests/components/header.test.tsx
- [ ] T028 [P] [US2] Test cart badge count in tests/components/header.test.tsx
- [ ] T029 [P] [US2] Test navigation routes in tests/components/header.test.tsx

### Implementation for User Story 2

- [ ] T030 [P] [US2] Create Header component structure in src/components/layout/header.tsx
- [ ] T031 [P] [US2] Implement branding section with dual colors in src/components/layout/header.tsx
- [ ] T032 [P] [US2] Add desktop navigation with underline animation in src/components/layout/header.tsx
- [ ] T033 [US2] Implement mobile drawer with slide animation in src/components/layout/header.tsx
- [ ] T034 [US2] Add interactive badges (cart, theme toggle, search, favorites, account) in src/components/layout/header.tsx
- [ ] T035 [US2] Implement keyboard navigation and aria-labels in src/components/layout/header.tsx
- [ ] T036 [US2] Add backdrop-blur and fixed positioning in src/components/layout/header.tsx

**Checkpoint**: Header fully functional with desktop and mobile views

---

## Phase 5: User Story 3 - Footer Component (Priority: P3)

**Goal**: Implementar footer con 4 columnas responsivas y contenido completo

**Independent Test**: Verificar que el footer se muestra correctamente en todas las resoluciones

### Tests for User Story 3

- [ ] T037 [P] [US3] Create footer component test in tests/components/footer.test.tsx
- [ ] T038 [P] [US3] Test all column sections render in tests/components/footer.test.tsx
- [ ] T039 [P] [US3] Test social links display in tests/components/footer.test.tsx
- [ ] T040 [P] [US3] Test responsive behavior in tests/components/footer.test.tsx

### Implementation for User Story 3

- [ ] T041 [P] [US3] Create Footer component structure in src/components/layout/footer.tsx
- [ ] T042 [P] [US3] Implement brand column with logo and tagline in src/components/layout/footer.tsx
- [ ] T043 [P] [US3] Add quick links column in src/components/layout/footer.tsx
- [ ] T044 [P] [US3] Add legal links column in src/components/layout/footer.tsx
- [ ] T045 [P] [US3] Add contact and social media column in src/components/layout/footer.tsx
- [ ] T046 [US3] Implement responsive grid layout in src/components/layout/footer.tsx
- [ ] T047 [US3] Add copyright section at bottom in src/components/layout/footer.tsx

**Checkpoint**: Footer complete with all 4 columns and responsive behavior

---

## Phase 6: User Story 4 - ProductCard Component (Priority: P4)

**Goal**: Implementar card de producto reutilizable con soporte para ambas marcas

**Independent Test**: Verificar que la card muestra información correcta según marca

### Tests for User Story 4

- [ ] T048 [P] [US4] Create product-card component test in tests/components/product-card.test.tsx
- [ ] T049 [P] [US4] Test 3:4 ratio for HL books in tests/components/product-card.test.tsx
- [ ] T050 [P] [US4] Test 1:1 ratio for KC products in tests/components/product-card.test.tsx
- [ ] T051 [P] [US4] Test badge display for stock status in tests/components/product-card.test.tsx
- [ ] T052 [P] [US4] Test onAddToCart callback in tests/components/product-card.test.tsx

### Implementation for User Story 4

- [ ] T053 [P] [US4] Create ProductCard component structure in src/components/shared/product-card.tsx
- [ ] T054 [P] [US4] Define TypeScript interfaces for product and brand in src/components/shared/product-card.tsx
- [ ] T055 [P] [US4] Implement image container with aspect ratio in src/components/shared/product-card.tsx
- [ ] T056 [US4] Add dynamic badges (EN STOCK, POR ENCARGO, PERSONALIZABLE) in src/components/shared/product-card.tsx
- [ ] T057 [US4] Implement floating add-to-cart button in src/components/shared/product-card.tsx
- [ ] T058 [US4] Add product information section (brand, title, author/category, price) in src/components/shared/product-card.tsx
- [ ] T059 [US4] Implement hover effects with elevation and shadow in src/components/shared/product-card.tsx
- [ ] T060 [US4] Add accessibility attributes (alt text, aria-label) in src/components/shared/product-card.tsx

**Checkpoint**: ProductCard reusable across both brands with all required features

---

## Phase 7: User Story 5 - Transversal Components (Priority: P5)

**Goal**: Implementar Toast, Modal accesible y Skeletons de carga

**Independent Test**: Verificar que cada componente funciona correctamente de forma independiente

### Tests for User Story 5

- [ ] T061 [P] [US5] Create toast component test in tests/components/toast.test.tsx
- [ ] T062 [P] [US5] Test auto-dismiss after 5 seconds in tests/components/toast.test.tsx
- [ ] T063 [P] [US5] Test variant colors in tests/components/toast.test.tsx
- [ ] T064 [P] [US5] Test close button in tests/components/toast.test.tsx
- [ ] T065 [P] [US5] Create modal component test in tests/components/modal.test.tsx
- [ ] T066 [P] [US5] Test Escape key close in tests/components/modal.test.tsx
- [ ] T067 [P] [US5] Test focus trap in tests/components/modal.test.tsx
- [ ] T068 [P] [US5] Test body scroll prevention in tests/components/modal.test.tsx

### Implementation for User Story 5

- [ ] T069 [P] [US5] Create Toast component structure in src/components/shared/toast.tsx
- [ ] T070 [P] [US5] Implement toast variants (success, error, info) in src/components/shared/toast.tsx
- [ ] T071 [US5] Add auto-dismiss timer (5 seconds) in src/components/shared/toast.tsx
- [ ] T072 [US5] Implement stacking behavior (max 3 visible) in src/components/shared/toast.tsx
- [ ] T073 [P] [US5] Create Modal component structure in src/components/shared/modal.tsx
- [ ] T074 [P] [US5] Implement overlay with backdrop-blur in src/components/shared/modal.tsx
- [ ] T075 [US5] Add Escape key handler in src/components/shared/modal.tsx
- [ ] T076 [US5] Implement focus trap in src/components/shared/modal.tsx
- [ ] T077 [US5] Add body scroll prevention in src/components/shared/modal.tsx
- [ ] T078 [P] [US5] Create Skeleton component structure in src/components/shared/skeleton.tsx
- [ ] T079 [P] [US5] Implement product card skeleton with aspect ratios in src/components/shared/skeleton.tsx
- [ ] T080 [US5] Add pulse animation (2 seconds) in src/components/shared/skeleton.tsx

**Checkpoint**: All transversal components functional

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Mejoras que afectan múltiples user stories

- [ ] T081 [P] Run all unit tests and verify 100% pass rate
- [ ] T082 [P] Verify code coverage > 80% with vitest
- [ ] T083 [P] Run lint check and fix any issues
- [ ] T084 Verify no px values used in any component (only rem, em, vw, vh, %)
- [ ] T085 Test dark mode persistence across page reloads
- [ ] T086 Verify responsive behavior at all breakpoints
- [ ] T087 Test keyboard navigation for all interactive elements
- [ ] T088 Verify WCAG 2.1 AA compliance with Lighthouse accessibility audit (score >90)
- [ ] T089 Run quickstart.md validation scenarios

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4 → P5)
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Depends on US1 for CSS tokens
- **User Story 5 (P5)**: Can start after Foundational (Phase 2) - Independent of other stories

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Models/types before components
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel
- All tests for a user story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Create CSS token utilities test in tests/utils/css-tokens.test.ts"
Task: "Test brand color for HL in tests/utils/css-tokens.test.ts"
Task: "Test brand color for KC in tests/utils/css-tokens.test.ts"
Task: "Test dark mode variant in tests/utils/css-tokens.test.ts"

# Launch all CSS token implementations together:
Task: "Define color tokens in src/styles/brand-variables.css"
Task: "Define spacing tokens in src/styles/brand-variables.css"
Task: "Define border radius tokens in src/styles/brand-variables.css"
Task: "Define shadow tokens in src/styles/brand-variables.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Design System Base)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Story 5 → Test independently → Deploy/Demo
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Design System)
   - Developer B: User Story 2 (Header)
   - Developer C: User Story 3 (Footer)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
