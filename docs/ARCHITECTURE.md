# 📋 Arquitectura y Sistema de Hecho Letras & KamCat

> **Proyecto:** E-commerce unificado para **Hecho Letras** (libros bajo demanda/stock) y **KamCat** (papelería creativa y personalizada).  
> **Mercado:** Venezuela (Pagos manuales: Pago Móvil, Binance USDT, Plan de Pagos a plazos).  
> **Envíos:** MRW y Zoom.

---

## 1. Visión y Modelos de Negocio

| Aspecto | Hecho Letras (Libros) | KamCat (Papelería) |
|---|---|---|
| **Modelo** | Encargo bajo demanda + stock limitado | Fabricación bajo pedido y personalización |
| **Catálogo** | Libros (título, autor, sinopsis, precio, stock/encargo) | Productos y accesorios con variantes y personalización |
| **Tiempo Entrega** | ~1 semana hábil (bajo encargo) o inmediato | Definido según tipo de producto |
| **Extras / Cross-sell** | Marcadores, stickers, etc. (productos KamCat como upsell) | — |
| **Métodos de Pago** | Pago Móvil, Binance USDT (con descuento), Plan de Pagos | Pago Móvil, Binance USDT |
| **Envíos** | MRW / Zoom | MRW / Zoom |
| **Gestión de Pedidos** | Admin HL gestiona pedidos y libros de HL | Admin KC gestiona productos y pedidos de KC |

---

## 2. Decisiones Clave de Arquitectura

1. **Plataforma Unificada con Identidad de Marca Separada:**
   - Hecho Letras y KamCat conviven en la misma plataforma pero mantienen estilos visuales y variables de color diferenciadas (`brand-hl` vs `brand-kc`).
2. **Carrito Unificado & Sub-órdenes Internas:**
   - El cliente realiza un único checkout para productos de ambas marcas.
   - Internamente se genera una orden maestra (`orders`) y sub-órdenes divididas por marca (`sub_orders`), permitiendo a cada administrador gestionar su parte independientemente.
3. **Flujo de Pagos Manuales:**
   - Sin pasarelas de pago automáticas. El cliente consulta los datos de pago, realiza la transferencia/envío de fondos por fuera y sube el comprobante a la plataforma para verificación manual por el admin.
4. **Plan de Pagos a Plazos (Solo Libros):**
   - Pagos divididos en 2 a 4 cuotas cada 15 días.
   - El envío se bloquea y solo se autoriza una vez canceladas todas las cuotas.
5. **Autenticación y Seguridad:**
   - Supabase Auth + RLS (Row Level Security) estricto en todas las tablas PostgreSQL.
   - Server Actions con verificación de roles (`customer`, `admin_hl`, `admin_kc`, `superadmin`).

---

## 3. Modelo de Datos (PostgreSQL / Supabase)

### Entidades Principales
- `profiles`: Extensión de usuarios autenticados con roles y teléfonos.
- `addresses`: Direcciones de envío del cliente.
- `categories`: Categorías segmentadas por marca (`hl` o `kc`).
- `books`: Catálogo de Hecho Letras (precio, stock_status, delivery_days, extras vinculados).
- `products`: Catálogo de KamCat (variantes JSONB, opciones de personalización JSONB).
- `book_extras`: Relación de libros con productos de KamCat para upsell.
- `cart_items`: Carrito persistente en base de datos.
- `orders`: Orden principal/maestra (total, método de pago, dirección).
- `sub_orders`: División de la orden por marca (`hl` y `kc`) con tracking independiente.
- `order_items`: Ítems asociados a cada sub-orden con personalizaciones y extras congelados.
- `payments`: Registro y comprobantes de pagos (Pago Móvil / Binance) con estado de verificación.
- `payment_schedules`: Cronograma de cuotas para el plan de financiamiento de libros.
- `tracking_notes`: Historial de seguimiento y ubicación geográfica de los envíos.
- `contact_requests`: Solicitudes de libros no catalogados o soporte.

---

## 4. Estructura del Código

```
src/
├── app/
│   ├── (auth)/        # Rutas de autenticación (login, registro, recuperación)
│   ├── (shop)/        # Tienda pública (landing, /libros, /kamcat, /carrito, /checkout, /pedidos)
│   ├── (admin)/       # Panel de administración segmentado por rol
│   └── api/           # Webhooks / endpoints necesarios
├── components/
│   ├── ui/            # Componentes Shadcn / Radix
│   ├── layout/        # Header, Footer, BrandSwitch
│   ├── books/         # Componentes específicos de Hecho Letras
│   ├── products/      # Componentes específicos de KamCat
│   ├── cart/          # Componentes de carrito
│   ├── checkout/      # Componentes de checkout y pagos
│   ├── admin/         # Componentes del dashboard
│   └── shared/        # Buscador, paginación, skeletons
├── lib/
│   ├── supabase/      # Clientes Supabase (server, client, middleware)
│   ├── actions/       # Server Actions por dominio (auth, books, products, orders, payments)
│   ├── hooks/         # Custom hooks
│   └── utils/         # Funciones puras de cálculo, formateo y constantes
├── types/             # Definiciones TypeScript de entidades y contratos
└── styles/            # Variables de diseño y tokens de marca
```

---

## 5. Estrategia de Testing

- **Testing Unitario (Vitest):** Cálculos de totales, cronogramas de cuotas, formateadores y validadores puros.
- **Testing de Integración (Vitest + Testing Library):** Formularios, flujo de carrito y componentes interactivos.
- **Testing E2E (Bun.WebView):** Validación end-to-end de flujos críticos (registro, compra, subida de comprobante y panel admin) compatible con el runtime Bun.
