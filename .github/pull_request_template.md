## 📌 Descripción
<!-- Explica brevemente qué resuelve o implementa este Pull Request -->

## 🔗 Spec / Issue Relacionado
- Spec: `specs/` <!-- Ej: specs/001-catalog-books -->
- Closes # <!-- Ej: Closes #12 -->

## 🛠️ Tipo de Cambio
- [ ] `feat`: Nueva funcionalidad
- [ ] `fix`: Corrección de bug
- [ ] `refactor`: Mejora de código sin cambiar comportamiento
- [ ] `style`: Ajustes visuales o de diseño
- [ ] `docs`: Documentación
- [ ] `test`: Nuevos tests o mejoras de cobertura

## 📸 Screenshots / Capturas (Si aplica para UI)
<!-- Agrega capturas de pantalla antes/después o prueba en navegador -->

## ✅ Checklist de Validación (Obligatorio)
- [ ] Se ejecutaron las pruebas y pasaron exitosamente (`bun test` o `vitest`).
- [ ] El linter y TypeScript compilan sin errores (`bun run lint`).
- [ ] No hay `console.log`, secrets o código de depuración residual.
- [ ] Se consultó la documentación oficial en `./node_modules` para librerías utilizadas.
- [ ] Se respetaron las clases relativas de Tailwind CSS (sin valores absolutos en `px`).
- [ ] No se utilizó la librería `zod` (validaciones nativas / utilidades puras).
- [ ] Los Server Components y Client Components (`'use client'`) están correctamente delimitados.

## 👥 Checklist de Code Review (Para el Revisor)
- [ ] El código sigue las directrices de `AGENTS.md`.
- [ ] No se expone información sensible ni claves de servicio.
- [ ] Se contemplaron casos extremos (inputs vacíos, estados de error y loading).
