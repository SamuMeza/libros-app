-- Esquema Inicial — Tablas Base y RLS
-- Migración: 001_initial_schema
-- Fecha: 2026-09-01
-- Descripción: Crea todas las tablas fundacionales del proyecto:
--   profiles, addresses, categories, books, products, book_extras,
--   tracking_notes, contact_requests y sus políticas RLS.
--
-- ⚠️ DEBE ejecutarse ANTES que:
--   - 20260901000001_cart_checkout_tables.sql
--   - 20260901000002_cart_checkout_rls.sql

-- =============================================
-- Tabla: profiles
-- Vincula auth.users con roles de la aplicación
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name  TEXT,
  phone      TEXT,
  avatar_url TEXT,
  role       TEXT NOT NULL DEFAULT 'customer'
               CHECK (role IN ('customer', 'admin_hl', 'admin_kc', 'superadmin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para auto-crear perfil al registrarse en Auth
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================
-- Tabla: addresses
-- Direcciones de envío del usuario
-- =============================================
CREATE TABLE IF NOT EXISTS addresses (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label      TEXT,
  street     TEXT NOT NULL,
  city       TEXT NOT NULL,
  state      TEXT NOT NULL,
  zip_code   TEXT,
  phone      TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);

-- =============================================
-- Tabla: categories
-- Categorías por marca (hl | kc)
-- =============================================
CREATE TABLE IF NOT EXISTS categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  brand       TEXT NOT NULL CHECK (brand IN ('hl', 'kc')),
  description TEXT,
  image_url   TEXT,
  sort_order  INTEGER DEFAULT 0,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_brand       ON categories(brand);

-- =============================================
-- Tabla: books
-- Catálogo de Libros (Hecho Letras)
-- =============================================
CREATE TABLE IF NOT EXISTS books (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  author        TEXT NOT NULL,
  description   TEXT,
  price         DECIMAL(10,2) NOT NULL CHECK (price > 0),
  images        TEXT[] NOT NULL,
  slug          TEXT UNIQUE NOT NULL,
  category_id   UUID REFERENCES categories(id),
  status        TEXT NOT NULL DEFAULT 'available'
                  CHECK (status IN ('available', 'pre_order', 'out_of_stock')),
  stock_status  TEXT NOT NULL DEFAULT 'in_stock'
                  CHECK (stock_status IN ('in_stock', 'on_demand')),
  delivery_days INTEGER DEFAULT 7,
  editorial     TEXT,
  pages         INTEGER CHECK (pages >= 0),
  language      TEXT,
  binding       TEXT,
  is_featured   BOOLEAN DEFAULT FALSE,
  is_active     BOOLEAN DEFAULT TRUE,
  created_by    UUID REFERENCES auth.users(id),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_books_search ON books
  USING gin(to_tsvector('spanish', title || ' ' || author || ' ' || COALESCE(description, '')));
CREATE UNIQUE INDEX IF NOT EXISTS idx_books_slug ON books(slug);
CREATE INDEX IF NOT EXISTS idx_books_category   ON books(category_id);
CREATE INDEX IF NOT EXISTS idx_books_status     ON books(status, is_active);

-- =============================================
-- Tabla: products
-- Catálogo de Productos y Papelería (KamCat)
-- =============================================
CREATE TABLE IF NOT EXISTS products (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                  TEXT NOT NULL,
  description           TEXT,
  price                 DECIMAL(10,2) NOT NULL CHECK (price > 0),
  images                TEXT[],
  slug                  TEXT UNIQUE NOT NULL,
  category_id           UUID REFERENCES categories(id),
  brand                 TEXT NOT NULL DEFAULT 'kc' CHECK (brand IN ('kc')),
  variants              JSONB DEFAULT '[]',
  customization_options JSONB DEFAULT '[]',
  is_active             BOOLEAN DEFAULT TRUE,
  created_by            UUID REFERENCES auth.users(id),
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_products_slug  ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category     ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand        ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_active       ON products(is_active);

-- =============================================
-- Tabla: book_extras
-- Extras de libros — Cross-sell con productos KC
-- =============================================
CREATE TABLE IF NOT EXISTS book_extras (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id    UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  is_default BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_book_extras_book_id    ON book_extras(book_id);
CREATE INDEX IF NOT EXISTS idx_book_extras_product_id ON book_extras(product_id);

-- =============================================
-- Tabla: contact_requests
-- Solicitudes de libros no catalogados / Contacto
-- =============================================
CREATE TABLE IF NOT EXISTS contact_requests (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID REFERENCES auth.users(id),
  book_title     TEXT NOT NULL,
  book_author    TEXT,
  requester_name TEXT,
  email          TEXT NOT NULL,
  phone          TEXT,
  message        TEXT,
  status         TEXT DEFAULT 'pending'
                   CHECK (status IN ('pending', 'contacted', 'resolved')),
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- Habilitar RLS en tablas base
-- =============================================
ALTER TABLE profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses        ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories       ENABLE ROW LEVEL SECURITY;
ALTER TABLE books            ENABLE ROW LEVEL SECURITY;
ALTER TABLE products         ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_extras      ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

-- =============================================
-- Políticas RLS: profiles
-- =============================================
CREATE POLICY "Users can manage own profile" ON profiles
  FOR ALL USING (auth.uid() = id);

-- =============================================
-- Políticas RLS: addresses
-- =============================================
CREATE POLICY "Users can manage own addresses" ON addresses
  FOR ALL USING (user_id = auth.uid());

-- =============================================
-- Políticas RLS: catálogos públicos
-- =============================================
CREATE POLICY "Books viewable by everyone" ON books
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Products viewable by everyone" ON products
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Categories viewable by everyone" ON categories
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Book extras viewable by everyone" ON book_extras
  FOR SELECT USING (TRUE);

-- =============================================
-- Políticas RLS: books (admin)
-- =============================================
CREATE POLICY "Admin HL can manage books" ON books
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin_hl', 'superadmin')
    )
  );

-- =============================================
-- Políticas RLS: products (admin)
-- =============================================
CREATE POLICY "Admin KC can manage products" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin_kc', 'superadmin')
    )
  );

-- =============================================
-- Políticas RLS: categories (admin)
-- =============================================
CREATE POLICY "Admins can manage categories" ON categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin_hl', 'admin_kc', 'superadmin')
    )
  );

-- =============================================
-- Políticas RLS: contact_requests
-- =============================================
CREATE POLICY "Anyone can insert contact_requests" ON contact_requests
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Users view own contact_requests" ON contact_requests
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'superadmin'
    )
  );

CREATE POLICY "Superadmin manages contact_requests" ON contact_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'superadmin'
    )
  );
