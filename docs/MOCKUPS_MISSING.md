# 📝 Mockups y Especificaciones de Vistas y Módulos Faltantes

> Este documento complementa la arquitectura visual especificando los 12 elementos y pantallas no definidos inicialmente: Autenticación, Nosotros, Políticas, Contacto, Favoritos, Dashboard Admin, CRUD Admin, Tiempo Real, 404, Skeletons Globales, Éxito Post-Compra e Internacionalización.

---

## 1. Módulo de Autenticación (`/login`, `/register`, `/forgot-password`)

```
┌────────────────────────────────────────────────────────┐
│               HECHO LETRAS & KAMCAT                    │
│            Inicia sesión en tu cuenta                  │
├────────────────────────────────────────────────────────┤
│ Correo electrónico: [ usuario@email.com              ] │
│ Contraseña:         [ •••••••••••••••                ] │
│                                                        │
│ [x] Recordarme               ¿Olvidaste tu contraseña? │
│                                                        │
│ [             INICIAR SESIÓN CON CORREO              ] │
│                                                        │
│ ──────────────────── o también ─────────────────────── │
│ [              Continuar con Google                  ] │
│                                                        │
│ ¿No tienes cuenta? Regístrate aquí                     │
└────────────────────────────────────────────────────────┘
```

### Especificaciones de Login y Registro
- **Layout:** Tarjeta centrada con `max-w-[440px]`, fondo `--bg-card`, radio `radius-xl`, sombra `shadow-lg`, padding `space-8`.
- **Inputs:** Fondo `--bg-primary`, borde `1px` `--border`, radio `radius-md`, foco con anillo de `2px` en `--hl-primary`.
- **Botón Primario:** *"Iniciar sesión"* / *"Crear cuenta"* (`bg --hl-primary`, `text --text-on-dark`, alto `2.75rem`, `radius-lg`).
- **Botón OAuth:** Botón estilizado con icono oficial de Google para autenticación en un clic.
- **Página de Recuperación (`/forgot-password`):** Formulario simple para ingresar correo y recibir enlace mágico de restablecimiento mediante Supabase Auth.

---

## 2. Página "Sobre Nosotros" Completa (`/nosotros`)

- **Hero Narrativo:** Título *"Dos creadores, una sola visión"* con fotografía panorámica del taller de trabajo.
- **Sección Hecho Letras (La Historia de Él):** Filosofía de curaduría de libros, búsqueda de ejemplares especiales y amor por la literatura.
- **Sección KamCat (La Historia de Ella):** Proceso artesanal de fabricación de papelería, elección de materiales, acabados y empaquetado con detalles hechos a mano.
- **Galería del Taller / Proceso:** Grid de fotos reales del empaquetado, notas dedicadas y despacho de paquetes.

---

## 3. Páginas de Políticas y Legal (`/politicas/envios`, `/politicas/terminos`, `/politicas/privacidad`)

- **Layout:** Contenedor de lectura óptima `max-w-[800px]` centrado con tipografía optimizada (`prose` / espaciado amplio).
- **Navegación Lateral o Superior:** Pestañas fijas para alternar entre Envíos, Términos y Privacidad.
- **Contenido Clave:**
  - **Envíos:** Condiciones de despacho con MRW y Zoom, tiempos estimados de entrega (2-7 días), responsabilidad de guías y retiro en agencias.
  - **Términos:** Proceso de verificación manual de pagos, plazos de reserva de pedidos no pagados y condiciones del plan de cuotas.
  - **Privacidad:** Tratamiento confidencial de datos de contacto y direcciones.

---

## 4. Página de Contacto y Soporte (`/contacto`)

- **Layout:** 2 columnas desktop (Información y Canales directos a la izquierda / Formulario a la derecha).
- **Canales Directos:**
  - Botón directo de **WhatsApp** con mensaje predefinido.
  - Horarios de atención: Lunes a Sábado 9:00 AM - 6:00 PM.
  - Teléfonos y enlaces a perfiles de Instagram/TikTok.
- **Formulario de Mensajes:** Nombre, Correo, Teléfono, Asunto (Duda sobre libro, Pedido personalizado KamCat, Estado de orden, Otro), Área de texto y botón de envío con toast de confirmación.

---

## 5. Página de Lista de Favoritos (`/favoritos`)

- **Estructura:** Grid similar a catálogos con las cards de productos guardados por el usuario.
- **Funcionalidad:**
  - Botón rápido para mover el ítem directamente al Carrito.
  - Botón de eliminación de favoritos (icono `Heart` lleno que conmuta).
- **Empty State:** *"No tienes productos guardados aún"* con enlaces a explorar libros y papelería.

---

## 6. Dashboard Administrativo General (`/admin`)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ DASHBOARD GENERAL (Hecho Letras & KamCat)                         [ Últimos 30 días v ]│
├────────────────────┬────────────────────┬────────────────────┬─────────────────────────┤
│ VENTAS TOTALES     │ PEDIDOS ACTIVOS    │ PAGOS PENDIENTES   │ LIBROS POR ENCARGO      │
│ $1,420.00 USD      │ 28 pedidos         │ 4 por verificar    │ 12 en proceso           │
├────────────────────┴────────────────────┴────────────────────┴────────────────────────┤
│ [ Gráfico de Ingresos por Marca (HL vs KC) ]  │ [ Últimos Pedidos Recibidos ]          │
│                                                │ #HL-0091 - $22.00 (Pago Móvil)         │
│                                                │ #KC-0090 - $14.00 (Binance)            │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

- **Métricas Clave (KPI Cards):** Tarjetas con valor monetario total, número de órdenes en curso, pagos pendientes de verificación y stock crítico.
- **Gráficos Resumidos:** Comparativa de volumen de ventas entre Hecho Letras y KamCat.
- **Lista de Acción Rápida:** Acceso directo a los comprobantes pendientes de aprobación.

---

## 7. Formularios CRUD Admin de Productos y Libros (`/admin/libros/nuevo`, `/admin/productos/nuevo`)

### CRUD Hecho Letras (Libros)
- Campos: Título, Autor, Sinopsis/Descripción, Categoría/Género, Precio USD, Estado de Stock (`in_stock` / `on_demand`), Días de entrega estimados (`delivery_days`), Selector de extras KamCat vinculados.
- Carga de Portada: Dropzone conectado a Cloudinary con previsualización inmediata.

### CRUD KamCat (Papelería)
- Campos: Nombre del producto, Descripción, Categoría, Precio base USD.
- Gestor de Variantes (JSONB): Formulario dinámico para añadir Tamaños y Precios adicionales.
- Gestor de Opciones de Personalización: Checkboxes para habilitar campos de texto o colores personalizados.
- Carga de Galería: Múltiples imágenes hacia Cloudinary.

---

## 8. Notificaciones en Tiempo Real

- **Integración:** Supabase Realtime suscrito a eventos de inserción en la tabla `orders` y `payments`.
- **Comportamiento en Panel Admin:** Al entrar un nuevo pedido o subida de comprobante, se reproduce un sonido discreto y aparece un toast flotante en el panel con enlace directo a la orden.

---

## 9. Página de Error 404 (`/not-found`)

- **Diseño:** Ilustración temática de un libro abierto con stickers flotantes extraviados.
- **Mensaje:** *"Esta página parece haberse perdido entre las páginas"* (`H1` en *Playfair Display*).
- **Acciones:** Botón primario *"Volver al inicio"* + Enlaces a explorar el catálogo de libros o papelería.

---

## 10. Estados de Loading Globales (Suspense Boundaries & Skeletons)

- **Transiciones de Ruta:** Barra de progreso sutil en el borde superior del viewport (`2px` en color `--hl-accent`).
- **Skeletons por Sección:** Placeholders con efecto `pulse` adaptados a cada layout (Grid de productos, Detalle de libro, Tabla admin) previniendo saltos de layout (CLS < 0.1).

---

## 11. Página de Éxito Post-Compra (`/checkout/exito`)

```
┌────────────────────────────────────────────────────────┐
│                        [ ✓ ]                           │
│              ¡GRACIAS POR TU COMPRA!                   │
│               Pedido #HL-KC-2026-0089                  │
├────────────────────────────────────────────────────────┤
│ Hemos recibido tu pedido y comprobante de pago.        │
│ Nuestro equipo lo verificará en las próximas 24 horas. │
│                                                        │
│ [        VER ESTADO DEL PEDIDO Y SEGUIMIENTO         ] │
│ [           Notificar / Consultar por WhatsApp       ] │
└────────────────────────────────────────────────────────┘
```

- **Elementos:** Icono animado de check verde (`--success`), número de orden destacado, resumen del método seleccionado y botones de acceso directo a `/pedidos` o apertura de chat de WhatsApp con el soporte.

---

## 12. Arquitectura Preparada para Internacionalización (i18n)

- **Estado Actual:** Idioma español Venezuela (`es-VE` / `es-419`) por defecto.
- **Estructura Técnica:** Rutas y textos centralizados mediante diccionarios en `src/lib/utils/constants.ts` y tokens de internacionalización para facilitar una futura migración a inglés/multimoneda sin refactorizaciones complejas.
