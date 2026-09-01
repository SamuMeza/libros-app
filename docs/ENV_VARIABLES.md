# 🔐 Variables de Entorno

> Documentación de todas las variables de entorno requeridas para el funcionamiento de la plataforma.

---

## 1. Supabase (Requerido)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública (anon) de Supabase | `sb_publishable_xxxxx` |

### Configuración
```env
NEXT_PUBLIC_SUPABASE_URL=https://uymzhsautlyiavajyzqc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_dDRybiMHvXYqgsnI-FOCQQ_IkkdQr8h
```

---

## 2. Cloudinary (Opcional - Upload de comprobantes)

| Variable | Descripción | Requerido |
|----------|-------------|-----------|
| `CLOUDINARY_URL` | URL completa de Cloudinary | Para upload de comprobantes |
| `CLOUDINARY_UPLOAD_PRESET` | Preset de upload (unsigned) | Para upload de comprobantes |
| `CLOUDINARY_CLOUD_NAME` | Nombre de la nube Cloudinary | Para generar URLs |

### Configuración
```env
CLOUDINARY_URL=https://api.cloudinary.com/v1_1/xxxxx/image/upload
CLOUDINARY_UPLOAD_PRESET=payment_proofs
CLOUDINARY_CLOUD_NAME=xxxxx
```

### Notas
- Si `CLOUDINARY_URL` no está configurada, el sistema muestra un enlace de pago directo en lugar de upload de comprobante.
- Los comprobantes se guardan en la carpeta `payment-proofs/{orderId}/`.

---

## 3. Desarrollo (Opcional)

| Variable | Descripción | Default |
|----------|-------------|---------|
| `NODE_ENV` | Entorno de ejecución | `development` |
| `NEXT_PUBLIC_APP_URL` | URL base de la aplicación | `http://localhost:3000` |

---

## 4. Producción

| Variable | Descripción |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de producción de Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública de producción |
| `CLOUDINARY_URL` | URL de Cloudinary producción |

---

## 📋 Plantilla .env.local

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Cloudinary (Opcional)
CLOUDINARY_URL=
CLOUDINARY_UPLOAD_PRESET=payment_proofs
CLOUDINARY_CLOUD_NAME=

# Desarrollo
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
