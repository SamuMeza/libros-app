# Data Model: Layout Base y Sistema de Diseño

**Feature**: 001-layout-design-tokens  
**Date**: 2026-08-26  

## Resumen

Esta feature es puramente de UI y no define entidades de persistencia. El modelo de datos se limita a tipos TypeScript para las props de los componentes y la estructura de tokens CSS.

## Tipos de Componentes

### Brand Type
```typescript
type Brand = 'hl' | 'kc';
```

### Theme Type
```typescript
type Theme = 'light' | 'dark';
```

### Product Badge Type
```typescript
type ProductBadge = 'EN STOCK' | 'POR ENCARGO' | 'PERSONALIZABLE';
```

### Toast Variant Type
```typescript
type ToastVariant = 'success' | 'error' | 'info';
```

## Props de Componentes

### ProductCard Props
```typescript
interface ProductCardProps {
  product: {
    id: string;
    name: string;
    author?: string;        // Solo para HL
    category?: string;      // Solo para KC
    price: number;
    image: string;
    stockStatus: 'in_stock' | 'pre_order' | 'customizable';
  };
  brand: Brand;
  onAddToCart: (productId: string) => void;
}
```

### Toast Props
```typescript
interface ToastProps {
  variant: ToastVariant;
  message: string;
  duration?: number;        // Default: 5000ms
  onClose: () => void;
}
```

### Modal Props
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;        // Default: '450px'
}
```

## Estructura de Tokens CSS

### Variables de Marca
```css
/* Hecho Letras */
--hl-primary: #1E3A5F;
--hl-secondary: #3B5998;
--hl-accent: #E8B923;

/* KamCat */
--kc-primary: #7C3AED;
--kc-secondary: #A78BFA;
--kc-accent: #F472B6;
```

### Variables de Modo
```css
/* Modo Claro */
--bg-primary: #FFFFFF;
--bg-secondary: #F5F5F5;
--text-primary: #1A1A1A;
--text-secondary: #666666;

/* Modo Oscuro */
--bg-primary: #0F0F0F;
--bg-secondary: #1A1A1A;
--text-primary: #F5F5F5;
--text-secondary: #A0A0A0;
```

### Variables de Espaciado
```css
--space-1: 0.25rem;
--space-2: 0.5rem;
--space-3: 0.75rem;
--space-4: 1rem;
--space-6: 1.5rem;
--space-8: 2rem;
--space-16: 4rem;
```

### Variables de Bordes
```css
--radius-sm: 0.25rem;
--radius-md: 0.5rem;
--radius-lg: 0.75rem;
--radius-xl: 1rem;
--radius-full: 9999px;
```

## Persistencia (localStorage)

### Clave: `theme-preference`
```typescript
interface ThemePreference {
  mode: Theme;
  timestamp: number;
}
```

**Estructura en localStorage**:
```json
{
  "theme-preference": "{\"mode\":\"dark\",\"timestamp\":1693046400000}"
}
```
