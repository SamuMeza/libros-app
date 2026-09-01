# Tasks: Catálogo y Personalización KamCat

**Input**: Design documents from `/specs/004-kamcat-catalog-customization/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), data-model.md, contracts/

---

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure per implementation plan (src/components/products/, src/lib/actions/, src/types/)
- [ ] T002 [P] Create TypeScript interfaces in src/types/product.ts (Product, Category, Variant, CustomizationOption)
- [ ] T003 [P] Create Supabase client helpers in src/lib/supabase/server.ts and client.ts (if not exists)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [ ] T004 Implement Server Action getProducts in src/lib/actions/products.ts
- [ ] T005 [P] Implement Server Action getProductBySlug in src/lib/actions/products.ts
- [ ] T006 [P] Implement Server Action getProductCategories in src/lib/actions/products.ts
- [ ] T007 [P] Implement Server Action calculateProductPrice in src/lib/actions/products.ts
- [ ] T008 [P] Create price calculation helper in src/lib/utils/product-helpers.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Catálogo con Filtros (Priority: P1) 🎯 MVP

**Goal**: Users can browse KamCat products with category filters, search, and pagination

**Independent Test**: Navigate to /kamcat, verify products load, filters work, search returns results, pagination functions

### Implementation for User Story 1

- [ ] T009 [P] [US1] Create ProductCard component in src/components/products/product-card.tsx
- [ ] T010 [P] [US1] Create FilterSidebar component in src/components/shared/filter-sidebar.tsx (reutilizable para futuras features)
- [ ] T011 [P] [US1] Create Pagination component in src/components/shared/pagination.tsx
- [ ] T012 [US1] Create catalog page in src/app/(shop)/kamcat/page.tsx (Server Component)
- [ ] T013 [US1] Integrate filters with URL search params in src/app/(shop)/kamcat/page.tsx
- [ ] T014 [US1] Add skeleton loading states in src/app/(shop)/kamcat/page.tsx
- [ ] T015 [US1] Add empty state message in src/app/(shop)/kamcat/page.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Detalle de Producto (Priority: P2)

**Goal**: Users can view product details with image gallery and variant selection

**Independent Test**: Navigate to /kamcat/[slug], verify product details load, images display, variant chips work, breadcrumb shows

### Implementation for User Story 2

- [ ] T016 [P] [US2] Create VariantSelector component in src/components/products/variant-selector.tsx
- [ ] T017 [US2] Create product detail page in src/app/(shop)/kamcat/[slug]/page.tsx (Server Component)
- [ ] T018 [US2] Add dynamic metadata generation in src/app/(shop)/kamcat/[slug]/page.tsx
- [ ] T019 [US2] Add breadcrumb navigation in src/app/(shop)/kamcat/[slug]/page.tsx
- [ ] T020 [US2] Add image gallery with thumbnails in src/app/(shop)/kamcat/[slug]/page.tsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Personalización y Precio (Priority: P3)

**Goal**: Users can customize products with text and see reactive price calculation

**Independent Test**: On product detail page, enter customization text, select variants, verify price updates reactively

### Implementation for User Story 3

- [ ] T021 [P] [US3] Create CustomizationForm component in src/components/products/customization-form.tsx
- [ ] T022 [P] [US3] Create PriceDisplay component in src/components/products/price-display.tsx
- [ ] T023 [US3] Integrate VariantSelector with price calculation in src/app/(shop)/kamcat/[slug]/page.tsx
- [ ] T024 [US3] Integrate CustomizationForm in src/app/(shop)/kamcat/[slug]/page.tsx
- [ ] T025 [US3] Add "Add to Cart" button in src/app/(shop)/kamcat/[slug]/page.tsx

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T026 [P] Add WCAG 2.1 AA accessibility attributes across all components (aria-labels, roles, keyboard nav)
- [ ] T027 [P] Add responsive design for mobile (sidebar drawer overlay, grid columns)
- [ ] T028 [P] Add error boundary for failed price calculations with visual fallback
- [ ] T029 [P] Run performance validation: search <500ms, catalog <2s, detail <1.5s, price calc <100ms
- [ ] T030 [P] Run WCAG 2.1 AA audit with keyboard navigation and screen reader testing
- [ ] T031 Run quickstart.md validation scenarios

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all components for User Story 1 together:
Task: "Create ProductCard component in src/components/products/product-card.tsx"
Task: "Create FilterSidebar component in src/components/shared/filter-sidebar.tsx"
Task: "Create Pagination component in src/components/shared/pagination.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence

---

## Phase 7: Convergence

**Purpose**: Close gaps between spec/plan and current implementation

- [ ] T032 Create SearchBar component in src/components/shared/search-bar.tsx with debounce (100ms) per spec 3.1 (missing)
- [ ] T033 Create SortSelector component in src/components/shared/sort-selector.tsx per spec 3.1 (missing)
- [ ] T034 Fix getProductBySlug to query by id instead of slug in src/lib/actions/products.ts per data-model (missing)
- [ ] T035 Implement URL-based filter state in src/app/(shop)/kamcat/page.tsx to connect FilterSidebar with search params per spec 3.1 (partial)
- [ ] T036 Implement URL-based pagination in src/app/(shop)/kamcat/page.tsx to connect Pagination with search params per spec 3.1 (partial)
- [ ] T037 Add interactive image switching in src/app/(shop)/kamcat/[slug]/page.tsx to make thumbnails switch main image per spec 3.2 (partial)
