# 💳 Mockups y Especificaciones de Carrito, Checkout y Pedidos

> Especificaciones detalladas de los flujos transaccionales: Carrito Unificado, Checkout en 3 Pasos, Pagos Manuales, Plan de Cuotas y Seguimiento de Pedidos.

---

## 1. Carrito Unificado (`/carrito`)

```
┌────────────────────────────────────────────────────────┬─────────────────────────────┐
│ TU CARRITO (3 artículos)                               │ RESUMEN DEL PEDIDO          │
├────────────────────────────────────────────────────────┼─────────────────────────────┤
│ [IMG] Alas de Sangre - Hecho Letras                    │ Subtotal:            $35.00 │
│       Extras: Marcapáginas +$2.00                      │ Descuento Binance:    -$1.75│
│       $15.00   [-] 1 [+]                     $17.00 [x]│ Envío (MRW/Zoom):  Calculado│
├────────────────────────────────────────────────────────┤                      en sig.│
│ [ Divider: También de KamCat ]                         │ TOTAL:               $33.25 │
├────────────────────────────────────────────────────────┤                             │
│ [IMG] Pack Stickers Personalizados - KamCat            │ [ PROCEDER AL CHECKOUT → ]  │
│       Texto: "Lectora Nocturna"                        │                             │
│       $5.00    [-] 2 [+]                     $10.00 [x]│ 🔒 Pago y verificación      │
│                                                        │    manual transparente      │
└────────────────────────────────────────────────────────┴─────────────────────────────┘
```

### Especificaciones
- **Layout:** Grid de 2 columnas desktop (60% items / 40% resumen fijo), 1 columna en mobile.
- **Lista de Ítems:**
  - Separador visual y badge de marca cuando coexisten ítems de ambas marcas.
  - Fotografía, título, detalles de extras/personalización congelados, precio unitario, stepper de cantidad y botón de eliminación (icono `Trash2` en `--danger`).
- **Resumen Fijo:**
  - Cálculo de subtotal en tiempo real.
  - Indicador de descuento aplicable si se elige Binance (5%).
  - Botón principal de avance *"Proceder al checkout →"* (`bg --hl-primary`, `text --text-on-dark`).
- **Empty State:** Ilustración de carrito vacío con botones dobles hacia `/libros` y `/kamcat`.

---

## 2. Proceso de Checkout (`/checkout`)

- **Progreso del Checkout:** Indicador horizontal en 3 pasos: `[1. Envío]` → `[2. Pago]` → `[3. Confirmación]`.

### Paso 1: Dirección y Método de Envío
- **Datos del Receptor:** Nombre completo, Cédula de Identidad, Teléfono WhatsApp, Estado de Venezuela (Select), Ciudad, Dirección exacta y Punto de referencia.
- **Métodos de Encomienda (Radio Cards seleccionables):**
  - **MRW:** *"Entrega estimada en 2-5 días hábiles a agencia o domicilio"*.
  - **Zoom:** *"Entrega estimada en 3-7 días hábiles con rastreo express"*.
  - Estado activo con borde en `--hl-primary` y fondo tintado sutil.

### Paso 2: Selección del Método de Pago
- **Radio Cards verticales de selección:**
  1. **Pago Móvil:**
     - Datos desplegables: Banco destino, Teléfono, Cédula, Monto exacto calculado en Bolívares (VES) a tasa oficial.
  2. **Binance (USDT):**
     - Badge *"5% de Descuento aplicado"* (`bg --success`).
     - Despliegue de Billetera destino (TRC-20 / BEP-20) con botón para copiar dirección en un clic e importe en USDT.
  3. **Plan de Pagos a Plazos (Solo disponible si hay libros en la orden):**
     - Selector de cuotas: `2`, `3` o `4` cuotas quincenales.
     - Tabla visual con el cronograma de fechas y montos quincenales.
     - Advertencia clara: *"El despacho se realiza una vez completada la totalidad de las cuotas"*.

### Paso 3: Confirmación y Carga de Comprobante
- **Resumen compacto:** Detalle de productos, total acordado y dirección.
- **Zona Dropzone de Comprobante:**
  - Contenedor con borde discontinuo (`border-2 border-dashed --border`), radio `radius-xl`, padding `space-12`.
  - Icono `Upload`, acepta imágenes JPG, PNG y documentos PDF (máx. 5MB).
  - Previsualización del archivo cargado con opción de eliminación y campo para número de referencia bancaria/hash.
- **Botón de Finalización:** *"Completar pedido"* (`bg --hl-primary`, `text --text-on-dark`).

---

## 3. Seguimiento de Pedidos del Cliente (`/pedidos` & `/pedidos/[id]`)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ PEDIDO #HL-KC-2026-0089                  Fecha: 26/08/2026      Total: $35.00 USD      │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ SUB-ORDEN HECHO LETRAS: [ EN TRÁNSITO - MRW: 84920492 ]                                │
│ ● 26/08: Pago verificado por administración                                            │
│ ● 28/08: Paquete despachado desde Maracaibo                                            │
│ ◯ En camino a Hub Central Caracas                                                      │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ SUB-ORDEN KAMCAT: [ EN PREPARACIÓN ]                                                   │
│ ● 26/08: Pago verificado. En proceso de estampado y personalización                    │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

- **Vista General (`/pedidos`):** Listado cronológico de órdenes con números de pedido, fechas, montos y badges de estado general.
- **Vista de Detalle (`/pedidos/[id]`):**
  - Desglose por cada **Sub-Orden** (`Hecho Letras` y `KamCat`) de forma independiente.
  - **Timeline de Envíos:** Nodos conectados verticalmente con fecha, ubicación y notas de seguimiento geográfico ingresadas por los administradores.
  - **Historial de Pagos:** Registro de comprobantes enviados y estado de aprobación de cuotas quincenales si se encuentra bajo plan de financiamiento.
