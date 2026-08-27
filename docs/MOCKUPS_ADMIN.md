# 🛡️ Mockups y Especificaciones del Panel de Administración

> Especificaciones detalladas para el panel de gestión interna: Sidebar Global, Panel de Verificación de Pagos, Gestión de Pedidos por Marca y Modales Operativos.

---

## 1. Sidebar Global de Administración

```
┌──────────────────────────┐
│ HECHO LETRAS & KAMCAT    │
│ Panel Administrativo     │
├──────────────────────────┤
│ [📊] Dashboard           │
│ [📚] Libros (HL)         │
│ [🎨] Productos (KC)      │
│ [📦] Pedidos             │
│ [💳] Pagos y Comprobantes│
│ [✉️] Solicitudes Contacto│
│ [📈] Reportes de Ventas  │
├──────────────────────────┤
│ [👤] Admin Hecho Letras  │
│ [🚪] Cerrar Sesión       │
└──────────────────────────┘
```

### Especificaciones Técnicas
- **Dimensiones:** Ancho fijo `260px` en desktop (drawer lateral en mobile), altura `100vh` fija a la izquierda.
- **Fondo:** `--bg-secondary`, borde derecho `1px` sólido `--border`, padding `space-6`.
- **Segmentación de Navegación por Rol:**
  - **Admin HL:** Dashboard, Libros, Pedidos (HL), Pagos (HL), Solicitudes de Libros.
  - **Admin KC:** Dashboard, Productos, Pedidos (KC), Pagos (KC).
  - **Superadmin:** Acceso total + Reportes globales y Gestión de usuarios.
- **Estados de Ítems:** Activo con fondo en color de marca (`--hl-primary` o `--kc-primary`) y texto blanco; inactivo con texto `--text-secondary` y hover en `--bg-primary`.

---

## 2. Panel de Verificación de Pagos (`/admin/pagos`)

### Layout y Filtros
- **Barra de Filtros:** Estado (Todos, Pendientes, Verificados, Rechazados), Método (Pago Móvil, Binance, Cuotas) y Selector de Rango de Fechas.
- **Tabla de Registros:**
  - Columnas: `N° Orden`, `Cliente / Teléfono`, `Método`, `Monto USD / VES`, `Comprobante (Thumbnail)`, `Estado`, `Acciones`.
  - Filas alternadas (`--bg-primary` y `--bg-secondary`).
  - Thumbnail de comprobante: Clickeable para abrir modal de inspección en alta resolución.

### Modal de Aprobación de Pago
- **Overlay:** Fondo oscuro `50% opacity` con `backdrop-blur-md`.
- **Contenedor:** Modal centrado `max-w-[550px]`, fondo `--bg-primary`, radio `radius-xl`, padding `space-6`.
- **Visualizador:** Previsualización del comprobante con zoom (altura máx. `400px`).
- **Campos:** Referencia registrada, monto esperado vs reportado, campo de texto para notas internas.
- **Botones de Acción:**
  - Botón *"Confirmar Pago"*: `bg --success`, `text --text-on-dark`. Actualiza estado del pedido a `payment_verified`.
  - Botón *"Rechazar Pago"*: Borde `--danger`. Abre prompt para indicar motivo de rechazo enviado al cliente por email.

---

## 3. Gestión y Despacho de Pedidos (`/admin/pedidos`)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ PEDIDOS (Admin Hecho Letras)               [ Filtro: Todos v ] [ 🔍 Buscar orden... ]  │
├────────────┬──────────────────┬────────────┬─────────────┬──────────────┬──────────────┤
│ N° ORDEN   │ CLIENTE          │ FECHA      │ SUBTOTAL    │ ESTADO       │ ACCIONES     │
├────────────┼──────────────────┼────────────┼─────────────┼──────────────┼──────────────┤
│ #HL-0089-A │ María González   │ 26/08/2026 │ $17.00 USD  │ [PAGO OK]    │ [Detalle >]  │
│ #HL-0088-A │ Carlos Mendoza   │ 25/08/2026 │ $30.00 USD  │ [EN TRÁNSITO]│ [Detalle >]  │
└────────────┴──────────────────┴────────────┴─────────────┴──────────────┴──────────────┘
```

### Drawer de Detalle Operativo (Lateral Derecho `600px`)
Al hacer clic en una orden, se abre un drawer con 4 pestañas:

1. **Pestaña Productos:** Listado de libros/artículos solicitados, extras incluidos y notas de personalización (KamCat).
2. **Pestaña Pagos:** Historial de comprobantes y cronograma de cuotas quincenales si aplica.
3. **Pestaña Envío y Tracking:**
   - Dirección completa y empresa de transporte (MRW / Zoom).
   - Campo editable para asignar el **Número de Guía (Tracking Number)**.
   - Formulario de Actualización de Tracking:
     - Selector de Ciudad/Ubicación: *Maracaibo, Caracas, Valencia, Barquisimeto, etc.*
     - Nota informativa: *Ej. "Paquete recibido en agencia principal"*.
     - Botón: *"Agregar actualización de envío"*.
4. **Pestaña Cliente:** Ficha de contacto directo (WhatsApp, teléfono, historial previo).
5. **Selector de Estado de la Orden:**
   - Flujo: `pending_payment` → `payment_verified` → `preparing` → `shipped` → `in_transit` → `delivered` → `cancelled`.
   - Obliga a ingresar número de guía al cambiar a `shipped`.
