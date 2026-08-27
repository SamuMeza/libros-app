# 🎨 Sistema de Diseño y Tokens UI — Hecho Letras & KamCat

> **Tokens globales, tipografía, espaciado, bordes y sombras para la plataforma e-commerce.**

---

## 1. Paleta de Colores

### Modo Claro

| Token | Hex | Uso |
|---|---|---|
| `--bg-primary` | `#FFFFFF` | Fondo principal |
| `--bg-secondary` | `#F5F5F5` | Fondos de sección alternos |
| `--bg-card` | `#FFFFFF` | Fondos de tarjetas (cards) |
| `--bg-hero-hl` | `#1E3A5F` | Overlay hero Hecho Letras |
| `--bg-hero-kc` | `#7C3AED` | Overlay hero KamCat |
| `--text-primary` | `#1A1A1A` | Títulos, texto principal |
| `--text-secondary` | `#666666` | Subtítulos, metadata |
| `--text-muted` | `#9CA3AF` | Placeholders, hints, etiquetas secundarias |
| `--text-on-dark` | `#FFFFFF` | Texto sobre fondos oscuros o botones con contraste |
| `--hl-primary` | `#1E3A5F` | Brand Hecho Letras (Azul profundo) |
| `--hl-secondary`| `#3B5998` | Secundario Hecho Letras |
| `--hl-accent` | `#E8B923` | Acentos HL (precios, badges, CTAs dorados) |
| `--kc-primary` | `#7C3AED` | Brand KamCat (Púrpura creativo) |
| `--kc-secondary`| `#A78BFA` | Secundario KamCat |
| `--kc-accent` | `#F472B6` | Acentos KC (precios, badges, CTAs rosados) |
| `--success` | `#22C55E` | "En stock", verificación exitosa, badges positivos |
| `--warning` | `#F97316` | "Por encargo", pagos pendientes, avisos |
| `--danger` | `#EF4444` | Errores, rechazado, eliminación |
| `--info` | `#3B82F6` | Estados informativos, envíos en tránsito |
| `--border` | `#E5E7EB` | Bordes de inputs, cards y dividers |
| `--border-focus` | `#1E3A5F` / `#7C3AED` | Borde de foco interactivo según marca |

### Modo Oscuro

| Token | Hex | Uso |
|---|---|---|
| `--bg-primary` | `#0F0F0F` | Fondo principal |
| `--bg-secondary` | `#1A1A1A` | Fondos de sección y paneles |
| `--bg-card` | `#1A1A1A` | Fondos de tarjetas |
| `--text-primary` | `#F5F5F5` | Títulos y texto destacado |
| `--text-secondary` | `#A0A0A0` | Subtítulos y descripciones |
| `--text-muted` | `#6B7280` | Placeholders y texto desactivado |
| `--hl-primary` | `#3B5998` | HL versión nocturna |
| `--hl-accent` | `#F0C94C` | Dorado más vivo y contrastado |
| `--kc-primary` | `#A78BFA` | Lila brillante |
| `--kc-accent` | `#F9A8D4` | Rosa vivo |
| `--border` | `#374151` | Bordes en modo oscuro |

---

## 2. Tipografía

| Rol | Familia | Tamaño Desktop | Tamaño Mobile | Peso | Line-height |
|---|---|---|---|---|---|
| **H1 (Hero / Títulos Página)** | Playfair Display | `3.5rem` (56px) | `2.25rem` (36px) | 700 | 1.1 |
| **H2 (Sección)** | Playfair Display | `2.25rem` (36px) | `1.5rem` (24px) | 600 | 1.2 |
| **H3 (Card title / Subtítulos)** | Inter | `1.25rem` (20px) | `1rem` (16px) | 600 | 1.3 |
| **Body (Párrafos)** | Inter | `1rem` (16px) | `0.875rem` (14px) | 400 | 1.6 |
| **Caption (Metadata / Labels)** | Inter | `0.875rem` (14px) | `0.75rem` (12px) | 400 | 1.4 |
| **Button (Botones interactivos)**| Inter | `0.875rem` (14px) | `0.875rem` (14px) | 600 | 1 |
| **Badge (Etiquetas de estado)** | Inter | `0.75rem` (12px) | `0.625rem` (10px) | 600 | 1 |
| **Price (Precios destacados)** | Inter | `1.125rem` (18px) | `1rem` (16px) | 700 | 1 |
| **Nav (Navegación)** | Inter | `0.875rem` (14px) | `0.875rem` (14px) | 500 | 1 |

---

## 3. Espaciado y Escala Relativa (Base 4px)

| Token | Valor Relativo | Equivalente Pixel Base |
|---|---|---|
| `space-1` | `0.25rem` | 4px |
| `space-2` | `0.5rem` | 8px |
| `space-3` | `0.75rem` | 12px |
| `space-4` | `1rem` | 16px |
| `space-5` | `1.25rem` | 20px |
| `space-6` | `1.5rem` | 24px |
| `space-8` | `2rem` | 32px |
| `space-10` | `2.5rem` | 40px |
| `space-12` | `3rem` | 48px |
| `space-16` | `4rem` | 64px |
| `space-20` | `5rem` | 80px |
| `space-24` | `6rem` | 96px |

---

## 4. Bordes y Sombras

### Radios de Borde (`border-radius`)
- `radius-sm`: `0.25rem` (4px) — Badges, etiquetas pequeñas
- `radius-md`: `0.5rem` (8px) — Inputs, botones estándar, checkboxes
- `radius-lg`: `0.75rem` (12px) — Cards, dropdowns, modales pequeños
- `radius-xl`: `1rem` (16px) — Modales grandes, contenedores destacados, imágenes hero
- `radius-full`: `9999px` — Badges circulares, avatares, toggles

### Sombras (`box-shadow`)
- `shadow-sm`: `0 1px 2px rgba(0,0,0,0.05)`
- `shadow-md`: `0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)`
- `shadow-lg`: `0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)`
- `shadow-card`: `0 2px 8px rgba(0,0,0,0.08)`
