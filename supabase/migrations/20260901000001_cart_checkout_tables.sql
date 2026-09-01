-- Carrito Unificado y Checkout
-- Migración: 005_unified_cart_checkout
-- Fecha: 2026-09-01

-- =============================================
-- Tabla: cart_items
-- =============================================
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

CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX idx_cart_items_item ON cart_items(item_type, item_id);

-- =============================================
-- Tabla: orders
-- =============================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  order_number TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending_payment' CHECK (status IN (
    'pending_payment', 'payment_verified', 'preparing', 
    'shipped', 'in_transit', 'delivered', 'cancelled'
  )),
  total_amount DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  shipping_method TEXT CHECK (shipping_method IN ('mrw', 'zoom')),
  shipping_address JSONB NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('pago_movil', 'binance', 'installments')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN (
    'pending', 'partial', 'completed', 'failed'
  )),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_number ON orders(order_number);

-- =============================================
-- Tabla: sub_orders
-- =============================================
CREATE TABLE sub_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  brand TEXT NOT NULL CHECK (brand IN ('hl', 'kc')),
  order_number TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending_payment' CHECK (status IN (
    'pending_payment', 'payment_verified', 'preparing', 
    'shipped', 'in_transit', 'delivered', 'cancelled'
  )),
  subtotal DECIMAL(10,2) NOT NULL,
  tracking_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sub_orders_order_id ON sub_orders(order_id);
CREATE INDEX idx_sub_orders_brand ON sub_orders(brand);

-- =============================================
-- Tabla: order_items
-- =============================================
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sub_order_id UUID NOT NULL REFERENCES sub_orders(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('book', 'product')),
  item_id UUID NOT NULL,
  item_name TEXT NOT NULL,
  item_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  extras JSONB DEFAULT '[]',
  customization JSONB DEFAULT '{}',
  subtotal DECIMAL(10,2) NOT NULL
);

CREATE INDEX idx_order_items_sub_order_id ON order_items(sub_order_id);

-- =============================================
-- Tabla: payments
-- =============================================
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

CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(status);

-- =============================================
-- Tabla: payment_schedules
-- =============================================
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

CREATE INDEX idx_payment_schedules_order_id ON payment_schedules(order_id);
CREATE INDEX idx_payment_schedules_status ON payment_schedules(status);

-- =============================================
-- Tabla: shipping_rates
-- =============================================
CREATE TABLE shipping_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  carrier TEXT NOT NULL CHECK (carrier IN ('mrw', 'zoom')),
  min_weight_kg DECIMAL(5,2) NOT NULL,
  max_weight_kg DECIMAL(5,2) NOT NULL,
  rate_usd DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE
);

-- =============================================
-- Tabla: exchange_rate
-- =============================================
CREATE TABLE exchange_rate (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rate_usd_to_ves DECIMAL(10,2) NOT NULL,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- Tabla: installment_config
-- =============================================
CREATE TABLE installment_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  min_installments INTEGER NOT NULL DEFAULT 2,
  max_installments INTEGER NOT NULL DEFAULT 4,
  interest_rate DECIMAL(5,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE
);

-- =============================================
-- Insertar datos de ejemplo
-- =============================================
INSERT INTO shipping_rates (carrier, min_weight_kg, max_weight_kg, rate_usd) VALUES
  ('mrw', 0, 1, 5),
  ('mrw', 1, 3, 8),
  ('mrw', 3, 5, 12),
  ('mrw', 5, 10, 18),
  ('zoom', 0, 1, 4),
  ('zoom', 1, 3, 7),
  ('zoom', 3, 5, 10),
  ('zoom', 5, 10, 15);

INSERT INTO exchange_rate (rate_usd_to_ves) VALUES (36.5);

INSERT INTO installment_config (min_installments, max_installments) VALUES (2, 4);
