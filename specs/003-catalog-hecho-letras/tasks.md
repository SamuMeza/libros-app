# Tasks: Catálogo y Detalle de Libros (Hecho Letras)

**Input**: Design documents from `/specs/003-catalog-hecho-letras/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Tests**: Tests are OPTIONAL — solo incluir si se solicitan explícitamente en el spec (§3.7 no los solicita para esta feature).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths follow plan.md structure: Next.js App Router

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Tipos, utilidades base y helpers

- [X] T001 Create types in src/types/books.ts (Book, BookStatus, StockStatus, BookSort, BookFilters, BookListResult, BookExtra, BookExtraWithProduct, ContactRequest) per data-model.md
- [X] T002 [P] Create slug generation helper in src/lib/utils/slug-helpers.ts (generateSlug, slug collision handling) per research.md §2
- [X] T003 [P] Create search helper in src/lib/utils/search-helpers.ts (FTS query builder, ts_rank) per research.md §1

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Server Actions de libros — bloquean UI de catálogo, detalle y formulario

**⚠️ CRITICAL**: No catalog/detail work can begin until this phase is complete

- [X] T004 Implement getBooks Server Action in src/lib/actions/get-books.ts (filtros combinados, búsqueda FTS, ordenamiento, paginación) per spec §3.4
- [X] T005 [P] Implement getBookBySlug Server Action in src/lib/actions/get-book-by-slug.ts (libro con categoría y extras) per spec §3.4
- [X] T006 [P] Implement getBookExtras Server Action in src/lib/actions/get-book-extras.ts (extras ordenados por sort_order) per spec §3.4
- [X] T007 [P] Implement submitBookRequest Server Action in src/lib/actions/submit-book-request.ts (validación, user_id opcional) per spec §3.3 + §3.4

**Checkpoint**: Server Actions functional — data fetching backend ready

---

## Phase 3: User Story 1 — Catálogo de Libros (Priority: P1) 🎯 MVP

**Goal**: Los usuarios pueden explorar el catálogo con filtros, búsqueda, ordenamiento y paginación

**Independent Test**: Navegar a `/libros`, verificar que se muestran libros, aplicar filtros, buscar, cambiar orden, paginar

### Implementation for User Story 1

- [X] T008 [P] [US1] Create book card component in src/components/books/book-card.tsx (imagen, título, autor, precio, badge) per spec §3.1
- [X] T009 [P] [US1] Create skeleton book card in src/components/shared/skeleton-book-card.tsx — render 24 skeletons matching final layout per spec §3.1 CA-12
- [X] T010 [P] [US1] Create empty state component in src/components/shared/empty-state.tsx per spec §3.1
- [X] T011 [P] [US1] Create filter sidebar component in src/components/shared/filter-sidebar.tsx (categorías con recuento, precio, disponibilidad, sticky, drawer mobile) per spec §3.1
- [X] T012 [P] [US1] Create search bar component in src/components/shared/search-bar.tsx (debounce 500ms) per spec §3.1
- [X] T013 [P] [US1] Create sort selector component in src/components/shared/sort-selector.tsx (5 opciones) per spec §3.1
- [X] T014 [P] [US1] Create pagination component in src/components/shared/pagination.tsx (botones 40px, estado activo) per spec §3.1
- [X] T015 [US1] Create catalog page in src/app/(shop)/libros/page.tsx (Server Component, grid 4/3/2 cols, filtros en URL, loading states) per spec §3.1

**Checkpoint**: Catálogo funcional — browsable con filtros, búsqueda, orden y paginación

---

## Phase 4: User Story 2 — Detalle de Libro (Priority: P1)

**Goal**: Los usuarios pueden ver el detalle completo de un libro con galería, extras, cantidad e información

**Independent Test**: Navegar a `/libros/[slug]`, verificar galería, extras, cantidad, acordeones, metadata SEO

### Implementation for User Story 2

- [X] T016 [P] [US2] Create book gallery component in src/components/books/book-gallery.tsx (imagen principal 2:3, miniaturas 80px, transición) per spec §3.2
- [X] T017 [P] [US2] Create book extras component in src/components/books/book-extras.tsx (checkboxes, precio adicional, is_default) per spec §3.2
- [X] T018 [P] [US2] Create book quantity component in src/components/books/book-quantity.tsx (control -/1+, max 10, editable) per spec §3.2
- [X] T019 [P] [US2] Create book accordions component in src/components/books/book-accordions.tsx (envío, pago, cuotas) per spec §3.2
- [X] T020 [P] [US2] Create accordion base component in src/components/ui/accordion.tsx per spec §3.2
- [X] T021 [P] [US2] Create breadcrumb component in src/components/ui/breadcrumb.tsx per spec §3.2
- [X] T022 [US2] Create book detail page in src/app/(shop)/libros/[slug]/page.tsx (Server Component, generateMetadata, galería, info, extras, quantity, accordions) per spec §3.2

**Checkpoint**: Detalle de libro funcional — galería, extras, cantidad e información completa

---

## Phase 5: User Story 3 — Formulario de Solicitud (Priority: P2)

**Goal**: Los usuarios pueden solicitar libros no catalogados desde la página de catálogo

**Independent Test**: Ir al final de `/libros`, llenar formulario, enviar, verificar confirmación

### Implementation for User Story 3

- [X] T023 [US3] Create book request form component in src/components/books/book-request-form.tsx (campos, validación, contador 500 chars, pre-fill para autenticados) per spec §3.3
- [X] T024 [US3] Integrate book request form into catalog page in src/app/(shop)/libros/page.tsx (sección después de paginación) per spec §3.3

**Checkpoint**: Formulario de solicitud funcional — accesible para autenticados y anónimos

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Ajustes finales, accesibilidad y SEO

- [X] T025 Run quickstart.md validation scenarios per quickstart.md
- [X] T026 Verify accessibility (keyboard navigation, aria-labels) in all catalog and detail components per spec §3.1 + §3.2
- [X] T027 Verify SEO metadata (generateMetadata, Open Graph) in detail page per spec §3.2
- [X] T028 Verify all error messages are in Spanish per spec §3.1 + §3.2
- [X] T029 Measure performance against SC-01 to SC-04: Búsqueda <500ms, Catálogo <2s, Detalle <1.5s, Paginación <300ms (Lighthouse ad-hoc o timing manual, sin infraestructura CI)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion (T001-T003) — BLOCKS all user stories
- **US1 Catálogo (Phase 3)**: Depends on Foundational (Phase 2) completion
- **US2 Detalle (Phase 4)**: Depends on Foundational (Phase 2) completion — can run parallel with US1
- **US3 Formulario (Phase 5)**: Depends on Foundational (Phase 2) + US1 completion (se integra en catálogo)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 Catálogo (P1)**: Can start after Foundational (Phase 2) — No dependencies on other stories
- **US2 Detalle (P1)**: Can start after Foundational (Phase 2) — Independent of US1
- **US3 Formulario (P2)**: Depends on US1 (se integra en página de catálogo)

### Within Each User Story

- Components before pages (if pages depend on components)
- Server Actions before UI (UI calls Server Actions)
- Core implementation before integration

### Parallel Opportunities

- T002, T003 (helpers) can run in parallel in Setup
- T005, T006, T007 (Server Actions) can run in parallel in Foundational
- T008-T014 (US1 components) can run in parallel in US1
- T016-T021 (US2 components) can run in parallel in US2
- US1 (Phase 3) and US2 (Phase 4) can run in parallel after Foundational

---

## Parallel Example: User Story 1

```bash
# Launch all US1 components together:
Task: "Create book card in src/components/books/book-card.tsx"
Task: "Create skeleton card in src/components/shared/skeleton-book-card.tsx"
Task: "Create empty state in src/components/shared/empty-state.tsx"
Task: "Create filter sidebar in src/components/shared/filter-sidebar.tsx"
Task: "Create search bar in src/components/shared/search-bar.tsx"
Task: "Create sort selector in src/components/shared/sort-selector.tsx"
Task: "Create pagination in src/components/shared/pagination.tsx"

# Then page (depends on components):
Task: "Create catalog page in src/app/(shop)/libros/page.tsx"
```

---

## Implementation Strategy

### MVP First (US1 + US2 Auth Flow)

1. Complete Phase 1: Setup (types, helpers)
2. Complete Phase 2: Foundational (Server Actions)
3. Complete Phase 3: US1 Catálogo
4. Complete Phase 4: US2 Detalle
5. **STOP and VALIDATE**: Catálogo y detalle funcionando con Server Actions
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add US1 Catálogo + US2 Detalle → Test independently → Deploy/Demo (MVP!)
3. Add US3 Formulario → Test independently → Deploy/Demo
4. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: US1 Catálogo
   - Developer B: US2 Detalle (can start immediately)
3. US3 Formulario integrates into US1 after both complete

---

## Phase 7: Convergence

**Purpose**: Brechas entre implementación actual y spec/plan — interactividad, robustez y Cumplimiento

- [X] T030 CRITICAL Crear componente client wrapper `src/components/books/catalog-client.tsx` con `useRouter`/`useSearchParams` para manejar interactivity de filtros, búsqueda, orden y paginación — conectar callbacks vacíos en `page.tsx` (F1, US1)
- [X] T031 CRITICAL Crear componente client wrapper `src/components/books/book-detail-client.tsx` con estado para extras seleccionados y cantidad — conectar callbacks vacíos en `[slug]/page.tsx` (F2, US2)
- [X] T032 HIGH Agregar `generateMetadata` a `src/app/(shop)/libros/page.tsx` con título "Libros — Hecho Letras" y descripción estática de 160 chars (F3, spec §3.1)
- [X] T033 HIGH Poblar categorías desde Supabase en el Server Component del catálogo y pasarlas al `FilterSidebar` con recuento de libros por categoría (F4, spec §3.1)
- [X] T034 HIGH Agregar `onError` handler en `book-gallery.tsx` para mostrar imagen fallback genérica cuando una imagen falla al cargar (F5, spec §3.2 CA-10)
- [X] T035 HIGH Filtrar en `book-extras.tsx` los extras donde `products` es null (producto inexistente) — omitir silenciosamente antes de renderizar (F6, spec §3.2 Q12)
- [X] T036 HIGH Agregar campo "Nombre del solicitante" (obligatorio) al `book-request-form.tsx`, implementar pre-fill desde perfil de usuario autenticado, y agregar botón reintentar en error de red preservando datos (F7, spec §3.3)
- [X] T037 HIGH Implementar estado de loading en `page.tsx` del catálogo mostrando 24 `SkeletonBookCard` durante carga inicial y cambio de filtros (F8, spec §3.1 CA-14)
- [X] T038 MEDIUM Actualizar mensaje de error en catálogo a "No pudimos cargar el catálogo. Verifica tu conexión e intenta de nuevo." con botón de reintentar funcional (F9, spec §3.1 CA-10)
- [X] T039 MEDIUM Agregar botón "Limpiar filtros" al `EmptyState` del catálogo que resetee todos los parámetros de URL (F10, spec §3.1 CA-9)
- [X] T040 MEDIUM Actualizar mensaje de error en `book-request-form.tsx` a "No pudimos enviar tu solicitud. Intenta de nuevo." con botón reintentar que preserve datos del formulario (F11, spec §3.3 CA-6)

---

## Phase 8: Convergence

**Purpose**: Integración de BookDetailClient en página de detalle, persistencia de requester_name y accesibilidad

- [X] T041 CRITICAL Integrar `BookDetailClient` en `src/app/(shop)/libros/[slug]/page.tsx` — reemplazar el bloque de extras/quantity/button (líneas 132-153) con `<BookDetailClient extras={extras} bookStatus={book.status} />` para conectar estado real de extras seleccionados, cantidad y botón agregar al carrito (F1, spec §3.2 CA-7, CA-8, CA-9)
- [X] T042 HIGH Agregar columna `requester_name TEXT` a tabla `contact_requests` en `docs/DATABASE.md` y actualizar Server Action `src/lib/actions/submit-book-request.ts` para insertar `requester_name` en el INSERT (F2, spec §3.3 CA-11)
- [X] T043 MEDIUM Agregar `role="img"`, `aria-label` a imagen principal y `aria-current="true"` a miniatura seleccionada en `src/components/books/book-gallery.tsx` (F3, spec §3.2 CA-13)
- [X] T044 MEDIUM Verificar y agregar `aria-expanded` a acordeones en `src/components/books/book-accordions.tsx` si no está presente (F4, spec §3.2 CA-13)
- [X] T045 LOW Eliminar función muerta `handleClearFilters` de `src/components/books/catalog-client.tsx` o conectarla a un botón visible (F5, cleanup)

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All Server Actions use `export default` per constitution §2.7
- All CSS uses relative units (rem, em, vw, vh, %) per constitution §2.5
- Validations use manual checks + type guards, no zod per constitution §2.4
