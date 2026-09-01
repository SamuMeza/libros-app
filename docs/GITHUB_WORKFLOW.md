# 🐙 Flujo de Trabajo Colaborativo en GitHub y Desarrollo con IA (SDD)

> Este documento detalla los estándares de integración y colaboración en equipo utilizando **Spec-Driven Development (SDD)** y herramientas de **GitHub**.

---

## 1. Fundamentos del Desarrollo con IA en Equipo

1. **Spec-Driven Development (SDD):**
   - El código **no se genera a ciegas** con prompts improvisados ("vibe coding").
   - Cada tarea nace de una especificación en `specs/` validada por el equipo antes de programar.
   - Las carpetas `.specify/` y `specs/` forman la fuente de verdad que guía a los agentes de IA (Cursor, Antigravity, OpenCode).

2. **Revisión Humana Obligatoria (Human-in-the-loop):**
   - Ningún código producido por IA se fusiona directamente a ramas protegidas.
   - Todo aporte pasa por **Code Review** humano obligatorio en GitHub.

---

## 2. Estrategia de Ramas en GitHub

```
main (Producción — 100% Estable)
  │
  ├── develop (Integración — staging)
  │     │
  │     ├── feature/001-layout-design-tokens
  │     ├── feature/002-auth-roles-profiles
  │     ├── feature/003-catalog-hecho-letras
  │     ├── feature/004-kamcat-catalog
  │     ├── feature/005-unified-cart-checkout
  │     ├── feature/006-admin-panels-tracking
  │     ├── fix/*     (correcciones específicas)
  │     └── refactor/* (mejoras de código sin cambio funcional)
  │
  └── hotfix/parche-urgente (PR directo a main → luego sync a develop)
```

---

## 3. Configuración de Protección de Ramas (GitHub Settings)

Se deben activar las siguientes reglas en el repositorio de GitHub (`Settings > Branches > Branch protection rules`):

### Para la rama `main` y `develop`:
- [x] **Require a pull request before merging:** Prohibido empujar código con `git push` directo.
- [x] **Require approvals (1 mínimo):** Ningún desarrollador puede auto-aprobar sus propios cambios.
- [x] **Dismiss stale pull request approvals when new commits are pushed:** Si se agregan nuevos commits al PR, la aprobación previa se invalida para exigir nueva revisión.
- [x] **Require branches to be up to date before merging:** Exige que la rama del PR contenga los últimos cambios de `develop` (vía `rebase`).
- [x] **Do not allow bypassing the above settings:** Aplica también a administradores del repositorio.
- [x] **Allow force pushes:** DESACTIVADO (prohibido).
- [x] **Allow deletions:** DESACTIVADO (prohibido).

---

## 4. Flujo de Trabajo Diario Paso a Paso

### Paso 1: Sincronizar y Crear Rama
```bash
git checkout develop
git pull origin develop
git checkout -b feature/nombre-de-la-feature
```

### Paso 2: Desarrollo Guiado por Specs y Testing
1. Generar/actualizar la especificación correspondiente en `specs/`.
2. Escribir tests unitarios iniciales con `vitest` (TDD).
3. Desarrollar la funcionalidad respetando `AGENTS.md` (sin `zod`, unidades relativas CSS, Server Components).
4. Ejecutar validaciones locales antes de subir:
```bash
bun test
bun run lint
```

### Paso 3: Commits Narrativos
```bash
git add .
git commit -m "feat(books): implementar catalogo con filtros por genero y stock"
git push -u origin feature/nombre-de-la-feature
```

### Paso 4: Rebase y Creación de Pull Request
Antes de abrir el PR o cuando `develop` tenga nuevos cambios:
```bash
git checkout develop
git pull origin develop
git checkout feature/nombre-de-la-feature
git rebase develop
git push --force-with-lease
```

### Paso 5: Abrir PR y Code Review
1. Crear el Pull Request hacia la rama `develop` completando la plantilla [`.github/pull_request_template.md`](file:///c:/Users/Equipo/Documents/practicasProyectos/librosMVP/libros-app/.github/pull_request_template.md).
2. Asignar al compañero como **Reviewer**.
3. El revisor comprueba la checklist de código, seguridad y diseño.
4. Al obtener aprobación verde (Approved), se realiza **Squash and Merge**.

---

## 5. Gestión del Tablero Kanban (GitHub Projects)

| Columna | Descripción |
|---|---|
| **Backlog** | Ideas, funcionalidades futuras y deuda técnica. |
| **To Do** | Tareas con spec definida listas para el sprint/ciclo actual. |
| **In Progress** | En desarrollo activo (**WIP Limit: Máximo 2 tareas por persona**). |
| **In Review** | PR abierto en GitHub esperando revisión del compañero. |
| **Testing** | Fusionado en `develop`, validando en entorno de pruebas. |
| **Done** | Fusionado en `main`, disponible en producción. |
