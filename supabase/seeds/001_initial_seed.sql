-- =============================================
-- Seed Data: Categorias, Libros, Productos y Extras
-- =============================================
-- NOTA: Ejecutar despues de las migraciones 001_cart_checkout_tables
--       y 002_cart_checkout_rls.
-- NOTA: Requiere que los usuarios de Auth existan primero.
--       Ver instrucciones en supabase/SEED_README.md
-- NOTA: Este script es IDEMPOTENTE (puede ejecutarse varias veces
--       sin duplicar datos gracias a ON CONFLICT DO NOTHING).

-- =============================================
-- 1. Categorias
-- =============================================
-- Hecho Letras (hl)
INSERT INTO categories (name, slug, brand, description, sort_order) VALUES
  ('Ficcion', 'ficcion', 'hl', 'Novelas, cuentos y relatos de autores venezolanos e internacionales', 1),
  ('No Ficcion', 'no-ficcion', 'hl', 'Ensayos, biografias, historia y divulgacion', 2),
  ('Infantil', 'infantil', 'hl', 'Libros para ninos y jovenes', 3)
ON CONFLICT (slug) DO NOTHING;

-- KamCat (kc)
INSERT INTO categories (name, slug, brand, description, sort_order) VALUES
  ('Cuadernos', 'cuadernos', 'kc', 'Cuadernos personalizados y de diseo unico', 1),
  ('Lapiceria', 'lapiceria', 'kc', 'Boligrafos, lapices y marcadores creativos', 2),
  ('Stickers y Adhesivos', 'stickers', 'kc', 'Stickers decorativos, etiquetas y vinilos', 3)
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- 2. Libros (Hecho Letras)
-- =============================================
INSERT INTO books (
  title, author, description, price, images, slug,
  category_id, status, stock_status, delivery_days,
  editorial, pages, language, binding, is_featured, is_active
) VALUES
  (
    'Cien anos de soledad',
    'Gabriel Garcia Marquez',
    'La obra maestra del realismo magico. La historia de la familia Buendia a lo largo de siete generaciones en el pueblo de Macondo.',
    35.00,
    ARRAY['https://placehold.co/600x900/1E3A5F/FFFFFF?text=Cien+Anos'],
    'cien-anos-de-soledad',
    (SELECT id FROM categories WHERE slug = 'ficcion' AND brand = 'hl'),
    'available', 'in_stock', 7,
    'Editorial Sudamericana', 471, 'Espanol', 'Tapa blanda',
    TRUE, TRUE
  ),
  (
    'El principito',
    'Antoine de Saint-Exupery',
    'Un clasico atemporal sobre la amistad, el amor y la perdida de la inocencia contado a traves de un piloto varado en el desierto.',
    18.00,
    ARRAY['https://placehold.co/600x900/1E3A5F/FFFFFF?text=Principito'],
    'el-principito',
    (SELECT id FROM categories WHERE slug = 'infantil' AND brand = 'hl'),
    'available', 'in_stock', 5,
    'Reynal & Hijos', 96, 'Espanol', 'Tapa dura',
    TRUE, TRUE
  ),
  (
    'La ciudad y los perros',
    'Mario Vargas Llosa',
    'La novela que inauguro el boom latinoamericano. Un retrato crudo de la vida en un colegio militar en Lima.',
    28.00,
    ARRAY['https://placehold.co/600x900/1E3A5F/FFFFFF?text=Ciudad+Perros'],
    'la-ciudad-y-los-perros',
    (SELECT id FROM categories WHERE slug = 'ficcion' AND brand = 'hl'),
    'available', 'on_demand', 10,
    'Seix Barral', 340, 'Espanol', 'Tapa blanda',
    FALSE, TRUE
  ),
  (
    'Breve historia del tiempo',
    'Stephen Hawking',
    'Una introduccion accesible a la cosmologia moderna, desde el Big Bang hasta los agujeros negros.',
    32.00,
    ARRAY['https://placehold.co/600x900/1E3A5F/FFFFFF?text=Breve+Historia'],
    'breve-historia-del-tiempo',
    (SELECT id FROM categories WHERE slug = 'no-ficcion' AND brand = 'hl'),
    'available', 'in_stock', 7,
    'Bantam Books', 256, 'Espanol', 'Tapa blanda',
    FALSE, TRUE
  ),
  (
    'Rayuela',
    'Julio Cortazar',
    'La novela lúdica por excelencia. Una aventura literaria que se puede leer de multiples maneras.',
    30.00,
    ARRAY['https://placehold.co/600x900/1E3A5F/FFFFFF?text=Rayuela'],
    'rayuela',
    (SELECT id FROM categories WHERE slug = 'ficcion' AND brand = 'hl'),
    'pre_order', 'on_demand', 14,
    'Editorial Sudamericana', 635, 'Espanol', 'Tapa blanda',
    FALSE, TRUE
  ),
  (
    'El vocabulario de la introversion',
    'Susan Cain',
    'Como los introvertidos pueden prosperar en un mundo que sobrevalora la extroversion.',
    22.00,
    ARRAY['https://placehold.co/600x900/1E3A5F/FFFFFF?text=Vocabulario'],
    'el-vocabulario-de-la-introversion',
    (SELECT id FROM categories WHERE slug = 'no-ficcion' AND brand = 'hl'),
    'available', 'in_stock', 5,
    'Atria', 352, 'Espanol', 'Tapa blanda',
    FALSE, TRUE
  )
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- 3. Productos (KamCat)
-- =============================================

-- 3.1 Cuaderno Arcoiris
INSERT INTO products (
  name, description, price, images, slug,
  category_id, brand, variants, customization_options,
  is_active
) VALUES
(
  'Cuaderno Arcoiris',
  'Cuaderno artesanal con tapa de cartulina colorida. Ideal para notas, diarios o proyectos creativos.',
  8.00,
  ARRAY['https://placehold.co/600x600/7C3AED/FFFFFF?text=Cuaderno+Arcoiris'],
  'cuaderno-arcoiris',
  (SELECT id FROM categories WHERE slug = 'cuadernos' AND brand = 'kc'),
  'kc',
  '[
    {
      "name": "Tamano",
      "options": [
        { "label": "A5", "value": "a5", "price_adjustment": 0 },
        { "label": "A4", "value": "a4", "price_adjustment": 2.50 }
      ]
    },
    {
      "name": "Color",
      "options": [
        { "label": "Rosa", "value": "rosa", "price_adjustment": 0, "color_hex": "#F472B6" },
        { "label": "Morado", "value": "morado", "price_adjustment": 0, "color_hex": "#7C3AED" },
        { "label": "Azul", "value": "azul", "price_adjustment": 0, "color_hex": "#3B82F6" }
      ]
    }
  ]',
  '[
    { "type": "text", "label": "Nombre grabado", "max_length": 20, "placeholder": "Escribe tu nombre" }
  ]',
  TRUE
) ON CONFLICT (slug) DO NOTHING;

-- 3.2 Lapicero Brillante
INSERT INTO products (
  name, description, price, images, slug,
  category_id, brand, variants, customization_options,
  is_active
) VALUES
(
  'Lapicero Brillante',
  'Boligraf metalico con punta de gel y tinta fluida. Disponible en varios colores metalicos.',
  4.50,
  ARRAY['https://placehold.co/600x600/7C3AED/FFFFFF?text=Lapicero'],
  'lapicero-brillante',
  (SELECT id FROM categories WHERE slug = 'lapiceria' AND brand = 'kc'),
  'kc',
  '[
    {
      "name": "Color",
      "options": [
        { "label": "Dorado", "value": "dorado", "price_adjustment": 0, "color_hex": "#E8B923" },
        { "label": "Plateado", "value": "plateado", "price_adjustment": 0, "color_hex": "#C0C0C0" },
        { "label": "Rose Gold", "value": "rose_gold", "price_adjustment": 0.50, "color_hex": "#B76E79" }
      ]
    }
  ]',
  '[
    { "type": "text", "label": "Iniciales", "max_length": 3, "placeholder": "ABC" }
  ]',
  TRUE
) ON CONFLICT (slug) DO NOTHING;

-- 3.3 Pack Stickers Literarios
INSERT INTO products (
  name, description, price, images, slug,
  category_id, brand, variants, customization_options,
  is_active
) VALUES
(
  'Pack Stickers Literarios',
  'Set de 12 stickers con frases de libros clasicos. Vinilo resistente al agua.',
  3.00,
  ARRAY['https://placehold.co/600x600/7C3AED/FFFFFF?text=Stickers'],
  'pack-stickers-literarios',
  (SELECT id FROM categories WHERE slug = 'stickers' AND brand = 'kc'),
  'kc',
  '[]',
  '[]',
  TRUE
) ON CONFLICT (slug) DO NOTHING;

-- 3.4 Cuaderno Botanico
INSERT INTO products (
  name, description, price, images, slug,
  category_id, brand, variants, customization_options,
  is_active
) VALUES
(
  'Cuaderno Botanico',
  'Cuaderno de tapa rigida con ilustraciones botanicas. 120 hojas lisas de papel crema.',
  12.00,
  ARRAY['https://placehold.co/600x600/7C3AED/FFFFFF?text=Botanico'],
  'cuaderno-botanico',
  (SELECT id FROM categories WHERE slug = 'cuadernos' AND brand = 'kc'),
  'kc',
  '[
    {
      "name": "Tamano",
      "options": [
        { "label": "A5", "value": "a5", "price_adjustment": 0 },
        { "label": "B5", "value": "b5", "price_adjustment": 3.00 }
      ]
    }
  ]',
  '[
    { "type": "text", "label": "Titulo personalizado", "max_length": 30, "placeholder": "Mi diario" }
  ]',
  TRUE
) ON CONFLICT (slug) DO NOTHING;

-- 3.5 Set de Marcadores Neon
INSERT INTO products (
  name, description, price, images, slug,
  category_id, brand, variants, customization_options,
  is_active
) VALUES
(
  'Set de Marcadores Neon',
  'Pack de 6 marcadores neon de punta dual. Colores vibrantes para resaltar y decorar.',
  6.50,
  ARRAY['https://placehold.co/600x600/7C3AED/FFFFFF?text=Marcadores'],
  'set-marcadores-neon',
  (SELECT id FROM categories WHERE slug = 'lapiceria' AND brand = 'kc'),
  'kc',
  '[
    {
      "name": "Cantidad",
      "options": [
        { "label": "6 unidades", "value": "6", "price_adjustment": 0 },
        { "label": "12 unidades", "value": "12", "price_adjustment": 4.00 }
      ]
    }
  ]',
  '[]',
  TRUE
) ON CONFLICT (slug) DO NOTHING;

-- 3.6 Vinilo Decorativo Libro Abierto
INSERT INTO products (
  name, description, price, images, slug,
  category_id, brand, variants, customization_options,
  is_active
) VALUES
(
  'Vinilo Decorativo Libro Abierto',
  'Vinilo adhesivo con diseno de libro abierto. Perfecto para portatil, agenda o mochila.',
  2.50,
  ARRAY['https://placehold.co/600x600/7C3AED/FFFFFF?text=Vinilo'],
  'vinilo-libro-abierto',
  (SELECT id FROM categories WHERE slug = 'stickers' AND brand = 'kc'),
  'kc',
  '[]',
  '[]',
  TRUE
) ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- 4. Book Extras (Cross-sell: Libros -> Productos KC)
-- =============================================
INSERT INTO book_extras (book_id, product_id, is_default, sort_order) VALUES
  (
    (SELECT id FROM books WHERE slug = 'cien-anos-de-soledad'),
    (SELECT id FROM products WHERE slug = 'cuaderno-arcoiris'),
    TRUE, 1
  ),
  (
    (SELECT id FROM books WHERE slug = 'cien-anos-de-soledad'),
    (SELECT id FROM products WHERE slug = 'pack-stickers-literarios'),
    FALSE, 2
  ),
  (
    (SELECT id FROM books WHERE slug = 'el-principito'),
    (SELECT id FROM products WHERE slug = 'cuaderno-botanico'),
    TRUE, 1
  ),
  (
    (SELECT id FROM books WHERE slug = 'rayuela'),
    (SELECT id FROM products WHERE slug = 'lapicero-brillante'),
    TRUE, 1
  ),
  (
    (SELECT id FROM books WHERE slug = 'rayuela'),
    (SELECT id FROM products WHERE slug = 'vinilo-libro-abierto'),
    FALSE, 2
  ),
  (
    (SELECT id FROM books WHERE slug = 'la-ciudad-y-los-perros'),
    (SELECT id FROM products WHERE slug = 'set-marcadores-neon'),
    TRUE, 1
  )
ON CONFLICT DO NOTHING;
