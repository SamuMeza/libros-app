# 🗄️ Esquema de Base de Datos y Políticas RLS

> Base de datos: **PostgreSQL en Supabase**.  
> Seguridad: **Row Level Security (RLS)** obligatorio en todas las tablas.

---

## 1. Tablas y Estructura SQL

```sql
-- Perfiles de usuario vinculados a Supabase Auth
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin_hl', 'admin_kc', 'superadmin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Direcciones de envío
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label TEXT,
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT,
  phone TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categorías por marca
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  brand TEXT NOT NULL CHECK (brand IN ('hl', 'kc')),
  description TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_brand ON categories(brand);

-- Catálogo de Libros (Hecho Letras)
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price > 0),
  images TEXT[] NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category_id UUID REFERENCES categories(id),
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'pre_order', 'out_of_stock')),
  stock_status TEXT NOT NULL DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock', 'on_demand')),
  delivery_days INTEGER DEFAULT 7,
  editorial TEXT,
  pages INTEGER CHECK (pages >= 0),
  language TEXT,
  binding TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_books_search ON books 
  USING gin(to_tsvector('spanish', title || ' ' || author || ' ' || COALESCE(description, '')));
CREATE UNIQUE INDEX idx_books_slug ON books(slug);
CREATE INDEX idx_books_category ON books(category_id);
CREATE INDEX idx_books_status ON books(status, is_active);

-- Catálogo de Productos y Papelería (KamCat)
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price > 0),
  images TEXT[],
  slug TEXT UNIQUE NOT NULL,
  category_id UUID REFERENCES categories(id),
  brand TEXT NOT NULL DEFAULT 'kc' CHECK (brand IN ('kc')),
  variants JSONB DEFAULT '[]',
  customization_options JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_active ON products(is_active);

-- Extras de libros (Cross-sell con productos de KamCat)
CREATE TABLE book_extras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  is_default BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Carrito persistente
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('book', 'product')),
  item_id UUID NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  extras JSONB DEFAULT '[]',
  customization JSONB DEFAULT '{}',
  added_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orden Maestra
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  order_number TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending_payment' CHECK (status IN (
    'pending_payment', 'payment_verified', 'preparing', 'shipped', 
    'in_transit', 'delivered', 'cancelled'
  )),
  total_amount DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  shipping_method TEXT CHECK (shipping_method IN ('mrw', 'zoom')),
  shipping_address JSONB NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('pago_movil', 'binance', 'installments')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'completed', 'refunded')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sub-Órdenes por Marca
CREATE TABLE sub_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  brand TEXT NOT NULL CHECK (brand IN ('hl', 'kc')),
  order_number TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending_payment' CHECK (status IN (
    'pending_payment', 'payment_verified', 'preparing', 'shipped', 
    'in_transit', 'delivered', 'cancelled'
  )),
  subtotal DECIMAL(10,2) NOT NULL,
  tracking_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ítems de la Sub-Orden
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sub_order_id UUID NOT NULL REFERENCES sub_orders(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('book', 'product')),
  item_id UUID NOT NULL,
  item_name TEXT NOT NULL,
  item_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL,
  extras JSONB DEFAULT '[]',
  customization JSONB DEFAULT '{}',
  subtotal DECIMAL(10,2) NOT NULL
);

-- Pagos y Comprobantes
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id),
  amount DECIMAL(10,2) NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('pago_movil', 'binance')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  proof_url TEXT,
  proof_number TEXT,
  notes TEXT,
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cronograma de Cuotas (Plan de Pagos)
CREATE TABLE payment_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id),
  installment_number INTEGER NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue')),
  payment_id UUID REFERENCES payments(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bitácora de Envíos
CREATE TABLE tracking_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sub_order_id UUID NOT NULL REFERENCES sub_orders(id),
  location TEXT NOT NULL,
  note TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Configuración de Tarifas de Envío
CREATE TABLE shipping_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  carrier TEXT NOT NULL CHECK (carrier IN ('mrw', 'zoom')),
  min_weight_kg DECIMAL(5,2) NOT NULL,
  max_weight_kg DECIMAL(5,2) NOT NULL,
  rate_usd DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE
);

-- Configuración de Tasa de Cambio
CREATE TABLE exchange_rate (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rate_usd_to_ves DECIMAL(10,2) NOT NULL,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Configuración de Cuotas (Plan de Pagos)
CREATE TABLE installment_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  min_installments INTEGER NOT NULL DEFAULT 2,
  max_installments INTEGER NOT NULL DEFAULT 4,
  interest_rate DECIMAL(5,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE
);

-- Solicitudes de Libros no Catalogados / Contacto
CREATE TABLE contact_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  book_title TEXT NOT NULL,
  book_author TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'resolved')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 2. Políticas RLS (Row Level Security)

```sql
-- Activar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_extras ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchange_rate ENABLE ROW LEVEL SECURITY;
ALTER TABLE installment_config ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública para catálogos activos
CREATE POLICY "Books viewable by everyone" ON books FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Products viewable by everyone" ON products FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Categories viewable by everyone" ON categories FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Book extras viewable by everyone" ON book_extras FOR SELECT USING (TRUE);

-- Políticas de usuario sobre sus propios recursos
CREATE POLICY "Users can manage own profile" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can manage own addresses" ON addresses FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can manage own cart" ON cart_items FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (user_id = auth.uid());

-- Políticas para Administradores
CREATE POLICY "Admin HL can manage books" ON books FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin_hl', 'superadmin'))
);

CREATE POLICY "Admin KC can manage products" ON products FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin_kc', 'superadmin'))
);

CREATE POLICY "Admin HL manages HL sub_orders" ON sub_orders FOR ALL USING (
  brand = 'hl' AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin_hl', 'superadmin'))
);

CREATE POLICY "Admin KC manages KC sub_orders" ON sub_orders FOR ALL USING (
  brand = 'kc' AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin_kc', 'superadmin'))
);

-- Políticas de solicitudes de contacto
CREATE POLICY "Anyone can insert contact_requests" ON contact_requests FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Users view own contact_requests" ON contact_requests FOR SELECT USING (
  user_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'superadmin')
);
CREATE POLICY "Superadmin manages contact_requests" ON contact_requests FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'superadmin')
);

-- Políticas de tablas de configuración (solo admins)
CREATE POLICY "Admins manage shipping_rates" ON shipping_rates FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin_hl', 'admin_kc', 'superadmin'))
);
CREATE POLICY "Anyone view active shipping_rates" ON shipping_rates FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins manage exchange_rate" ON exchange_rate FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin_hl', 'admin_kc', 'superadmin'))
);
CREATE POLICY "Anyone view exchange_rate" ON exchange_rate FOR SELECT USING (TRUE);

CREATE POLICY "Admins manage installment_config" ON installment_config FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin_hl', 'admin_kc', 'superadmin'))
);
CREATE POLICY "Anyone view active installment_config" ON installment_config FOR SELECT USING (is_active = TRUE);

-- Políticas de tracking_notes (hereda de sub_orders por brand)
CREATE POLICY "Admin HL manages HL tracking_notes" ON tracking_notes FOR ALL USING (
  EXISTS (
    SELECT 1 FROM sub_orders so 
    JOIN profiles p ON p.id = auth.uid()
    WHERE so.id = sub_order_id AND so.brand = 'hl' AND p.role IN ('admin_hl', 'superadmin')
  )
);
CREATE POLICY "Admin KC manages KC tracking_notes" ON tracking_notes FOR ALL USING (
  EXISTS (
    SELECT 1 FROM sub_orders so 
    JOIN profiles p ON p.id = auth.uid()
    WHERE so.id = sub_order_id AND so.brand = 'kc' AND p.role IN ('admin_kc', 'superadmin')
  )
);

-- Políticas de pagos
CREATE POLICY "Users view own payments" ON payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = payments.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Admins manage payments" ON payments FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin_hl', 'admin_kc', 'superadmin'))
);

-- Políticas de cronograma de cuotas
CREATE POLICY "Users view own payment_schedules" ON payment_schedules FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = payment_schedules.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Admins manage payment_schedules" ON payment_schedules FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin_hl', 'admin_kc', 'superadmin'))
);

-- Políticas de order_items
CREATE POLICY "Users view own order_items" ON order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM sub_orders so 
    JOIN orders o ON o.id = so.order_id
    WHERE so.id = order_items.sub_order_id AND o.user_id = auth.uid()
  )
);
```
