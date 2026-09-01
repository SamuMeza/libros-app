# 📦 Documentación de Requerimientos Funcionales y Módulos

> Base de especificación técnica para la plataforma e-commerce unificada **Hecho Letras** y **KamCat**.

---

## 1. Módulo: Autenticación y Perfil
- **RF-AU1**: Registro de usuarios con email/password y gestión segura de sesiones mediante Supabase Auth.
- **RF-AU2**: Inicio y cierre de sesión.
- **RF-AU3**: Recuperación y restablecimiento de contraseña.
- **RF-AU4**: Gestión de perfil de usuario (nombre completo, teléfono para notificaciones, libreta de direcciones para envíos).

---

## 2. Módulo: Catálogo Hecho Letras (Libros)
- **RF-HL1**: Listado con filtros (género, autor, rango de precio, disponibilidad: en stock / por encargo).
- **RF-HL2**: Detalle de libro (título, autor, sinopsis, precio, tiempo estimado de entrega y selección de extras/cross-sell).
- **RF-HL3**: Búsqueda por título o autor (PostgreSQL Full-Text Search).
- **RF-HL4**: Formulario para solicitar libros no catalogados / cotización.
- **RF-HL5**: Agregar al carrito con selección opcional de extras (marcapáginas, fundas, etc.).
- **RF-HL6**: Gestión administrativa de libros (CRUD completo, fotos en Cloudinary, estado de inventario).

---

## 3. Módulo: Catálogo KamCat (Papelería y Personalización)
- **RF-KC1**: Listado de productos por categoría y precio.
- **RF-KC2**: Detalle de producto con soporte de variantes (tamaño, color, acabados) y visualizador de imágenes.
- **RF-KC3**: Personalización de producto (campos de texto, selección de colores, subida de referencias o instrucciones de diseño).
- **RF-KC4**: Agregar al carrito conservando las opciones y personalizaciones seleccionadas.
- **RF-KC5**: Panel administrativo de productos KamCat (CRUD, variantes y revisión de personalizaciones para producción).

---

## 4. Módulo: Carrito y Checkout Unificado
- **RF-CT1**: Carrito único con soporte simultáneo para libros y productos KamCat.
- **RF-CT2**: Actualización reactiva de cantidades, extras y eliminación de ítems.
- **RF-CK1**: Selección de dirección de envío y empresa de encomienda (MRW / Zoom).
- **RF-CK2**: Selección de método de pago:
  - **Pago Móvil**: Datos de cuenta bancaria + subida de comprobante.
  - **Binance (USDT)**: Aplicación de descuento configurado + datos de billetera + subida de comprobante.
  - **Plan de Pagos (solo Libros)**: Cálculo y desglose de cuotas quincenales (2 a 4 cuotas) con monto y tasa de interés configurables por administrador.
- **RF-CK3**: Generación automática de orden maestra y sub-órdenes por marca (`hl` y `kc`).
- **RF-CK4**: Subida de comprobantes de pago a Cloudinary con validación de tipo (imagen) y tamaño (máximo 5MB).

---

## 5. Módulo: Gestión de Pedidos y Tracking
- **RF-OR1**: Historial de pedidos para el cliente con estados detallados por marca.
- **RF-OR2**: Panel de administración segmentado por rol (`admin_hl` y `admin_kc`) para gestionar sub-órdenes de forma independiente.
- **RF-OR3**: Flujo de estados: `pending_payment` → `payment_verified` → `preparing` → `shipped` → `in_transit` → `delivered`. Incluye transición a `cancelled` desde cualquier estado no terminal.
- **RF-OR4**: Bitácora de seguimiento geográfico (`tracking_notes`) para informar el avance del paquete (ej: Ciudad origen → Hub central → En entrega).

---

## 6. Módulo: Plan de Pagos Quincenal
- **RF-PP1**: Desglose automático de cuotas y fechas límites quincenales.
- **RF-PP2**: Registro y validación manual de cada cuota abonada mediante comprobante.
- **RF-PP3**: Bloqueo de despacho hasta la liquidación total de las cuotas.
