# Tasks: Autenticación, Roles y Perfiles

**Input**: Design documents from `/specs/002-auth-roles-profiles/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Tests**: Tests are OPTIONAL — only include them if explicitly requested en el spec (§3.7 los solicita).

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

**Purpose**: Tipos, utilidades base y clientes Supabase

- [ ] T001 Create types in src/types/auth.ts (UserRole, AuthResponse) per data-model.md
- [ ] T002 [P] Create types in src/types/profile.ts (Profile, Address, PhoneFormat) per data-model.md
- [ ] T003 [P] Create type guard isValidEmail in src/lib/utils/validators.ts per research.md §8
- [ ] T004 [P] Create type guard isValidRole in src/lib/utils/validators.ts per research.md §9
- [ ] T005 Create Supabase browser client in src/lib/supabase/client.ts per research.md §1
- [ ] T006 [P] Create Supabase server client in src/lib/supabase/server.ts per research.md §1

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Server Actions de autenticación — bloquean UI de auth y profile

**⚠️ CRITICAL**: No auth screen work can begin until this phase is complete

- [ ] T007 [AuthBE] Implement signIn Server Action in src/lib/actions/sign-in.ts (email, password, rememberMe) per spec §3.3
- [ ] T008 [AuthBE] Implement signUp Server Action in src/lib/actions/sign-up.ts (email, password, fullName) with auto profile creation per spec §3.3 + §3.4
- [ ] T009 [AuthBE] Implement signOut Server Action in src/lib/actions/sign-out.ts per spec §3.3
- [ ] T010 [AuthBE] Implement resetPassword Server Action in src/lib/actions/reset-password.ts per spec §3.3

**Checkpoint**: Server Actions functional — auth flow backend ready

---

## Phase 3: User Story 1 — Auth Screens (Priority: P1) 🎯 MVP

**Goal**: Login, Register, Forgot Password screens with validation and loading states

**Independent Test**: Navigate to /login, /register, /forgot-password and verify forms render with correct layout per spec §3.1

### Implementation for User Story 1

- [ ] T011 [P] [US1] Create auth layout in src/app/(auth)/layout.tsx (sin header/footer, route group)
- [ ] T012 [P] [US1] Create loading overlay component in src/components/auth/loading-overlay.tsx per spec §3.1 (fondo difuminado, sin spinner genérico)
- [ ] T013 [P] [US1] Create auth form shared component in src/components/auth/auth-form.tsx (tarjeta centrada max-w-[440px], inputs, botones) per spec §3.1
- [ ] T014 [US1] Create login page in src/app/(auth)/login/page.tsx (email, password, Recordarme, OAuth Google, links) per spec §3.1
- [ ] T015 [US1] Create register page in src/app/(auth)/register/page.tsx (fullName, email, password, confirm password) per spec §3.1
- [ ] T016 [US1] Create forgot-password page in src/app/(auth)/forgot-password/page.tsx (email, mensaje confirmación) per spec §3.1
- [ ] T017 [US1] Create auth error page in src/components/auth/error-page.tsx (reintentar + WhatsApp) per spec §3.2

**Checkpoint**: Auth screens functional with validation and loading states

---

## Phase 4: User Story 2 — Route Protection Middleware (Priority: P1)

**Goal**: Middleware that protects /admin, /perfil, /checkout routes based on role

**Independent Test**: Access /admin as customer → redirect to /. Access /perfil without session → redirect to /login.

### Implementation for User Story 2

- [ ] T018 [US2] Create middleware in src/lib/supabase/middleware.ts (session verification, role check) per spec §3.6
- [ ] T019 [US2] Register middleware in src/middleware.ts (Next.js middleware config) per plan.md
- [ ] T020 [US2] Implement admin route isolation (admin_hl → /admin/libros, admin_kc → /admin/productos) per spec §3.6

**Checkpoint**: Route protection functional — role-based access control working

---

## Phase 5: User Story 3 — Profile Management (Priority: P2)

**Goal**: User can edit name, phone, and manage shipping addresses

**Independent Test**: Login → navigate to /perfil → edit name → verify changes saved. Add address → mark as default.

### Implementation for User Story 3

- [ ] T021 [P] [US3] Create phone input component in src/components/ui/phone-input.tsx (VE +58 / Internacional selector) per spec §3.5
- [ ] T022 [US3] Create profile page in src/app/(shop)/perfil/page.tsx (edit name, phone) per spec §3.5
- [ ] T023 [US3] Implement address CRUD in src/app/(shop)/perfil/page.tsx (add, edit, delete, is_default) per spec §3.5
- [ ] T024 [US3] Create address form component in src/components/profile/address-form.tsx per data-model.md Address entity
- [ ] T024b [US3] Verify addresses table RLS policies are active (SELECT, INSERT, UPDATE, DELETE per user_id) per data-model.md

**Checkpoint**: Profile management functional — user can edit info and manage addresses

---

## Phase 6: User Story 4 — Unit Tests (Priority: P2)

**Goal**: Test coverage for Server Actions, validators, and middleware

**Independent Test**: Run `bun test` and verify all tests pass with >80% coverage per spec §4

### Tests for User Story 4

- [ ] T025 [P] [US4] Create validator tests in tests/unit/validators.test.ts (isValidEmail, isValidRole) per spec §3.7
- [ ] T026 [P] [US4] Create auth action tests in tests/unit/auth-actions.test.ts (signIn, signUp, signOut, resetPassword) per spec §3.7
- [ ] T027 [P] [US4] Create middleware tests in tests/unit/middleware.test.ts (role verification, redirects) per spec §3.7

**Checkpoint**: Test suite passing — >80% coverage achieved

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final adjustments and documentation

- [ ] T028 Verify accessibility (keyboard navigation, aria-labels) in all auth screens per spec §3.1
- [ ] T029 Verify all error messages are in Spanish per spec §3.1
- [ ] T030 Run quickstart.md validation scenarios per quickstart.md
- [ ] T031 [P] Update docs/REQUIREMENTS.md with auth module status

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion (T001-T006) — BLOCKS all user stories
- **US1 Auth Screens (Phase 3)**: Depends on Foundational (Phase 2) completion
- **US2 Middleware (Phase 4)**: Depends on Foundational (Phase 2) completion — can run parallel with US1
- **US3 Profile (Phase 5)**: Depends on Foundational (Phase 2) completion — can run parallel with US1/US2
- **US4 Tests (Phase 6)**: Depends on US1, US2, US3 completion
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 Auth Screens (P1)**: Can start after Foundational (Phase 2) — No dependencies on other stories
- **US2 Middleware (P1)**: Can start after Foundational (Phase 2) — Independent of US1
- **US3 Profile (P2)**: Can start after Foundational (Phase 2) — Independent of US1/US2
- **US4 Tests (P2)**: Depends on US1 + US2 + US3 being complete

### Within Each User Story

- Components before pages (if pages depend on components)
- Server Actions before UI (UI calls Server Actions)
- Core implementation before integration

### Parallel Opportunities

- T002, T003, T004 (types + validators) can run in parallel in Setup
- T005, T006 (Supabase clients) can run in parallel in Setup
- T011, T012, T013 (auth layout, loading, form) can run in parallel in US1
- US1 (Phase 3) and US2 (Phase 4) can run in parallel after Foundational
- US3 (Phase 5) can run in parallel with US1 and US2
- T025, T026, T027 (tests) can run in parallel in US4

---

## Parallel Example: User Story 1

```bash
# Launch all US1 components together:
Task: "Create auth layout in src/app/(auth)/layout.tsx"
Task: "Create loading overlay in src/components/auth/loading-overlay.tsx"
Task: "Create auth form in src/components/auth/auth-form.tsx"

# Then pages (depend on components):
Task: "Create login page in src/app/(auth)/login/page.tsx"
Task: "Create register page in src/app/(auth)/register/page.tsx"
Task: "Create forgot-password page in src/app/(auth)/forgot-password/page.tsx"
```

---

## Implementation Strategy

### MVP First (US1 + US2 Auth Flow)

1. Complete Phase 1: Setup (types, validators, clients)
2. Complete Phase 2: Foundational (Server Actions)
3. Complete Phase 3: US1 Auth Screens
4. Complete Phase 4: US2 Middleware
5. **STOP and VALIDATE**: Login/Register/Forgot Password working with role protection
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add US1 Auth Screens + US2 Middleware → Test independently → Deploy/Demo (MVP!)
3. Add US3 Profile Management → Test independently → Deploy/Demo
4. Add US4 Tests → Coverage target met
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: US1 Auth Screens
   - Developer B: US2 Middleware (can start immediately)
   - Developer C: US3 Profile Management (can start immediately)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All Server Actions use `export default` per constitution §2.7
- All CSS uses relative units (rem, em, vw, vh, %) per constitution §2.5
- Validations use manual checks + type guards, no zod per constitution §2.4
