-- Políticas RLS para Carrito Unificado y Checkout
-- Migración: 005_unified_cart_checkout_rls
-- Fecha: 2026-09-01

-- =============================================
-- Habilitar RLS en todas las tablas
-- =============================================
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_schedules ENABLE ROW LEVEL SECURITY;

-- =============================================
-- Políticas: cart_items
-- =============================================
CREATE POLICY "Users can manage own cart" ON cart_items
  FOR ALL USING (user_id = auth.uid());

-- =============================================
-- Políticas: orders
-- =============================================
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create own orders" ON orders
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admin HL can view all orders" ON orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin_hl', 'superadmin')
    )
  );

CREATE POLICY "Admin KC can view all orders" ON orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin_kc', 'superadmin')
    )
  );

CREATE POLICY "Superadmin can manage all orders" ON orders
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'superadmin'
    )
  );

-- =============================================
-- Políticas: sub_orders
-- =============================================
CREATE POLICY "Users view own sub_orders" ON sub_orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = sub_orders.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admin HL manages HL sub_orders" ON sub_orders
  FOR ALL USING (
    brand = 'hl' AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin_hl', 'superadmin')
    )
  );

CREATE POLICY "Admin KC manages KC sub_orders" ON sub_orders
  FOR ALL USING (
    brand = 'kc' AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin_kc', 'superadmin')
    )
  );

-- =============================================
-- Políticas: order_items
-- =============================================
CREATE POLICY "Users view own order_items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM sub_orders so
      JOIN orders o ON o.id = so.order_id
      WHERE so.id = order_items.sub_order_id 
      AND o.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins manage order_items" ON order_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM sub_orders so
      JOIN profiles p ON p.id = auth.uid()
      WHERE so.id = order_items.sub_order_id 
      AND (
        (so.brand = 'hl' AND p.role IN ('admin_hl', 'superadmin'))
        OR
        (so.brand = 'kc' AND p.role IN ('admin_kc', 'superadmin'))
      )
    )
  );

-- =============================================
-- Políticas: payments
-- =============================================
CREATE POLICY "Users view own payments" ON payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = payments.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users create own payments" ON payments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = payments.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins manage payments" ON payments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin_hl', 'admin_kc', 'superadmin')
    )
  );

-- =============================================
-- Políticas: payment_schedules
-- =============================================
CREATE POLICY "Users view own payment_schedules" ON payment_schedules
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = payment_schedules.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins manage payment_schedules" ON payment_schedules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin_hl', 'admin_kc', 'superadmin')
    )
  );
